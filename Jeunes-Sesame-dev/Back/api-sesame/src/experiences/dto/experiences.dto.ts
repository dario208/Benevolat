import { ApiProperty } from "@nestjs/swagger";

export class CreateExperiencesDto {
    @ApiProperty()
    nom_experience: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annee: string;

    @ApiProperty()
    description: string;
}

export class ParamExperiencesEtudiantIdDto {
    @ApiProperty()
    etudiant_id: number;
}

export class UpdateExperiencesDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_experience: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annee: string;

    @ApiProperty()
    description: string;
}

export class ParamExperiencesIdDto {
    @ApiProperty()
    experience_id: number;
}
