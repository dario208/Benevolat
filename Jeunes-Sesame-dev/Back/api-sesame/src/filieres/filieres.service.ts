import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';
import { Filieres } from 'src/entities/Filieres';
import { Repository } from 'typeorm';
import { CreateFilieresDto, ParamFilieresDomaineId, UpdateFilieresDto } from './dto/filieres.dto';

@Injectable()
export class FilieresService {
    constructor(
        @InjectRepository(Filieres)
        private filiereRepository: Repository<Filieres>
    ) {}

    async create(donnees: CreateFilieresDto): Promise<void> {
        await this.filiereRepository
        .createQueryBuilder()
        .insert()
        .into(Filieres)
        .values({
            nomFiliere: donnees.nom_filiere,
            domaineId: donnees.domaine_id
        })
        .execute();
    }

    async findall(): Promise<Filieres[]> {
        return await this.filiereRepository
        .createQueryBuilder('f')
        .select([
            'f.id as id', 'f.nom_filiere as nom_filiere',
            'd.nom_domaine as nom_domaine'
        ])
        .innerJoin(DomaineCompetences, 'd', 'd.id = f.domaine_id')
        .getRawMany();
    }

    async findByDomaineId(donnees: ParamFilieresDomaineId): Promise<Filieres[]> {
        return await this.filiereRepository
        .createQueryBuilder('f')
        .select([
            'f.id as id', 'f.nom_filiere as nom_filiere',
            'd.nom_domaine as nom_domaine'
        ])
        .innerJoin(DomaineCompetences, 'd', 'd.id = f.domaine_id')
        .where(`f.domaine_id=:domaineId`, { domaineId: donnees.domaine_id })
        .getRawMany();
    }

    async update(donnees: UpdateFilieresDto): Promise<void> {
        await this.filiereRepository
        .createQueryBuilder()
        .update(Filieres)
        .set({
            nomFiliere: donnees.nom_filiere,
            domaineId: donnees.domaine_id
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }
}
