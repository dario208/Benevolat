import { createReadStream } from "node:fs";
import readexcelfile from "read-excel-file/node";
import dotenv from 'dotenv';
import mysql from "mysql";

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});


const insertData = () => {
    connection.connect((err: Error) => {
        if (err) throw err;
        console.log(`Connected to ${process.env.DB} database`);
        insertStudents();
    });
};


const getDataFromExcel = async () => {
    const data = (await readexcelfile(createReadStream("data.xlsx"))).filter(
        (row, index) => (index !== 0) && row[10] !== null
    )
    return data;
};


const insertFilieres = async (filiere: string, domaine: string) => {
    connection.query(
        `
            INSERT INTO filieres(
                nom_filiere, domaine_id
            ) VALUES(
                '${filiere}',
                ${(domaine !== null) ? `(SELECT id FROM domaine_competences WHERE nom_domaine = '${domaine.replace("'", "\\'")}')` : null}
            );
        `,
        (_err, _results) => {
        }
    );
};


const insertStudents = async () => {
    const students = await getDataFromExcel();
    students.forEach(async (s, index) => {
        const nom = s[4].toString().trim();
        const prenoms = s[3].toString().trim();
        const fonction = "etudiants";
        const ecole = s[8] ? s[8].toString() : null;
        const filiere = s[9];
        let niveauEtude: string | null = s[1].toString();
        const email = s[10].toString().split("/")[0];
        const region = s[5];
        const domaine = s[7] ? s[7].toString() : null;
        const status = s[1].toString();

        let promotion = s[0].toString();
        promotion = `Promotion 20${promotion.slice(-2)}`;

        // Récupération status and niveauEtude
        let statusId = null;
        const niveauList = ["L1", "L2", "L3", "M1", "M2"];
        if (niveauList.includes(status as string)) { statusId = 3; niveauEtude = status; }
        else if (["IP", "AP"].includes(status)) { statusId = (status == "IP") ? 1 : 3; niveauEtude = null; }
        else if (status.includes("hors")) { statusId = 3; niveauEtude = status.includes("Master") ? "Master" : null; }
        else { statusId = 2; niveauEtude = null; };

        // // Insertion des filières dans la base
        if (filiere !== null) {
            await insertFilieres(filiere as string, domaine as string);
        }

        // Insertion proprement students
        connection.query(
            `
                INSERT INTO etudiants(
                    nom, prenoms, fonction , ecole, niveau_etude, email, status_id, region_id, domaine_id, promotion_id, filiere_id
                )
                VALUES(
                    '${nom.replace("'", "\\'")}', '${prenoms.replace("'", "\\'")}', '${fonction}', 
                    '${ecole ? ecole.replace("'", "\\'") : null}', '${niveauEtude}', '${email}', ${statusId},
                    ${(region !== null) ? `(SELECT id FROM regions WHERE nom_region = '${region}')` : null},
                    ${(domaine !== null) ? `(SELECT id FROM domaine_competences WHERE nom_domaine = '${domaine.replace("'", "\\'")}')` : null},
                    ${(promotion !== null) ? `(SELECT id FROM promotions WHERE nom_promotion = '${promotion}')` : null},
                    ${(filiere !== null) ? `(SELECT id FROM filieres WHERE nom_filiere = '${filiere}')` : null}
                );
            `,
            (err, _results) => {
                if (err) throw err;
                if (index + 1 < students.length - 1) {
                    console.log("Inserted data:", index + 1, "/", students.length - 1);
                    if (index + 1 === students.length - 1) {
                        console.log("___Finished___");
                        connection.end();
                        process.exit();
                    }
                }
            }
        );
    });
};

insertData();