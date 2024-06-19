import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty()
    identifiant: string;

    @ApiProperty()
    password: string;
}

export class AuthReponseDto {
    id: number;
    nom: string;
    prenoms: string;
    email: string;
    fonction: string;
}

export class AuthReponseToken {
    access_token: string;
}
