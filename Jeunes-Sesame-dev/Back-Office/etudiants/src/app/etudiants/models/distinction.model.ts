export class DistinctionModel {
    id!: number;
    nom!: string;
    organisateur!: string;
    lieu?: string;
    annee?: string;
    description?: string;
    nom_etudiant!: string;
    prenoms_etudiant!: string;
    created_at!: Date;
    updated_at?: Date | null;
}

export class CreateDistinctionModel {
    nom_distinction!: string;
    organisateur!: string;
    lieu!: string;
    annee!: string;
    description?: string;
}

export class UpdateDistinctionModel {
    id!: number;
    nom_distinction!: string;
    organisateur!: string;
    lieu!: string;
    annees!: string;
    description?: string;
}
