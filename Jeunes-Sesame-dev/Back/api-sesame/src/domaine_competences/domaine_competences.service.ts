import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';
import { Filieres } from 'src/entities/Filieres';
import { Repository } from 'typeorm';
import { CreateDomaineDto, ResponseDomaineCompetences, UpdateDomaineDto } from './dto';

@Injectable()
export class DomaineCompetencesService {
    constructor(
        @InjectRepository(DomaineCompetences)
        private domaineRepository: Repository<DomaineCompetences>
    ) {}

    async create(donnees: CreateDomaineDto): Promise<void> {
        await this.domaineRepository
        .createQueryBuilder()
        .insert()
        .into(DomaineCompetences)
        .values({
            nomDomaine: donnees.nom_domaine
        })
        .execute();
    }

    async findall(): Promise<ResponseDomaineCompetences[]> {
        const resultat = await this.domaineRepository
        .createQueryBuilder('d')
        .select([
            'd.id as id', 'd.nom_domaine as nom_domaine',
            `(SELECT 
                CONCAT('[', GROUP_CONCAT('{"id":', id, ', "nom":', '"', nom_filiere, '"}'), ']')
                FROM filieres
                WHERE domaine_id = d.id) as liste_filieres`
        ])
        .innerJoin(Filieres, 'f', 'f.domaine_id = d.id')
        .groupBy('d.id')
        .orderBy('d.id')
        .getRawMany();
        
        return resultat.map((res) => ({
            id: res.id,
            nom: res.nom_domaine,
            liste_filieres: JSON.parse(res.liste_filieres)
        }));
    }

    async update(donnees: UpdateDomaineDto): Promise<void> {
        await this.domaineRepository
        .createQueryBuilder()
        .update(DomaineCompetences)
        .set({
            nomDomaine: donnees.nom_domaine
        })
        .where(`id=:identifiant`, { identifiant: donnees.id })
        .execute();
    }
}
