import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competences } from 'src/entities/Competences';
import { Etudiants } from 'src/entities/Etudiants';
import { Repository } from 'typeorm';
import { CreateCompetencesDto, ParamCompetencesEtudiantIdDto, ParamCompetencesIdDto, UpdateCompetencesDto } from './dto';

@Injectable()
export class CompetencesService {
    constructor(
        @InjectRepository(Competences)
        private competencesRepository: Repository<Competences>
    ) {}

    async create(donnees: CreateCompetencesDto, etudiant_id: number): Promise<void> {
        await this.competencesRepository
        .createQueryBuilder()
        .insert()
        .into(Competences)
        .values({
            nomCompetence: donnees.nom_competence,
            liste: donnees.liste,
            description: donnees.description,
            etudiantId: etudiant_id
        })
        .execute();
    }

    async findall(): Promise<Competences[]> {
        return await this.competencesRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.nom_competence as nom',
            'c.liste as liste', 'c.description as description',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'c.created_at as created_at', 'c.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = c.etudiant_id')
        .orderBy('c.created_at', 'DESC')
        .getRawMany();
    }

    async findByEtudiantId(donnees: ParamCompetencesEtudiantIdDto): Promise<Competences[]> {
        return await this.competencesRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.nom_competence as nom',
            'c.liste as liste', 'c.description as description',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'c.created_at as created_at', 'c.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = c.etudiant_id')
        .where(`c.etudiant_id=:identifiant`, { identifiant: donnees.etudiant_id })
        .orderBy('c.created_at', 'DESC')
        .getRawMany();
    }

    async update(donnees: UpdateCompetencesDto): Promise<void> {
        await this.competencesRepository
        .createQueryBuilder()
        .update(Competences)
        .set({
            nomCompetence: donnees.nom_competence,
            liste: donnees.liste,
            description: donnees.description,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }

    async delete(donnees: ParamCompetencesIdDto): Promise<void> {
        await this.competencesRepository.delete(donnees.competence_id);
    }
}
