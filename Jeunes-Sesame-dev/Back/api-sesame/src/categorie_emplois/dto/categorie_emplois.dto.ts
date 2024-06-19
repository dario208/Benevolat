import { ApiProperty } from "@nestjs/swagger";

export class CreateCatrgorieEmploisDto {
    @ApiProperty()
    categorie: string;
}

export class ParamCategorieEmploisDto {
    @ApiProperty()
    categorie_id: number;
}
