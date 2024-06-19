import { Module } from '@nestjs/common';
import { ConsulatationsService } from './consulatations.service';
import { ConsulatationsController } from './consulatations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultations } from 'src/entities/Consultations';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultations])
  ],
  providers: [ConsulatationsService],
  controllers: [ConsulatationsController]
})
export class ConsulatationsModule {}
