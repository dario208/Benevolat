import { Module } from '@nestjs/common';
import { CategorieEmploisService } from './categorie_emplois.service';
import { CategorieEmploisController } from './categorie_emplois.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieEmplois } from 'src/entities/CategorieEmplois';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategorieEmplois])
  ],
  providers: [CategorieEmploisService],
  controllers: [CategorieEmploisController]
})
export class CategorieEmploisModule {}
