import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';
import { Etudiants } from 'src/entities/Etudiants';
import { Filieres } from 'src/entities/Filieres';
import { Promotions } from 'src/entities/Promotions';
import { Regions } from 'src/entities/Regions';
import { StatusProfessionnels } from 'src/entities/StatusProfessionnels';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEtudiantsDto, FiltreEtudiantsDto, ParamEtudiantsDomaineIdDto, 
    ParamEtudiantsIdDto, ParamEtudiantsFiliereId, ParamEtudiantsPromotionId, 
    ParamEtudiantsRegionIdDto, ParamEtudiantsStatusId, 
    UpdateEtudiantsDto, UpdateEtudiantsPasswordDto, MailDataDto, 
    UpdateForgotPasswordDto, ParamActifDto, ParamStatusProDto, CountStatusProAndPromotionsDto, UpdateNomDto, FindFilterEtudiantsDto, ExcelEtudiantsDto } from './dto';
import { IPaginationOptions, Pagination, paginateRaw } from 'nestjs-typeorm-paginate';
import { MailerService } from '@nestjs-modules/mailer';
import * as writexcelfile from 'write-excel-file/node';

@Injectable()
export class EtudiantsService {
    constructor(
        @InjectRepository(Etudiants)
        private etudiantsRepository: Repository<Etudiants>,
        private mailerService: MailerService
    ) {}

    private async verifyCreate(email: string): Promise<Etudiants> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select(['e.id'])
        .where(`e.email=:email`, {email: email})
        .getRawOne();
    }

    async create(donnees: CreateEtudiantsDto): Promise<void> {
        const response: Etudiants = await this.verifyCreate(donnees.email);
        if(response) throw new ForbiddenException('Credentiels incorrects!');
        await this.etudiantsRepository
        .createQueryBuilder()
        .insert()
        .into(Etudiants)
        .values({
            nom: donnees.nom,
            prenoms: donnees.prenoms,
            email: donnees.email
        })
        .execute();
    }

    async findall(): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at',
            'e.updated_at as updated_at', 'e.status_id as status_id', 
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.actif=:actif`, {actif: 1})
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findallNonActif(): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at',
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.actif=:actif`, {actif: 0})
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findallPaginate(options: IPaginationOptions): Promise<Pagination<Etudiants>> {
        const response: SelectQueryBuilder<Etudiants> = this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.actif=:actif`, {actif: 1})
        .orderBy('e.popularity', 'DESC');
        return paginateRaw<Etudiants>(response, options);
    }

    async findone(donnees: ParamEtudiantsIdDto): Promise<Etudiants> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'e.promotion_id as promotion_id', 'p.annee_promotion as promotion',
            'e.region_id as region_id', 'r.nom_region as nom_region', 
            'e.domaine_id as domaine_id', 'd.nom_domaine as nom_domaine',
            'e.filiere_id as filiere_id', 'f.nom_filiere as nom_filiere',
            'e.status_id as status_id', 's.description as status_professionnel',
            'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.id=:identifiant AND e.actif=:actif`, { 
            identifiant: donnees.etudiant_id,
            actif: 1
        })
        .getRawOne();
    }

    async findByRegionId(donnees: ParamEtudiantsRegionIdDto): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.region_id=:regionId AND e.actif=:actif`, { 
            regionId: donnees.region_id,
            actif: 1 
        })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findByDomaineId(donnees: ParamEtudiantsDomaineIdDto): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.domaine_id=:domaineId AND e.actif=:actif`, { 
            domaineId: donnees.domaine_id,
            actif: 1
        })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findByFiliereId(donnees: ParamEtudiantsFiliereId): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.filiere_id=:filiereId AND e.actif=:actif`, { 
            filiereId: donnees.filiere_id,
            actif: 1 
        })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findByStatusId(donnees: ParamEtudiantsStatusId): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.status_id=:statusId AND e.actif=:actif`, { 
            statusId: donnees.status_id,
            actif: 1 
        })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findByPromotionId(donnees: ParamEtudiantsPromotionId): Promise<Etudiants[]> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`e.promotion_id=:promotionId AND e.actif=:actif`, { 
            promotionId: donnees.promotion_id,
            actif: 1 
        })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
    }

    async findFilterExcel(donnees: FindFilterEtudiantsDto): Promise<string> {
        const response: ExcelEtudiantsDto[] = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 'e.status_id as status_id',
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`${ donnees.promotion_id.length === 0 ? '1' : '(e.promotion_id IN (:promotions))'} AND
                ${ donnees.filiere_id.length === 0 ? '1' : '(e.filiere_id IN (:filieres))'} AND
                ${ donnees.status_id.length === 0 ? '1' : '(e.status_id IN (:status))'} AND
                ${ donnees.region_id.length === 0 ? '1' : '(e.region_id IN (:regions))'} AND 
                ${ donnees.domaine_id.length === 0 ? '1' : '(e.domaine_id IN (:domaines))'} AND e.actif=:actif`, 
                {
                    promotions: donnees.promotion_id,
                    filieres: donnees.filiere_id,
                    status: donnees.status_id,
                    regions: donnees.region_id,
                    domaines: donnees.domaine_id,
                    actif: 1
                })
        .orderBy('e.popularity', 'DESC')
        .getRawMany();
        const results: ExcelEtudiantsDto[] = response.map(value => ({
            nom: value.nom,
            prenoms: value.prenoms,
            ecole: value.ecole,
            niveau_etude: value.niveau_etude,
            tel1: value.tel1,
            tel2: value.tel2,
            email: value.email,
            linkedin: value.linkedin,
            facebook: value.facebook,
            lien_cv: value.lien_cv,
            description: value.description,
            promotion: value.promotion,
            nom_region: value.nom_region,
            nom_domaine: value.nom_domaine,
            nom_filiere: value.nom_filiere,
            status_professionnel: value.status_professionnel
        }));
        const filename = `Jeunes-S_${Date.now()}.xlsx`;        
        await this.writerExcel(results, filename);
        return filename;
    }

    async filtrePaginate(donnees: FiltreEtudiantsDto, options: IPaginationOptions): Promise<Pagination<Etudiants>> {
        const response: SelectQueryBuilder<Etudiants> = this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 'e.nom as nom', 'e.prenoms as prenoms',
            'e.ecole as ecole', 'e.niveau_etude as niveau_etude', 
            'e.tel1 as tel1','e.tel2 as tel2', 'e.email as email', 
            'e.linkedin as linkedin', 'e.facebook as facebook', 
            'e.lien_cv as lien_cv', 'e.description as description', 
            'e.pdp as pdp', 'e.pdc as pdc', 'e.created_at as created_at', 
            'e.updated_at as updated_at', 
            'p.annee_promotion as promotion', 'r.nom_region as nom_region', 
            'd.nom_domaine as nom_domaine', 'f.nom_filiere as nom_filiere', 
            's.description as status_professionnel', 'e.popularity as popularity'
        ])
        .leftJoin(Regions, 'r', 'r.id = e.region_id ')
        .leftJoin(DomaineCompetences, 'd', 'd.id = e.domaine_id')
        .leftJoin(Filieres, 'f', 'f.id = e.filiere_id')
        .leftJoin(StatusProfessionnels, 's', 's.id = e.status_id')
        .leftJoin(Promotions, 'p', 'p.id = e.promotion_id')
        .where(`${ donnees.promotion_id.length === 0 ? '1' : '(e.promotion_id IN (:promotions))'} AND
                ${ donnees.filiere_id.length === 0 ? '1' : '(e.filiere_id IN (:filieres))'} AND
                ${ donnees.status_id.length === 0 ? '1' : '(e.status_id IN (:status))'} AND
                ${ donnees.region_id.length === 0 ? '1' : '(e.region_id IN (:regions))'} AND e.actif=:actif`, 
                {
                    promotions: donnees.promotion_id,
                    filieres: donnees.filiere_id,
                    status: donnees.status_id,
                    regions: donnees.region_id,
                    actif: 1
                })
        .orderBy('e.popularity', 'DESC');
        return paginateRaw<Etudiants>(response, options);
    }

    async countall(): Promise<{nombre: number}> {
        return {
            nombre: await this.etudiantsRepository
            .createQueryBuilder('e')
            .getCount()
        };
    }

    async countActif(donnees: ParamActifDto): Promise<{nombre: number}> {
        return {
            nombre: await this.etudiantsRepository
            .createQueryBuilder('e')
            .where(`e.actif=:actif`, {actif: donnees.actif_id})
            .getCount()
        };
    }

    async countByStatusPro(donnees: ParamStatusProDto): Promise<{nombre: number, pourcentage: string}> {
        const total: number = await this.etudiantsRepository
        .createQueryBuilder('e')
        .where(`e.actif=:actif`, {actif: 1})
        .getCount();

        const nombre_calculee: number = await this.etudiantsRepository
        .createQueryBuilder('e')
        .where(`e.status_id=:status AND e.actif=:actif`, {
            status: donnees.status_id,
            actif: 1
        })
        .getCount();

        const pourcentage_calculee = ((nombre_calculee / total) * 100).toFixed(2);

        return {
            nombre: nombre_calculee,
            pourcentage: `${pourcentage_calculee}%`
        };
    }

    async countByStatusProByPromotions(donnees: CountStatusProAndPromotionsDto): Promise<{nombre: number, pourcentage: string}> {
        const total: number = await this.etudiantsRepository
        .createQueryBuilder('e')
        .where(`e.actif=:actif AND e.promotion_id=:promotion`, {
            actif: 1,
            promotion: donnees.promotion_id
        })
        .getCount();

        const nombre_calculee: number = await this.etudiantsRepository
        .createQueryBuilder('e')
        .where(`e.status_id=:status
            AND e.actif=:actif
            AND e.promotion_id=:promotion`, {
            status: donnees.status_id,
            actif: 1,
            promotion: donnees.promotion_id
        })
        .getCount();

        const pourcentage_calculee = ((nombre_calculee / total) * 100).toFixed(2);

        return {
            nombre: nombre_calculee,
            pourcentage: `${pourcentage_calculee}%`
        };
    }

    async update(donnees: UpdateEtudiantsDto, etudiant_id: number): Promise<void> {
        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            ecole: donnees.ecole,
            niveauEtude: donnees.niveau_etude,
            tel1: donnees.tel1,
            tel2: donnees.tel2,
            email: donnees.email,
            linkedin: donnees.linkedin,
            facebook: donnees.facebook,
            lienCv: donnees.lien_cv,
            description: donnees.description,
            promotionId: donnees.promotion_id,
            regionId: donnees.region_id,
            domaineId: donnees.domaine_id,
            filiereId: donnees.filiere_id,
            statusId: donnees.status_id,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: etudiant_id })
        .execute();
    }

    async updateNom(donnees: UpdateNomDto): Promise<void> {
        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            nom: donnees.nom,
            prenoms: donnees.prenoms,
            email: donnees.email,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: donnees.id})
        .execute();
    }

    async updatePassword(donnees: UpdateEtudiantsPasswordDto, etudiant_id: number): Promise<void> {
        const verify: Etudiants = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 
            'e.nom as nom',
            'e.prenoms as prenoms',
            'e.email as email'
        ])
        .where(`e.id=:identifiant AND e.password=SHA2(:password, 256) AND e.actif=:actif`, {
            identifiant: etudiant_id,
            password: donnees.lastPassword,
            actif: 1
        })
        .getRawOne();
        if(!verify) throw new ForbiddenException('Credentials incorrects');
        
        const mail: MailDataDto = {
            dest_mail: verify.email,
            subject_mail: 'Mot de passe changé',
            content_mail: `Bonjour <b>${verify.nom} ${ verify.prenoms}</b>,<br>
Avec tout votre respect, nous tenons à vous informer que votre mot de passe  dans <b>Jeunes-S</b> a été changé.
<br><br>
Respectuesement`
        };
        await this.sendMail(mail);

        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            password: () => "SHA2('"+donnees.newPassword+"', 256)",
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: etudiant_id })
        .execute();
    }

    async updateForgotPassword(donnees: UpdateForgotPasswordDto): Promise<void> {    
        const verify: Etudiants = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select([
            'e.id as id', 
            'e.nom as nom',
            'e.prenoms as prenoms'
        ])
        .where(`e.email=:email AND e.actif=:actif`, { 
            email: donnees.email,
            actif: 1 
        })
        .getRawOne();
        if(!verify) throw new ForbiddenException('Credentials incorrects');

        const newpassword: string = await this.generateRandomPassword();

        const mail: MailDataDto = {
            dest_mail: donnees.email,
            subject_mail: 'Mot de passe oublié',
            content_mail: `Bonjour <b>${verify.nom} ${ verify.prenoms}</b>,<br>
Avec tout votre respect, voici votre nouveau mot de passe dans <b>Jeunes-S</b>: <b>${newpassword}</b>
<br><br>
Respectuesement`
        };
        await this.sendMail(mail);

        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            password: () => "SHA2('"+newpassword+"', 256)",
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: verify.id })
        .execute();
    }

    // ======================= SERVICE UPDATE PDP ======================
    async verifyPDP(etudiant_id: number): Promise<Etudiants> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select(['e.pdp as pdp'])
        .where(`e.id=:identifiant AND e.actif=:actif`, { 
            identifiant: etudiant_id,
            actif: 1 
        })
        .getRawOne();
    }

    async updatePDP(pathfile: string, etudiant_id: number): Promise<void> {
        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            pdp: pathfile,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: etudiant_id })
        .execute();
    }

    // ====================== SERVICE UPDATE PDC ======================
    async verifyPDC(etudiant_id: number): Promise<Etudiants> {
        return await this.etudiantsRepository
        .createQueryBuilder('e')
        .select(['e.pdc as pdc'])
        .where(`e.id=:identifiant AND e.actif=:actif`, { 
            identifiant: etudiant_id,
            actif: 1 
        })
        .getRawOne();
    }

    async updatePDC(pathfile: string, etudiant_id: number): Promise<void> {
        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            pdc: pathfile,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: etudiant_id })
        .execute();
    }

    async archive(donnees: ParamEtudiantsIdDto): Promise<void> {
        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            actif: 0,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: donnees.etudiant_id})
        .execute();
    }

    // ==================== SET POPULARITY ======================
    async setPopularity(donnees: ParamEtudiantsIdDto): Promise<void> {
        const popularity: Etudiants = await this.etudiantsRepository
        .createQueryBuilder('e')
        .select(['e.popularity as popularity'])
        .where(`e.id=:identifiant AND e.actif=:actif`, {
            identifiant: donnees.etudiant_id,
            actif: 1
        })
        .getRawOne();

        await this.etudiantsRepository
        .createQueryBuilder()
        .update(Etudiants)
        .set({
            popularity: ++popularity['popularity']
        })
        .where(`id=:identifiant`, {identifiant: donnees.etudiant_id})
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

    // ================== WRITE EXCEL FILE ===================
    private async writerExcel(donnees: ExcelEtudiantsDto[], filename: string): Promise<void> {
        const ROW_HEADER: writexcelfile.Row = Object.keys(donnees[0]).map(data => ({
            value: data,
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#008080',
            align: 'center',
            borderColor: '#ffffff'
        }));

        const ROW_DATA = donnees.map(data => 
            Object.keys(data).map(res => ({
                value: data[res]
            }))
        );

        const DATA = [
            ROW_HEADER,
            ...ROW_DATA
        ];

        await writexcelfile.default(DATA, {filePath: `uploads/excels/${filename}`})
    }
}
