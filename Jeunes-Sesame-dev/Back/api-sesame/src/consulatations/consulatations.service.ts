import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultations } from 'src/entities/Consultations';
import { Repository } from 'typeorm';
import { CreateConsultationsDto, ParamConsultationsIdDto, UpdateConsultationsDto } from './dto';

@Injectable()
export class ConsulatationsService {
    constructor(
        @InjectRepository(Consultations)
        private consultationsRepository: Repository<Consultations>
    ) {}

    async create(donnees: CreateConsultationsDto): Promise<void> {
        await this.consultationsRepository
        .createQueryBuilder()
        .insert()
        .into(Consultations)
        .values({
            description: donnees.description
        })
        .execute();
    }

    async findall(): Promise<Consultations[]> {
        return await this.consultationsRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.description as description'
        ])
        .getRawMany();
    }

    async findone(donnees: ParamConsultationsIdDto): Promise<Consultations> {
        return await this.consultationsRepository
        .createQueryBuilder('c')
        .select([
            'c.id as id', 'c.description as description'
        ])
        .where(`c.id=:identifiant`, { identifiant: donnees.consultation_id })
        .getRawOne();
    }

    async update(donnees: UpdateConsultationsDto): Promise<void> {
        await this.consultationsRepository
        .createQueryBuilder()
        .update(Consultations)
        .set({
            description: donnees.description
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }
}
