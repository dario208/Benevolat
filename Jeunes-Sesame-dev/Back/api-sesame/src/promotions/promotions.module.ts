import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotions } from 'src/entities/Promotions';
import { Etudiants } from 'src/entities/Etudiants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotions, Etudiants])
  ],
  providers: [PromotionsService],
  controllers: [PromotionsController]
})
export class PromotionsModule {}
