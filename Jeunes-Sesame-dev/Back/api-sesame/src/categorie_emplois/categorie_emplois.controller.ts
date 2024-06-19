import { Body, Controller, ForbiddenException, Get, NotAcceptableException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategorieEmploisService } from './categorie_emplois.service';
import { CreateCatrgorieEmploisDto, ParamCategorieEmploisDto } from './dto';

@ApiBearerAuth()
@Controller('categorie-emplois')
export class CategorieEmploisController {
    constructor(
        private categorieEmploisService: CategorieEmploisService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createCategorieEmplois(@Body() donnees: CreateCatrgorieEmploisDto, @Request() req: any) {
        if(req.user.id !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.categorieEmploisService.create(donnees);
    }

    @Get('all')
    async findallCategorieEmplois() {
        return await this.categorieEmploisService.findall();
    }

    @Get(':categorie_id')
    async findoneCategorieEmplois(@Param() donnees: ParamCategorieEmploisDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.categorieEmploisService.findone(donnees);
    }
}
