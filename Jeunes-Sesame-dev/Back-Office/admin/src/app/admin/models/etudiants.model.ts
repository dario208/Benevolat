export class EtudiantsModel {
    id!: number;
    nom!: string;
    prenoms!: string;
    ecole!: string | null;
    niveau_etude!: string | null;
    tel1!: string | null;
    tel2!: string | null;
    email!: string;
    linkedin!: string | null;
    facebook!: string | null;
    lien_cv!: string | null;
    description!: string | null;
    pdp!: string | null;
    pdc!: string | null;
    created_at!: Date;
    updated_at!: Date | null;
    promotion!: string;
    nom_region!: string;
    nom_domaine!: string;
    nom_filiere!: string;
    status_professionnel!: string;
    status_id!: number | null;
    popularity!: number;
}

export class StatusProModel {
    id!: number;
    status!: string;
}

export class DomaineCompetencesModel {
    id!: number;
    nom!: string;
    liste_filieres!: any[];
}

export class PromotionsModel {
    id!: number;
    annee!: number;
    nom!: string;
}

export class FilieresModel {
    id!: number;
    nom_filiere!: string;
    nom_domaine!: string;
}

export class CreateEtudiantModel {
    nom!: string;
    prenoms!: string;
    email!: string;
}

export class UpdateEtudiantModel {
    id!: number;
    nom!: string;
    prenoms!: string;
    email!: string;
}
