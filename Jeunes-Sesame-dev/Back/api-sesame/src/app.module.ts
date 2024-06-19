import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EtudiantsModule } from './etudiants/etudiants.module';
import { RegionsModule } from './regions/regions.module';
import { DomaineCompetencesModule } from './domaine_competences/domaine_competences.module';
import { FilieresModule } from './filieres/filieres.module';
import { StatusProfessionnelsModule } from './status_professionnels/status_professionnels.module';
import { AdministrateursModule } from './administrateurs/administrateurs.module';
import { ConsulatationsModule } from './consulatations/consulatations.module';
import { CategorieEmploisModule } from './categorie_emplois/categorie_emplois.module';
import { EmploisModule } from './emplois/emplois.module';
import { FormationsModule } from './formations/formations.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { DistinctionsModule } from './distinctions/distinctions.module';
import { CompetencesModule } from './competences/competences.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PromotionsModule } from './promotions/promotions.module';
import { ProjetsModule } from './projets/projets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: "mariadb",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.js'],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule,
    EtudiantsModule,
    RegionsModule,
    DomaineCompetencesModule,
    FilieresModule,
    StatusProfessionnelsModule,
    AdministrateursModule,
    ConsulatationsModule,
    CategorieEmploisModule,
    EmploisModule,
    FormationsModule,
    ExperiencesModule,
    DistinctionsModule,
    CompetencesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads')
    }),
    PromotionsModule,
    ProjetsModule
  ]
})
export class AppModule {}
