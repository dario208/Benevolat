import { Module } from '@nestjs/common';
import { DistinctionsService } from './distinctions.service';
import { DistinctionsController } from './distinctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distinctions } from 'src/entities/Distinctions';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Distinctions, Etudiants])
  ],
  providers: [DistinctionsService],
  controllers: [DistinctionsController]
})
export class DistinctionsModule {}
