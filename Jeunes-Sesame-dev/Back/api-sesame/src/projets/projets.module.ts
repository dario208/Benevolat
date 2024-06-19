import { Module } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { ProjetsController } from './projets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projets } from 'src/entities/Projets';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [TypeOrmModule.forFeature([Projets, Etudiants])],
  providers: [ProjetsService],
  controllers: [ProjetsController]
})
export class ProjetsModule {}
