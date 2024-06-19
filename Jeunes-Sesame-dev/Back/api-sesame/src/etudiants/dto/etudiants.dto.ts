import { ApiProperty } from "@nestjs/swagger";

export class CreateEtudiantsDto {
    @ApiProperty()
    nom: string;

    @ApiProperty()
    prenoms: string;

    @ApiProperty()
    email: string;
}

export class ParamEtudiantsIdDto {
    @ApiProperty()
    etudiant_id: number;
}

export class ParamEtudiantsRegionIdDto {
    @ApiProperty()
    region_id: number;
}

export class ParamEtudiantsDomaineIdDto {
    @ApiProperty()
    domaine_id: number;
}

export class ParamEtudiantsFiliereId {
    @ApiProperty()
    filiere_id: number;
}

export class ParamEtudiantsStatusId {
    @ApiProperty()
    status_id: number;
}

export class ParamEtudiantsPromotionId {
    @ApiProperty()
    promotion_id: number;
}

export class UpdateEtudiantsDto {
    @ApiProperty()
    ecole: string;

    @ApiProperty()
    niveau_etude: string;

    @ApiProperty()
    tel1: string;

    @ApiProperty()
    tel2?: string | null;

    @ApiProperty()
    email: string;

    @ApiProperty()
    linkedin: string;

    @ApiProperty()
    facebook: string;

    @ApiProperty()
    lien_cv: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    promotion_id: number;

    @ApiProperty()
    region_id: number;

    @ApiProperty()
    domaine_id: number;

    @ApiProperty()
    filiere_id: number;

    @ApiProperty()
    status_id: number;
}

export class UpdateEtudiantsPasswordDto {
    @ApiProperty()
    lastPassword: string;

    @ApiProperty()
    newPassword: string;
}

export class FiltreEtudiantsDto {
    @ApiProperty()
    promotion_id: number[];

    @ApiProperty()
    filiere_id: number[];

    @ApiProperty()
    status_id: number[];

    @ApiProperty()
    region_id: number[];
}

export class FindFilterEtudiantsDto {
    @ApiProperty()
    domaine_id: number[];

    @ApiProperty()
    promotion_id: number[];

    @ApiProperty()
    filiere_id: number[];

    @ApiProperty()
    status_id: number[];

    @ApiProperty()
    region_id: number[];
}

export class MailDataDto {
    dest_mail: string;
    subject_mail: string;
    content_mail: string;
}

export class UpdateForgotPasswordDto {
    @ApiProperty()
    email: string;
}

export class ParamActifDto {
    @ApiProperty()
    actif_id: 1 | 0;
}

export class ParamStatusProDto {
    @ApiProperty()
    status_id: number;
}

export class CountStatusProAndPromotionsDto {
    @ApiProperty()
    status_id: number;

    @ApiProperty()
    promotion_id: number;
}

export class UpdateNomDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom: string;

    @ApiProperty()
    prenoms: string;

    @ApiProperty()
    email: string;
}

export class ExcelEtudiantsDto {
    nom: string;
    prenoms: string;
    ecole: string;
    niveau_etude: string;
    tel1: string;
    tel2?: string;
    email: string;
    linkedin: string;
    facebook: string;
    lien_cv?: string;
    description: string;
    promotion: number;
    nom_region: string;
    nom_domaine: string;
    nom_filiere: string;
    status_professionnel: string;
}
