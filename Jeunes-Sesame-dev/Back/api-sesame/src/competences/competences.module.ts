import { Module } from '@nestjs/common';
import { CompetencesService } from './competences.service';
import { CompetencesController } from './competences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competences } from 'src/entities/Competences';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competences, Etudiants])
  ],
  providers: [CompetencesService],
  controllers: [CompetencesController]
})
export class CompetencesModule {}
