import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomaineCompetences } from 'src/entities/DomaineCompetences';
import { Etudiants } from 'src/entities/Etudiants';
import { Filieres } from 'src/entities/Filieres';
import { Promotions } from 'src/entities/Promotions';
import { Regions } from 'src/entities/Regions';
import { StatusProfessionnels } from 'src/entities/StatusProfessionnels';
import { EtudiantsController } from './etudiants.controller';
import { EtudiantsService } from './etudiants.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forFeature([
      Etudiants, Regions, Filieres, 
      StatusProfessionnels, DomaineCompetences,
      Promotions
    ]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_KEY
          }
        }
      })
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [EtudiantsController],
  providers: [EtudiantsService]
})
export class EtudiantsModule {}
