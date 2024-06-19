import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorieEmplois } from 'src/entities/CategorieEmplois';
import { Repository } from 'typeorm';
import { CreateCatrgorieEmploisDto, ParamCategorieEmploisDto } from './dto';

@Injectable()
export class CategorieEmploisService {
    constructor(
        @InjectRepository(CategorieEmplois)
        private categorieEmploisRepository: Repository<CategorieEmplois>
    ) {}

    async create(donnees: CreateCatrgorieEmploisDto): Promise<void> {
        await this.categorieEmploisRepository
        .createQueryBuilder()
        .insert()
        .into(CategorieEmplois)
        .values({
            categorie: donnees.categorie
        })
        .execute();
    }

    async findall(): Promise<CategorieEmplois[]> {
        return await this.categorieEmploisRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.categorie as categorie'
        ])
        .getRawMany();
    }

    async findone(donnees: ParamCategorieEmploisDto): Promise<CategorieEmplois> {
        return await this.categorieEmploisRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.categorie as categorie'
        ])
        .where(`c.id=:identifiant`, { identifiant: donnees.categorie_id })
        .getRawOne();
    }
}
