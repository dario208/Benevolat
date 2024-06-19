import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Etudiants } from 'src/entities/Etudiants';
import { Experiences } from 'src/entities/Experiences';
import { Repository } from 'typeorm';
import { CreateExperiencesDto, ParamExperiencesEtudiantIdDto, ParamExperiencesIdDto, UpdateExperiencesDto } from './dto';

@Injectable()
export class ExperiencesService {
    constructor(
        @InjectRepository(Experiences)
        private experiencesRepository: Repository<Experiences>
    ) {}

    async create(donnees: CreateExperiencesDto, etudiant_id: number): Promise<void> {
        await this.experiencesRepository
        .createQueryBuilder()
        .insert()
        .into(Experiences)
        .values({
            nomExperience: donnees.nom_experience,
            lieu: donnees.lieu,
            annee: donnees.annee,
            description: donnees.description,
            etudiantId: etudiant_id
        })
        .execute();
    }

    async findall(): Promise<Experiences[]> {
        return await this.experiencesRepository
        .createQueryBuilder('ex')
        .select([
            'ex.id as id', 'ex.nom_experience as nom_experience',
            'ex.lieu as lieu_experience', 'ex.annee as annee_experience',
            'ex.description as description_experience',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'ex.created_at as created_at', 'ex.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = ex.etudiant_id')
        .orderBy('ex.created_at', 'DESC')
        .getRawMany();
    }

    async findByEtudiantId(donnees: ParamExperiencesEtudiantIdDto): Promise<Experiences[]> {
        return await this.experiencesRepository
        .createQueryBuilder('ex')
        .select([
            'ex.id as id', 'ex.nom_experience as nom',
            'ex.lieu as lieu', 'ex.annee as annee',
            'ex.description as description',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'ex.created_at as created_at', 'ex.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = ex.etudiant_id')
        .where(`ex.etudiant_id=:identifiant`, { identifiant: donnees.etudiant_id })
        .orderBy('ex.created_at', 'DESC')
        .getRawMany();
    }

    async udpate(donnees: UpdateExperiencesDto): Promise<void> {
        await this.experiencesRepository
        .createQueryBuilder()
        .update(Experiences)
        .set({
            nomExperience: donnees.nom_experience,
            lieu: donnees.lieu,
            annee: donnees.annee,
            description: donnees.description,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }

    async delete(donnees: ParamExperiencesIdDto): Promise<void> {
        await this.experiencesRepository.delete(donnees.experience_id);
    }
}
