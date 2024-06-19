import { ApiProperty } from "@nestjs/swagger";

export class CreateRegionsDto {
    @ApiProperty()
    nom_region: string;
}

export class UpdateRegionsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nom_region: string;
}
