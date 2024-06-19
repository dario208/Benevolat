import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiants } from 'src/entities/Etudiants';
import { Regions } from 'src/entities/Regions';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Regions, Etudiants])
  ],
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
