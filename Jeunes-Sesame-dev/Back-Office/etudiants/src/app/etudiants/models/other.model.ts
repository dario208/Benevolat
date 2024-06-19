export class PromotionsOtherModel {
    id!: number;
    annee!: number;
    nom!: string;
}

export class RegionsOtherModel {
    id!: number;
    nom!: string;
    path!: string;
    nombre_etudiants!: number;
}

export class DomainesOtherModel {
    id!: number;
    nom!: string;
    liste_filieres!: any[];
}

export class FilieresOtherModel {
    id!: number;
    nom_filiere!: string;
    nom_domaine!: string;
}

export class StatusOtherModel {
    id!: number;
    status!: string;
}
