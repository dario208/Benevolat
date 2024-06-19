import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrateurs } from 'src/entities/Administrateurs';
import { Etudiants } from 'src/entities/Etudiants';
import { Repository } from 'typeorm';
import { AuthDto, AuthReponseDto, AuthReponseToken } from './dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Etudiants)
        private etudiantsRepository: Repository<Etudiants>,
        @InjectRepository(Administrateurs)
        private administrateursRepository: Repository<Administrateurs>,
        private jwtService: JwtService
    ) {}

    async signAuth(donnees: AuthReponseDto): Promise<string> {
        return await this.jwtService.signAsync({
            id: donnees.id,
            nom: donnees.nom,
            prenoms: donnees.prenoms,
            email: donnees.email,
            fonction: donnees.fonction
        });
    }

    async signinEtudiants(donnees: AuthDto): Promise<AuthReponseToken> {
        const reponse: Etudiants = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms', 
            'e.email as email', 'e.fonction as fonction'
        ])
        .where(`e.email=:identifiant AND e.password=SHA2(:password, 256) AND e.actif=:actif`, {
            identifiant: donnees.identifiant,
            password: donnees.password,
            actif: 1
        })
        .getRawOne();
        if(!reponse) throw new UnauthorizedException('Credentials incorrects !');
        return {
            access_token: await this.signAuth(reponse)
        };
    }

    async signinAdmin(donnees: AuthDto): Promise<AuthReponseToken> {
        const reponse: Administrateurs = await this.administrateursRepository
        .createQueryBuilder('a')
        .select([
            'a.id as id', 'a.nom as nom', 'a.prenoms as prenoms',
            'a.email as email', 'a.fonction as fonction'
        ])
        .where(`a.email=:identifiant AND a.password=SHA2(:password, 256) AND a.actif=:actif`, {
            identifiant: donnees.identifiant,
            password: donnees.password,
            actif: 1
        })
        .getRawOne();

        if(!reponse) throw new UnauthorizedException('Credentials incorrects !');
        return {
            access_token: await this.signAuth(reponse)
        };
    }
}
