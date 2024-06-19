import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Etudiants } from 'src/entities/Etudiants';
import { Regions } from 'src/entities/Regions';
import { Repository } from 'typeorm';
import { CreateRegionsDto, UpdateRegionsDto } from './dto';

@Injectable()
export class RegionsService {
    constructor(
        @InjectRepository(Regions)
        private regionsRepository: Repository<Regions>
    ) {}

    async create(donnees: CreateRegionsDto): Promise<void> {
        await this.regionsRepository
        .createQueryBuilder()
        .insert()
        .into(Regions)
        .values({
            nomRegion: donnees.nom_region
        })
        .execute();
    }

    async findall(): Promise<Regions[]> {
        return await this.regionsRepository
        .createQueryBuilder('r')
        .select([
            'r.id as id', 'r.nom_region as nom',
            'r.path_region as path',
            `(SELECT COUNT(id) FROM etudiants 
                WHERE region_id = r.id) 
                as nombre_etudiants`
        ])
        .orderBy('r.id')
        .getRawMany();
    }

    async update(donnees: UpdateRegionsDto): Promise<void> {
        await this.regionsRepository
        .createQueryBuilder()
        .update(Regions)
        .set({
            nomRegion: donnees.nom_region
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }
}
