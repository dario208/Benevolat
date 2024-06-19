import { ApiProperty } from "@nestjs/swagger";

export class CreateDistinctionsDto {
    @ApiProperty()
    nom_distinction: string;

    @ApiProperty()
    organisateur: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annee: string;

    @ApiProperty()
    description: string;
}

export class ParamDistinctionsEtudiantIdDto {
    @ApiProperty()
    etudiant_id: number;
}

export class UpdateDistinctionsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_distinction: string;

    @ApiProperty()
    organisateur: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annees: string;

    @ApiProperty()
    description: string;
}

export class ParamDistinctionsIdDto {
    @ApiProperty()
    distinction_id: number;
}
