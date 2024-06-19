import { ApiProperty } from "@nestjs/swagger";

export class CreateConsultationsDto {
    @ApiProperty()
    description: string;
}

export class ParamConsultationsIdDto {
    @ApiProperty()
    consultation_id: number;
}

export class UpdateConsultationsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    description: string;
}
