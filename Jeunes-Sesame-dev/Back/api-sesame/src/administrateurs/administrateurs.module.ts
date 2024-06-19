import { Module } from '@nestjs/common';
import { AdministrateursService } from './administrateurs.service';
import { AdministrateursController } from './administrateurs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrateurs } from 'src/entities/Administrateurs';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forFeature([Administrateurs]),
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
  providers: [AdministrateursService],
  controllers: [AdministrateursController]
})
export class AdministrateursModule {}
