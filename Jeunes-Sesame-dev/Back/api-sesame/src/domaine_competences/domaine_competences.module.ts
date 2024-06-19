import { Module } from '@nestjs/common';
import { DomaineCompetencesService } from './domaine_competences.service';
import { DomaineCompetencesController } from './domaine_competences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';
import { Filieres } from 'src/entities/Filieres';

@Module({
  imports: [
    TypeOrmModule.forFeature([DomaineCompetences, Filieres])
  ],
  providers: [DomaineCompetencesService],
  controllers: [DomaineCompetencesController]
})
export class DomaineCompetencesModule {}
