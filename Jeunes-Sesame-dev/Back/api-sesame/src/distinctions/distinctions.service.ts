import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Distinctions } from 'src/entities/Distinctions';
import { Etudiants } from 'src/entities/Etudiants';
import { Repository } from 'typeorm';
import { CreateDistinctionsDto, ParamDistinctionsEtudiantIdDto, 
    ParamDistinctionsIdDto, UpdateDistinctionsDto } from './dto';

@Injectable()
export class DistinctionsService {
    constructor(
        @InjectRepository(Distinctions)
        private distinctionsRepository: Repository<Distinctions>
    ) {}

    async create(donnees: CreateDistinctionsDto, etudiant_id: number): Promise<void> {
        await this.distinctionsRepository
        .createQueryBuilder()
        .insert()
        .into(Distinctions)
        .values({
            nomDistinction: donnees.nom_distinction,
            organisateur: donnees.organisateur,
            lieu: donnees.lieu,
            annee: donnees.annee,
            description: donnees.description,
            etudiantId: etudiant_id
        })
        .execute();
    }

    async findall(): Promise<Distinctions[]> {
        return await this.distinctionsRepository
        .createQueryBuilder('d')
        .select([
            'd.id as id', 'd.nom_distinction as nom',
            'd.organisateur as organisateur', 
            'd.lieu as lieu', 'd.annee as annee',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'd.description as description',
            'd.created_at as created_at', 'd.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = d.etudiant_id')
        .orderBy('d.created_at', 'DESC')
        .getRawMany();
    }

    async findByEtudiantId(donnees: ParamDistinctionsEtudiantIdDto): Promise<Distinctions[]> {
        return await this.distinctionsRepository
        .createQueryBuilder('d')
        .select([
            'd.id as id', 'd.nom_distinction as nom',
            'd.organisateur as organisateur', 
            'd.lieu as lieu', 'd.annee as annee',
            'e.nom as nom_etudiant', 'e.prenoms as prenoms_etudiant',
            'd.description as description',
            'd.created_at as created_at', 'd.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = d.etudiant_id')
        .where(`d.etudiant_id=:identifiant`,  { identifiant: donnees.etudiant_id })
        .orderBy('d.created_at', 'DESC')
        .getRawMany();
    } 

    async update(donnees: UpdateDistinctionsDto): Promise<void> {
        await this.distinctionsRepository
        .createQueryBuilder()
        .update(Distinctions)
        .set({
            nomDistinction: donnees.nom_distinction,
            organisateur: donnees.organisateur,
            lieu: donnees.lieu,
            annee: donnees.annees,
            description: donnees.description,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }

    async delete(donnees: ParamDistinctionsIdDto): Promise<void> {
        await this.distinctionsRepository.delete(donnees.distinction_id);
    }
}
