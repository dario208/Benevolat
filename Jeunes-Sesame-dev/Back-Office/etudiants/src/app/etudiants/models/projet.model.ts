export class ProjetModel {
    id!: number;
    nom!: string;
    lien?: string;
    img?: string;
    description?: string;
    nom_etudiant!: string;
    prenoms_etudiant!: string;
    created_at!: Date;
    updated_at?: Date | null;
}

export class CreateProjetModel {
    nom!: string;
    description?: string;
    lien?: string;
    img?: string;
}

export class UpdateProjetModel {
    id!: number;
    nom!: string;
    description?: string;
    lien?: string;
    img?: string;
}
