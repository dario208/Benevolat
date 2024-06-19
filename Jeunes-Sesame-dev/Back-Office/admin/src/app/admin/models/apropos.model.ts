export class AproposModel {
    id!: number;
    nom!: string;
    prenoms!: string;
    email!: string;
    description!: string | null;
    profil_path!: string;
}

export class CreateAdminModel {
    nom!: string;
    prenoms!: string;
    email!: string;
}

export class UpdateAproposModel {
    email!: string;
    description!: string;
}

export class UpdatePasswordModel {
    lastPassword!: string;
    newPassword!: string;
}
