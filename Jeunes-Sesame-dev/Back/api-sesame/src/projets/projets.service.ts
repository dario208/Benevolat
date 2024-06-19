import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projets } from 'src/entities/Projets';
import { Repository } from 'typeorm';
import { CreateProjetsDto, ParamProjetsEtudiantId, 
    ParamProjetsIdDto, UpdateProjetsDto } from './dto';
import { Etudiants } from 'src/entities/Etudiants';

@Injectable()
export class ProjetsService {
    constructor(
        @InjectRepository(Projets)
        private projetsRepository: Repository<Projets>
    ) {}

    async create(donnees: CreateProjetsDto, etudiant_id: number): Promise<void> {
        await this.projetsRepository
        .createQueryBuilder()
        .insert()
        .into(Projets)
        .values({
            nom: donnees.nom,
            description: donnees.description,
            lien: donnees.lien,
            img: donnees.img,
            etudiantId: etudiant_id
        })
        .execute();
    }

    async findall(): Promise<Projets[]> {
        return await this.projetsRepository
        .createQueryBuilder('p')
        .select([
            'p.id as id', 'p.nom as nom', 'p.description as description',
            'p.lien as lien', 'p.img as img', 'e.nom as nom_etudiant',
            'e.prenoms as prenoms_etudiant', 'p.created_at as created_at',
            'p.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = p.etudiant_id')
        .orderBy('p.created_at', 'DESC')
        .getRawMany();
    }

    async findByEtudiantId(donnees: ParamProjetsEtudiantId): Promise<Projets[]> {
        return await this.projetsRepository
        .createQueryBuilder('p')
        .select([
            'p.id as id', 'p.nom as nom', 'p.description as description',
            'p.lien as lien', 'p.img as img', 'e.nom as nom_etudiant',
            'e.prenoms as prenoms_etudiant', 'p.created_at as created_at',
            'p.updated_at as updated_at'
        ])
        .innerJoin(Etudiants, 'e', 'e.id = p.etudiant_id')
        .where(`p.etudiant_id=:identifiant`, {identifiant: donnees.etudiant_id})
        .orderBy('p.created_at', 'DESC')
        .getRawMany()
    }

    async update(donnees: UpdateProjetsDto): Promise<void> {
        await this.projetsRepository
        .createQueryBuilder()
        .update(Projets)
        .set({
            nom: donnees.nom,
            description: donnees.description,
            lien: donnees.lien,
            img: donnees.img,
            updatedAt: () => "NOW()"
        })
        .where(`id=:identifiant`, {identifiant: donnees.id})
        .execute();
    }

    async delete(donnees: ParamProjetsIdDto): Promise<void> {
        await this.projetsRepository.delete(donnees.projet_id);
    }
}
