import { ApiProperty } from "@nestjs/swagger";

export class CreateProjetsDto {
    @ApiProperty()
    nom: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    lien: string;

    @ApiProperty()
    img: string;
}

export class ParamProjetsEtudiantId {
    @ApiProperty()
    etudiant_id: number;
}

export class UpdateProjetsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    lien: string;

    @ApiProperty()
    img: string;
}

export class ParamProjetsIdDto {
    @ApiProperty()
    projet_id: number;
}
