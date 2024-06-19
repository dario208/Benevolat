import { Module } from '@nestjs/common';
import { FormationsService } from './formations.service';
import { FormationsController } from './formations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formations } from 'src/entities/Formations';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Formations, Etudiants])
  ],
  providers: [FormationsService],
  controllers: [FormationsController]
})
export class FormationsModule {}
