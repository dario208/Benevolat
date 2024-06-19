import { Module } from '@nestjs/common';
import { EmploisService } from './emplois.service';
import { EmploisController } from './emplois.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emplois } from 'src/entities/Emplois';
import { Administrateurs } from 'src/entities/Administrateurs';
import { CategorieEmplois } from 'src/entities/CategorieEmplois';
import { Etudiants } from 'src/entities/Etudiants';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forFeature([Emplois, Administrateurs, CategorieEmplois, Etudiants]),
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
    })
  ],
  providers: [EmploisService],
  controllers: [EmploisController]
})
export class EmploisModule {}
