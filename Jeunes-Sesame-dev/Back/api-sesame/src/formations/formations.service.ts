import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Etudiants } from 'src/entities/Etudiants';
import { Formations } from 'src/entities/Formations';
import { Repository } from 'typeorm';
import { CreateFormationsDto, ParamFormationsEtudiantIdDto, ParamFormationsIdDto, UpdateFormationsDto } from './dto';

@Injectable()
export class FormationsService {
    constructor(
        @InjectRepository(Formations)
        private formationsRepository: Repository<Formations>
    ) {}

    async create(donnees: CreateFormationsDto, etudiant_id: number): Promise<void> {
        await this.formationsRepository
        .createQueryBuilder()
        .insert()
        .into(Formations)
        .values({
            nomFormation: donnees.nom_formation,
            lieu: donnees.lieu,
            annee: donnees.annee,
            description: donnees.description,
            etudiantId: etudiant_id
        })
        .execute();
    }

    async findall(): Promise<Formations[]> {
        return await this.formationsRepository
        .createQueryBuilder('f')
        .select([
            'f.id as id', 'f.nom_formation as nom_formation',
            'f.lieu as lieu_formation', 'f.annee as annee_formation',
            'f.description as description_formation',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'f.created_at as created_at', 'f.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = f.etudiant_id')
        .orderBy('f.created_at', 'DESC')
        .getRawMany();
    }

    async findByEtudiantId(donnees: ParamFormationsEtudiantIdDto): Promise<Formations[]> {
        return await this.formationsRepository
        .createQueryBuilder('f')
        .select([
            'f.id as id', 'f.nom_formation as nom',
            'f.lieu as lieu_formation', 'f.annee as annee',
            'f.description as description',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'f.created_at as created_at', 'f.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = f.etudiant_id')
        .where(`f.etudiant_id=:identifiant`, { identifiant: donnees.etudiant_id })
        .orderBy('f.created_at', 'DESC')
        .getRawMany();
    }

    async update(donnees: UpdateFormationsDto): Promise<void> {
        await this.formationsRepository
        .createQueryBuilder()
        .update(Formations)
        .set({
            nomFormation: donnees.nom_formation,
            lieu: donnees.lieu,
            annee: donnees.annee,
            description: donnees.description,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }

    async delete(donnees: ParamFormationsIdDto): Promise<void> {
        await this.formationsRepository.delete(donnees.formation_id);
    }
}
