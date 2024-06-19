export class StatusProOthersModel {
    id!: number;
    status!: string;
}

export class DomainesOthersModel {
    id!: number;
    nom!: string;
    liste_filieres!: any[];
}

export class FilieresOthersModel {
    id!: number;
    nom_filiere!: string;
    nom_domaine!: string;
}

export class PromotionsOthersModel {
    id!: number;
    annee!: number;
    nom!: string;
}

export class RegionsOthersModel {
    id!: number;
    nom!: string;
    path!: string;
}

export class ExporterModel {
    domaine_id!: number[];
    promotion_id!: number[];
    filiere_id!: number[];
    status_id!: number[];
    region_id!: number[];
}
