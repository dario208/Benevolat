import { Module } from '@nestjs/common';
import { FilieresService } from './filieres.service';
import { FilieresController } from './filieres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filieres } from 'src/entities/Filieres';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';

@Module({
  imports: [
    TypeOrmModule.forFeature([Filieres, DomaineCompetences])
  ],
  providers: [FilieresService],
  controllers: [FilieresController]
})
export class FilieresModule {}
