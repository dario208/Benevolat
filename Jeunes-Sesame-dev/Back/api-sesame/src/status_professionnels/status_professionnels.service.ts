import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusProfessionnels } from 'src/entities/StatusProfessionnels';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto';

@Injectable()
export class StatusProfessionnelsService {
    constructor(
        @InjectRepository(StatusProfessionnels)
        private statusRepository: Repository<StatusProfessionnels>
    ) {}

    async create(donnees: CreateStatusDto): Promise<void> {
        await this.statusRepository
        .createQueryBuilder()
        .insert()
        .into(StatusProfessionnels)
        .values({
            description: donnees.description
        })
        .execute();
    }

    async findall(): Promise<StatusProfessionnels[]> {
        return await this.statusRepository
        .createQueryBuilder('s')
        .select([
            's.id as id', 's.description as status'
        ])
        .getRawMany();
    }
}
