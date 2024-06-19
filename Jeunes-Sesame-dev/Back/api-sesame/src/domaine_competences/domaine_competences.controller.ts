import { Body, Controller, ForbiddenException, Get, 
    NotAcceptableException, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DomaineCompetencesService } from './domaine_competences.service';
import { CreateDomaineDto, UpdateDomaineDto } from './dto';

@ApiBearerAuth()
@Controller('domaine-competences')
export class DomaineCompetencesController {
    constructor(
        private domaineService: DomaineCompetencesService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createDomaine(@Body() donnees: CreateDomaineDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.domaineService.create(donnees);
    }

    @Get('all')
    async findallDomaine() {
        return await this.domaineService.findall();
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateDomaine(@Body() donnees: UpdateDomaineDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.domaineService.update(donnees);
    }
}
