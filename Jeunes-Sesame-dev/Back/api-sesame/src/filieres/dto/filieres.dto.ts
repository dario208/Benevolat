import { ApiProperty } from "@nestjs/swagger";

export class CreateFilieresDto {
    @ApiProperty()
    nom_filiere: string;

    @ApiProperty()
    domaine_id: number;
}

export class UpdateFilieresDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_filiere: string;

    @ApiProperty()
    domaine_id: number;
}

export class ParamFilieresDomaineId {
    @ApiProperty()
    domaine_id: number;
}
