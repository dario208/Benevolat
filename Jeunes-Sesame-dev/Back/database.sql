CREATE DATABASE IF NOT EXISTS SESAME;
USE SESAME;
CREATE TABLE IF NOT EXISTS consultations(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS regions(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_region VARCHAR(255),
    path_region TEXT
);

CREATE TABLE IF NOT EXISTS domaine_competences(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_domaine VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS filieres(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_filiere VARCHAR(255),
    domaine_id INT(11) NOT NULL,
    CONSTRAINT fk_domaine_id_filieres FOREIGN KEY(domaine_id)
        REFERENCES domaine_competences(id)
);

CREATE TABLE IF NOT EXISTS status_professionnels(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS promotions(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    annee_promotion INT(4) NOT NULL,
    nom_promotion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS administrateurs(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NULL,
    prenoms VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fonction VARCHAR(50) NOT NULL DEFAULT "admin",
    `description` VARCHAR(255),
    profil_path VARCHAR(255),
    `password` TEXT,
    refresh_token TEXT,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS etudiants(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenoms VARCHAR(255) NOT NULL,
    fonction VARCHAR(50) NOT NULL DEFAULT "etudiants",
    ecole VARCHAR(255),
    niveau_etude VARCHAR(255),
    tel1 VARCHAR(20) NOT NULL,
    tel2 VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    linkedin VARCHAR(255),
    facebook VARCHAR(255),
    lien_cv VARCHAR(255),
    `description` TEXT DEFAULT NULL,
    pdp VARCHAR(255),
    pdc VARCHAR(255),
    `password` TEXT,
    refresh_token TEXT,
    promotion_id INT(11) NOT NULL,
    region_id INT(11) NOT NULL,
    domaine_id INT(11) NOT NULL,
    filiere_id INT(11) NOT NULL,
    status_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_promotion_id_etudiants FOREIGN KEY(promotion_id)
        REFERENCES promotions(id),
    CONSTRAINT fk_region_id_etudiants FOREIGN KEY(region_id)
        REFERENCES regions(id),
    CONSTRAINT fk_domaine_id_etudiants FOREIGN KEY(domaine_id)
        REFERENCES domaine_competences(id),
    CONSTRAINT fk_filiere_id_etudiants FOREIGN KEY(filiere_id)
        REFERENCES filieres(id),
    CONSTRAINT fk_status_id_etudiants FOREIGN KEY(status_id)
        REFERENCES status_professionnels(id)
);

CREATE TABLE IF NOT EXISTS formations(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_formation VARCHAR(255),
    lieu VARCHAR(255),
    annee VARCHAR(255),
    `description` TEXT,
    etudiant_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_etudiant_id_formations FOREIGN KEY(etudiant_id)
        REFERENCES etudiants(id)
);

CREATE TABLE IF NOT EXISTS competences(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_competence VARCHAR(255),
    liste VARCHAR(255),
    `description` TEXT,
    etudiant_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_etudiant_id_competences FOREIGN KEY(etudiant_id)
        REFERENCES etudiants(id)
);

CREATE TABLE IF NOT EXISTS experiences(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_experience VARCHAR(255),
    lieu VARCHAR(255),
    annee VARCHAR(255),
    `description` TEXT,
    etudiant_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_etudiant_id_experiences FOREIGN KEY(etudiant_id)
        REFERENCES etudiants(id)
);

CREATE TABLE IF NOT EXISTS distinctions(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_distinction VARCHAR(255),
    organisateur VARCHAR(255),
    lieu VARCHAR(255),
    annee VARCHAR(255),
    `description` TEXT,
    etudiant_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_etudiant_id_distinctions FOREIGN KEY(etudiant_id)
        REFERENCES etudiants(id)
);

CREATE TABLE IF NOT EXISTS categorie_emplois(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    categorie VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS emplois(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom_emploi VARCHAR(255),
    `description` TEXT,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    admnistrateur_id INT(11) NOT NULL,
    categorie_id VARCHAR(11) NOT NULL,
    CONSTRAINT fk_administrateur_id_emplois FOREIGN KEY(admnistrateur_id)
        REFERENCES administrateurs(id)
);

CREATE TABLE IF NOT EXISTS projets(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    lien TEXT,
    img TEXT,
    etudiant_id INT(11) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_etudiant_id_projets FOREIGN KEY(etudiant_id)
        REFERENCES etudiants(id)
);
