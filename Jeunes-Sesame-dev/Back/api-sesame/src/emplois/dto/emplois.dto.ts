import { ApiProperty } from "@nestjs/swagger";

export class CreateEmploisDto {
    @ApiProperty()
    nom_emploi: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status_id: number[];

    @ApiProperty()
    domaine_id: number[];

    @ApiProperty()
    categorie_id: number[];
}

export class ParamEmploisIdDto {
    @ApiProperty()
    emploi_id: number;
}

export class ParamEmploisAdminIdDto {
    @ApiProperty()
    administrateur_id: number
}

export class ParamEmploisCategorieIdDto {
    @ApiProperty()
    categorie_id: number;
}

export class UpdateEmploisDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_emploi: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    categorie_id: string[];
}

export class MailDataDto {
    dest_mail: string;
    subject_mail: string;
    content_mail: string;
}
