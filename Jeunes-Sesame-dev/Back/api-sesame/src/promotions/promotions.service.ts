import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Etudiants } from 'src/entities/Etudiants';
import { Promotions } from 'src/entities/Promotions';
import { Repository } from 'typeorm';
import { CreatePromotionsDto, ParamPromotionsIdDto, 
    ParamStatusProDto, UpdatePromotionsDto } from './dto';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotions)
        private promotionsRepository: Repository<Promotions>,
        @InjectRepository(Etudiants)
        private etudiantsRepository: Repository<Etudiants>
    ) {}

    async create(donnees: CreatePromotionsDto): Promise<void> {
        await this.promotionsRepository
        .createQueryBuilder()
        .insert()
        .into(Promotions)
        .values({
            anneePromotion: donnees.annee_promotion,
            nomPromotion: donnees.nom_promotion
        })
        .execute();
    }

    async findall(): Promise<Promotions[]> {
        return await this.promotionsRepository
        .createQueryBuilder('p')
        .select([
            'p.id as id', 'p.annee_promotion as annee',
            'p.nom_promotion as nom'
        ])
        .getRawMany();
    }

    async countByStatusPro(donnees: ParamStatusProDto): Promise<Promotions[]> {
        const total: number = await this.etudiantsRepository
        .createQueryBuilder('e')
        .where(`e.actif=:actif`, {actif: 1})
        .getCount();

        return await this.promotionsRepository
        .createQueryBuilder('p')
        .select([
            `(SELECT COUNT(id) FROM etudiants 
                WHERE (actif = 1 
                    AND status_id = ${donnees.status_id} 
                    AND promotion_id = p.id)) as nombre`,
            `(SELECT 
                CASE
                    WHEN ROUND(CAST(((COUNT(id) / (SELECT COUNT(id) FROM etudiants WHERE (actif = 1 AND promotion_id = p.id))) * 100) as float), 2) = 100
                        THEN '100%'
                    WHEN ROUND(CAST(((COUNT(id) / (SELECT COUNT(id) FROM etudiants WHERE (actif = 1 AND promotion_id = p.id))) * 100) as float), 2) IS NULL
                        THEN '0.00%'
                    ELSE CONCAT(ROUND(CAST(((COUNT(id) / (SELECT COUNT(id) FROM etudiants WHERE (actif = 1 AND promotion_id = p.id))) * 100) as float), 2), '%')
                END
                FROM etudiants 
                WHERE (actif = 1 
                    AND status_id = ${donnees.status_id} 
                    AND promotion_id = p.id)) as pourcentage`,
            'p.nom_promotion as promotion'
        ])
        .getRawMany();
    }

    async update(donnees: UpdatePromotionsDto): Promise<void> {
        await this.promotionsRepository
        .createQueryBuilder()
        .update(Promotions)
        .set({
            anneePromotion: donnees.annee_promotion,
            nomPromotion: donnees.nom_promotion
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }

    async delete(donnees: ParamPromotionsIdDto): Promise<void> {
        await this.promotionsRepository.delete(donnees.promotion_id);
    }
}
