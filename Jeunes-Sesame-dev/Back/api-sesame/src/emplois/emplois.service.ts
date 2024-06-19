import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Administrateurs } from 'src/entities/Administrateurs';
import { Emplois } from 'src/entities/Emplois';
import { Etudiants } from 'src/entities/Etudiants';
import { Repository } from 'typeorm';
import { CreateEmploisDto, MailDataDto, ParamEmploisAdminIdDto, 
    ParamEmploisIdDto, UpdateEmploisDto } from './dto';

@Injectable()
export class EmploisService {
    constructor(
        @InjectRepository(Emplois)
        private emploisRepository: Repository<Emplois>,
        @InjectRepository(Etudiants)
        private etudiantsRepository: Repository<Etudiants>,
        private mailerService: MailerService
    ) {}

    async create(donnees: CreateEmploisDto, administrateur_id: number): Promise<void> {
        await this.emploisRepository
        .createQueryBuilder()
        .insert()
        .into(Emplois)
        .values({
            nomEmploi: donnees.nom_emploi,
            description: donnees.description,
            admnistrateurId: administrateur_id,
            categorieId: donnees.categorie_id.join(',')
        })
        .execute();

        if(donnees.domaine_id.length === 0 && donnees.status_id.length === 0) return;
        const response: Etudiants[] = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.email as email'
        ])
        .where(`${donnees.domaine_id.length === 0 ?  '1' : '(e.domaine_id IN (:domaines))'} OR 
                ${donnees.status_id.length === 0 ? '1': '( e.status_id IN (:status))'}`, {
            domaines: donnees.domaine_id,
            status: donnees.status_id
        })
        .getRawMany();
        this.senderMultipleMail(response, donnees.nom_emploi, 
            `${donnees.description.length >= 97 ? donnees.description.substring(0, 97) + '...' : donnees.description }`);
    }

    async findall(): Promise<Emplois[]> {
        return await this.emploisRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom_emploi as nom_emploi', 
            'e.description as description', 'e.created_at as created_at',
            `CONCAT(a.nom, ' ', a.prenoms) as nom_admin`,
            'e.categorie_id as categorie_id',
            `(SELECT TRIM(GROUP_CONCAT(CONCAT(' ', categorie)))
                FROM categorie_emplois 
                WHERE id IN (
                    substring_index(substring_index(e.categorie_id, ',', 1), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 2), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 4), ',', -1)
                )) as categorie_emplois`
        ])
        .innerJoin(Administrateurs, 'a', 'a.id = e.admnistrateur_id')
        .where(`e.actif=:actif`, {actif: 1})
        .orderBy('e.id', 'DESC')
        .getRawMany();
    }

    async findone(donnees: ParamEmploisIdDto): Promise<Emplois> {
        return await this.emploisRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom_emploi as nom', 
            'e.description as description', 'e.created_at as created_at',
            `CONCAT(a.nom, ' ', a.prenoms) as nom_admin`,
            'e.categorie_id as categorie_id',
            `(SELECT TRIM(GROUP_CONCAT(CONCAT(' ', categorie)))
                FROM categorie_emplois 
                WHERE id IN (
                    substring_index(substring_index(e.categorie_id, ',', 1), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 2), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 4), ',', -1)
                )) as categorie_emplois`
        ])
        .innerJoin(Administrateurs, 'a', 'a.id = e.administrateur_id')
        .where(`e.id=:identifiant AND e.actif=:actif`, {
            identifiant: donnees.emploi_id,
            actif: 1
        })
        .orderBy('e.id', 'DESC')
        .getRawOne();
    }

    async findByAdminId(donnees: ParamEmploisAdminIdDto): Promise<Emplois[]> {
        return await this.emploisRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom_emploi as nom_emploi', 
            'e.description as description', 'e.created_at as created_at',
            `CONCAT(a.nom, ' ', a.prenoms) as nom_admin`,
            'e.categorie_id as categorie_id',
            `(SELECT TRIM(GROUP_CONCAT(CONCAT(' ', categorie)))
                FROM categorie_emplois 
                WHERE id IN (
                    substring_index(substring_index(e.categorie_id, ',', 1), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 2), ',', -1),
                    substring_index(substring_index(e.categorie_id, ',', 4), ',', -1)
                )) as categorie_emplois`
        ])
        .innerJoin(Administrateurs, 'a', 'a.id = e.administrateur_id')
        .where(`e.admnistrateur_id=:adminId AND e.actif=:actif`, {
            adminId: donnees.administrateur_id,
            actif: 1
        })
        .orderBy('e.id', 'DESC')
        .getRawOne();
    }

    observableFindall(): Observable<Emplois[]> {
        return from(this.emploisRepository
            .createQueryBuilder('e')
            .select([
                'e.id as id', 'e.nom_emploi as nom_emploi', 
                'e.description as description', 'e.created_at as created_at',
                `CONCAT(a.nom, ' ', a.prenoms) as nom_admin`,
                'e.categorie_id as categorie_id',
                `(SELECT TRIM(GROUP_CONCAT(CONCAT(' ', categorie)))
                    FROM categorie_emplois 
                    WHERE id IN (
                        substring_index(substring_index(e.categorie_id, ',', 1), ',', -1),
                        substring_index(substring_index(e.categorie_id, ',', 2), ',', -1),
                        substring_index(substring_index(e.categorie_id, ',', 4), ',', -1)
                    )) as categorie_emplois`
            ])
            .innerJoin(Administrateurs, 'a', 'a.id = e.admnistrateur_id')
            .where(`e.actif=:actif`, {actif: 1})
            .orderBy('e.id', 'DESC')
            .getRawMany());
    }

    observableFindCurrent(): Observable<boolean> {
        return from(this.emploisRepository
            .createQueryBuilder()
            .where(`(TIMESTAMPDIFF(SECOND, created_at, SYSDATE()) < 86400) AND actif = 1`)
            .getExists());
    }

    async update(donnees: UpdateEmploisDto): Promise<void> {
        await this.emploisRepository
        .createQueryBuilder()
        .update(Emplois)
        .set({
            nomEmploi: donnees.nom_emploi,
            description: donnees.description,
            categorieId: donnees.categorie_id.join(','),
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: donnees.id})
        .execute();
    }

    async delete(donnees: ParamEmploisIdDto): Promise<void> {
        await this.emploisRepository
        .createQueryBuilder()
        .update(Emplois)
        .set({
            actif: 0,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: donnees.emploi_id})
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

    private async senderMultipleMail(donnees: Etudiants[], nom_emploi: string, description: string): Promise<void> {
        if(!donnees.length) return;
        donnees.forEach(async (value) => {
            let mail: MailDataDto = {
                dest_mail: value.email,
                subject_mail: 'Offre d\'emplois dans Jeunes-S',
                content_mail: `Bonjour Madame/Monsieur,
<br><br>
<b>${nom_emploi}</b>
${description}
<br><br>
Respectuesement`
            };
            await this.sendMail(mail);
        });
    }
}
