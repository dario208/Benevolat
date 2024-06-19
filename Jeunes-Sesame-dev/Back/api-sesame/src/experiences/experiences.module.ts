import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiences } from 'src/entities/Experiences';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experiences, Etudiants])
  ],
  providers: [ExperiencesService],
  controllers: [ExperiencesController]
})
export class ExperiencesModule {}
