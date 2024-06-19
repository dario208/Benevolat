import { Body, Controller, Delete, ForbiddenException, Get, NotAcceptableException, 
    Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetsDto, ParamProjetsEtudiantId, 
    ParamProjetsIdDto, UpdateProjetsDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('projets')
export class ProjetsController {
    constructor(
        private readonly projetsService: ProjetsService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createProjets(@Body() donnees: CreateProjetsDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.projetsService.create(donnees, +(req.user.id));
    }

    @Get('all')
    async findallProjets() {
        return await this.projetsService.findall();
    }

    @Get('etudiants/:etudiant_id')
    async findProjetsByEtudiantId(@Param() donnees: ParamProjetsEtudiantId) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.projetsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('etudiants')
    async findProjetsByEtudiants(@Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        const donnees = {etudiant_id: +req.user.id};
        return await this.projetsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateProjets(@Body() donnees: UpdateProjetsDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.projetsService.update(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/:projet_id')
    async deleteProjets(@Param() donnees: ParamProjetsIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.projetsService.delete(donnees);
    }
}
