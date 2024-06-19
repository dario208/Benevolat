import { ApiProperty } from "@nestjs/swagger";

export class CreateStatusDto {
    @ApiProperty()
    description: string;
}

export class UpdateStatusDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    description: string;
}
