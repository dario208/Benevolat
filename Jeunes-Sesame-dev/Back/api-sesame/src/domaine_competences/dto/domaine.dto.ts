import { ApiProperty } from "@nestjs/swagger";

export class CreateDomaineDto {
    @ApiProperty()
    nom_domaine: string;
}

export class UpdateDomaineDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_domaine: string;
}

interface FilieresDto {
    id: number;
    nom: string;
}
export class ResponseDomaineCompetences {
    id: number;
    nom: string;
    liste_filieres: FilieresDto[];
}
