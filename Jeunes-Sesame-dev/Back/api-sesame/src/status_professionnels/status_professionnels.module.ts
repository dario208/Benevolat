import { Module } from '@nestjs/common';
import { StatusProfessionnelsService } from './status_professionnels.service';
import { StatusProfessionnelsController } from './status_professionnels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusProfessionnels } from 'src/entities/StatusProfessionnels';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusProfessionnels])
  ],
  providers: [StatusProfessionnelsService],
  controllers: [StatusProfessionnelsController]
})
export class StatusProfessionnelsModule {}
