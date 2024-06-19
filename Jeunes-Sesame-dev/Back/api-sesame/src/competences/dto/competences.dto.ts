import { ApiProperty } from "@nestjs/swagger";

export class CreateCompetencesDto {
    @ApiProperty()
    nom_competence: string;

    @ApiProperty()
    liste: string;

    @ApiProperty()
    description: string;
}

export class ParamCompetencesEtudiantIdDto {
    @ApiProperty()
    etudiant_id: number;
}

export class UpdateCompetencesDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_competence: string;

    @ApiProperty()
    liste: string;

    @ApiProperty()
    description: string;
}

export class ParamCompetencesIdDto {
    @ApiProperty()
    competence_id: number;
}
