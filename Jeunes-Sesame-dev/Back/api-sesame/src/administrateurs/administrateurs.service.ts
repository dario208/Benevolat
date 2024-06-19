import { MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrateurs } from 'src/entities/Administrateurs';
import { Repository } from 'typeorm';
import { CreateAdminDto, MailDataDto, UpdateAdminDto, 
    UpdateAdminPasswordDto, UpdateForgotPasswordAdminDto } from './dto';

@Injectable()
export class AdministrateursService {
    constructor(
        @InjectRepository(Administrateurs)
        private adminRepository: Repository<Administrateurs>,
        private mailerService: MailerService
    ) {}

    async create(donnees: CreateAdminDto): Promise<void> {
        await this.adminRepository
        .createQueryBuilder()
        .insert()
        .into(Administrateurs)
        .values({
            nom: donnees.nom,
            prenoms: donnees.prenoms,
            email: donnees.email
        })
        .execute();
    }

    async findone(admin_id: number): Promise<Administrateurs> {
        return await this.adminRepository
        .createQueryBuilder('a')
        .select([
            'a.id as id', 'a.nom as nom', 'a.prenoms as prenoms',
            'a.email as email', 'a.description as description',
            'a.profil_path as profil_path'
        ])
        .where(`a.id=:identifiant AND a.actif=:actif`, {
            identifiant: admin_id,
            actif: 1
        })
        .getRawOne();
    }

    async findall(): Promise<Administrateurs[]> {
        return await this.adminRepository
        .createQueryBuilder('a')
        .select([
            'a.id as id', 'a.nom as nom', 'a.prenoms as prenoms',
            'a.email as email', 'a.description as description',
            'a.profil_path as profil_path'
        ])
        .getRawMany();
    }

    async update(donnees: UpdateAdminDto, admin_id: number): Promise<void> {
        await this.adminRepository
        .createQueryBuilder()
        .update(Administrateurs)
        .set({
            email: donnees.email,
            description: donnees.description,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`,  {identifiant: admin_id})
        .execute();
    }

    async updatePassword(donnees: UpdateAdminPasswordDto, admin_id: number): Promise<void> {
        const verify: Administrateurs = await this.adminRepository
        .createQueryBuilder('a')
        .select([ 'a.id' ])
        .where(`a.id=:identifiant AND a.password=SHA2(:password, 256) AND a.actif=:actif`, {
            identifiant: admin_id,
            password: donnees.lastPassword,
            actif: 1
        })
        .getRawOne();
        
        if(!verify) throw new ForbiddenException('Credentials incorrects !');
        await this.adminRepository
        .createQueryBuilder()
        .update(Administrateurs)
        .set({
            password: () => "SHA2('"+donnees.newPassword+"', 256)",
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: admin_id})
        .execute();
    }

    async updateForgotPassword(donnees: UpdateForgotPasswordAdminDto): Promise<void> {
        const verify: Administrateurs = await this.adminRepository
        .createQueryBuilder('a')
        .select([
            'a.id as id', 
            'a.nom as nom',
            'a.prenoms as prenoms'
        ])
        .where(`a.email=:email AND a.actif=:actif`, {
            email: donnees.email,
            actif: 1
        })
        .getRawOne();

        if(!verify) throw new ForbiddenException('Credentials incorrects');
        const newpassword: string = await this.generateRandomPassword();
        const mail: MailDataDto = {
            dest_mail: donnees.email,
            subject_mail: 'Mot de passe oublié',
            content_mail: `Bonjour <b>${verify.nom} ${verify.prenoms}</b>,<br>
Avec tout votre respect, voici votre nouveau mot de passe ADMINISTRATEUR dans <b>Jeunes-S</b>: <b>${newpassword}</b>
<br><br>
Respectuesement`
        };
        await this.sendMail(mail);

        await this.adminRepository
        .createQueryBuilder()
        .update(Administrateurs)
        .set({
            password: () => "SHA2('"+newpassword+"', 256)",
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: verify.id})
        .execute();
    }

    // ====================== UPDATE PROFIL =======================
    async verifyProfil(admin_id: number): Promise<Administrateurs> {
        return await this.adminRepository
        .createQueryBuilder('a')
        .select(['a.profil_path as profil_path'])
        .where(`a.id=:identifiant AND a.actif=:actif`, { 
            identifiant: admin_id,
            actif: 1 
        })
        .getRawOne();
    }

    async updateProfil(profil_path: string, admin_id: number): Promise<void> {
        await this.adminRepository
        .createQueryBuilder()
        .update(Administrateurs)
        .set({
            profilPath: profil_path,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: admin_id })
        .execute();
    }

    // =================== SEND MAIL =====================
    private async sendMail(donnees: MailDataDto): Promise<void> {
        await this.mailerService.sendMail({
            from: 'Jeunes-S',
            to: donnees.dest_mail,
            subject: donnees.subject_mail,
            html: donnees.content_mail
        });
    }

    // =================== GENERETE RANDOM PASSWORD ===================
    private async generateRandomPassword(): Promise<string> {
        const text = "azertyuiop$^*mlkjhgfdsqwxcvbn+!%123789456AZERT/*-YUIOPQSDFGHJKLMWXCVBN";
        let password: string = "";
        for(let i = 0; i <= 19; i++) {
            let random_number = Math.floor(Math.random() * text.length);
            password += text.substring(random_number, random_number + 1);
        }
        return password;
    }
}
