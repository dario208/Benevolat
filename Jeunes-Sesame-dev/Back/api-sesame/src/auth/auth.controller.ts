import { Body, Controller, 
    NotAcceptableException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('etudiants')
    async authEtudiants(@Body() donnees: AuthDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects');
        return await this.authService.signinEtudiants(donnees);
    }

    @Post('admin')
    async authAdmin(@Body() donnees: AuthDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.authService.signinAdmin(donnees);
    }
}
