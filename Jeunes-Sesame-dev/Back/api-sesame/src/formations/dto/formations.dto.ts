import { ApiProperty } from "@nestjs/swagger";

export class CreateFormationsDto {
    @ApiProperty()
    nom_formation: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annee: string;

    @ApiProperty()
    description: string;
}

export class ParamFormationsEtudiantIdDto {
    @ApiProperty()
    etudiant_id: number;
}

export class UpdateFormationsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_formation: string;

    @ApiProperty()
    lieu: string;

    @ApiProperty()
    annee: string;

    @ApiProperty()
    description: string;
}

export class ParamFormationsIdDto {
    @ApiProperty()
    formation_id: number;
}
