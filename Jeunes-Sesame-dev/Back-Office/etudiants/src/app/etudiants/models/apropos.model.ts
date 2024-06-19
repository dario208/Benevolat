export class AproposModel {
    id!: number;
    nom!: string;
    prenoms!: string;
    ecole!: string;
    niveau_etude!: string;
    tel1!: string;
    tel2?: string;
    email!: string;
    linkedin?: string;
    facebook?: string;
    lien_cv?: string;
    description?: string;
    pdp!: string;
    pdc!: string;
    created_at!: Date;
    updated_at?: Date | null;
    promotion_id!: number;
    promotion!: number;
    region_id!: number;
    nom_region!: string;
    domaine_id!: number;
    nom_domaine!: string;
    filiere_id!: number;
    nom_filiere!: string;
    status_id!: number;
    status_professionnel!: string;
    popularity!: number;
}

export class UpdateAproposModel {
    ecole!: string;
    niveau_etude!: string;
    tel1!: string;
    tel2?: string;
    email!: string;
    linkedin?: string;
    facebook?: string;
    lien_cv?: string;
    description?: string;
    promotion_id!: number;
    region_id!: number;
    domaine_id!: number;
    filiere_id!: number;
    status_id!: number;
}

export class UpdatePasswordModel {
    lastPassword!: string;
    newPassword!: string;
}
