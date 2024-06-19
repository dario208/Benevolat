import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
    @ApiProperty()
    nom: string;

    @ApiProperty()
    prenoms: string;

    @ApiProperty()
    email: string;
}

export class UpdateAdminDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    description: string;
}

export class UpdateAdminPasswordDto {
    @ApiProperty()
    lastPassword: string;

    @ApiProperty()
    newPassword: string;
}

export class MailDataDto {
    dest_mail: string;
    subject_mail: string;
    content_mail: string;
}

export class UpdateForgotPasswordAdminDto {
    @ApiProperty()
    email: string;
}
