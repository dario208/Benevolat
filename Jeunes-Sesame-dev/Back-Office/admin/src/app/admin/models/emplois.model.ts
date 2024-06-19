export class EmploisModel {
    id!: number;
    nom_emploi!: string;
    description!: string;
    created_at!: Date;
    nom_admin!: string;
    categorie_id!: string;
    categorie_emplois!: string;
}

export class CreateEmploisModel {
    nom_emploi!: string;
    description!: string;
    status_id!: number[];
    domaine_id!: number[];
    categorie_id!: number[];
}

export class CategorieModel {
    id!: number;
    categorie!: string;
}

export class DomaineModel {
    id!: number;
    nom!: string;
    liste_filieres!: {id: number; nom: string}[];
}

export class StatusModel {
    id!: number;
    status!: string;
}

export class UpdateEmploisModel {
    id!: number;
    nom_emploi!: string;
    description!: string;
    categorie_id!: number[];
}
