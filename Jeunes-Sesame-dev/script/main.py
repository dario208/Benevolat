# Read from excel and insert into mariadb database
import pandas as pd
from mysql.connector.connection import MySQLConnection
from typing import Dict, Optional
import dotenv
import warnings
import os

warnings.simplefilter(action="ignore", category=UserWarning)
dotenv.load_dotenv()


def db_connect() -> Optional[MySQLConnection]:
    """Connect to the database

    Returns:
        Optional[MySQLConnection]: A MySQLConnection instance if the connection is successful, None otherwise
    """
    try:
        return MySQLConnection(
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "SESAME"),
            user=os.getenv("DB_USER", "sesame"),
            password=os.getenv("DB_PASS", "sesame"),
        )

    except Exception as e:
        print(e)


def insert_data(conn: MySQLConnection, student: Dict) -> Optional[int]:
    """Insert data into the database

    Args:
        conn (MySQLConnection): A MySQLConnection instance
        student (Dict): A dictionary containing the student's data to be inserted

    Sample student's data:
    {
        "nom": "BOKAZA",
        "prenoms": "Francis",
        "email": "francis.bokazaha@example.com",
        "ecole": "ESMT",
        "niveau_etude": "M1",
        "region": "Atsimo-Atsinanana",
        "promotion": "P19",
        "filiere": "Informatique",
        "domaine": "Science et Technologie"
    }
    Returns:
        Optional[int]: The id of the inserted row if the insertion is successful, None otherwise
    """
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM regions WHERE nom_region=%s", (student["region"],))
    region_id = cursor.fetchone()[0]

    cursor.execute(
        "SELECT id FROM domaine_competences where nom_domaine=%s", (student["domaine"],)
    )
    if (category_id := cursor.fetchone()) is None:
        cursor.execute(
            "INSERT INTO domaine_competences (nom_domaine) VALUES (%s)",
            (student["domaine"],),
        )
        conn.commit()
        category_id = cursor._last_insert_id
    else:
        category_id = category_id[0]

    promo = student["promotion"].replace("P", "20")
    cursor.execute("SELECT id FROM promotions WHERE annee_promotion=%s", (promo,))
    promotion_id = cursor.fetchone()[0]

    cursor.execute(
        "SELECT id FROM filieres WHERE nom_filiere=%s AND domaine_id=%s",
        (student["filiere"], category_id),
    )
    if (filiere_id := cursor.fetchone()) is None:
        cursor.execute(
            "INSERT INTO filieres (nom_filiere, domaine_id) VALUES (%s, %s)",
            (student["filiere"], category_id),
        )
        conn.commit()
        filiere_id = cursor._last_insert_id
    else:
        filiere_id = filiere_id[0]

    cursor.execute(
        "INSERT INTO etudiants (nom, prenoms, email, ecole, niveau_etude, filiere_id, region_id, promotion_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (
            student["nom"],
            student["prenoms"],
            student["email"],
            student["ecole"],
            student["niveau_etude"],
            filiere_id,
            region_id,
            promotion_id,
        ),
    )
    conn.commit()
    return cursor._last_insert_id


if __name__ == "__main__":
    database: Optional[MySQLConnection] = db_connect()
    if database is not None:
        data_frame = pd.read_excel("data.xlsx")
        if (data := data_frame.to_dict(orient="index")) is not None:
            for idx, row in data.items():
                id = insert_data(database, row)
                print(f"[✓] Student on line {idx} inserted into id {id}")
    database.close()
