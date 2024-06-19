import { ApiProperty } from "@nestjs/swagger";

export class CreatePromotionsDto {
    @ApiProperty()
    annee_promotion: number;

    @ApiProperty()
    nom_promotion: string;
}

export class UpdatePromotionsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    annee_promotion: number;

    @ApiProperty()
    nom_promotion: string;
}

export class ParamPromotionsIdDto {
    @ApiProperty()
    promotion_id: number;
}

export class ParamStatusProDto {
    @ApiProperty()
    status_id: number;
}