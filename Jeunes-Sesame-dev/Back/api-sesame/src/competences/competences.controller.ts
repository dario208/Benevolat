import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, 
    Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CompetencesService } from './competences.service';
import { CreateCompetencesDto, ParamCompetencesEtudiantIdDto, 
    ParamCompetencesIdDto, UpdateCompetencesDto } from './dto';

@ApiBearerAuth()
@Controller('competences')
export class CompetencesController {
    constructor(
        private competencesService: CompetencesService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createCompetences(@Body() donnees: CreateCompetencesDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.competencesService.create(donnees, +req.user.id);
    }

    @Get('all')
    async findallCompetences() {
        return await this.competencesService.findall();
    }
    
    @Get('etudiants/:etudiant_id')
    async findCompetencesByEtudiantId(@Param() donnees: ParamCompetencesEtudiantIdDto) {
        if(!donnees) throw new NotAcceptableException('Credetials incorrects !');
        return await this.competencesService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('etudiants')
    async findCompetencesByEtudiants(@Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects !');
        const donnees = { etudiant_id: parseInt(req.user.id) };
        return await this.competencesService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateCompetences(@Body() donnees: UpdateCompetencesDto) {
        if(!donnees) throw new NotAcceptableException('Credetials incorrects !');
        return await this.competencesService.update(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/:competence_id')
    async deleteCompetences(@Param() donnees: ParamCompetencesIdDto) {
        if(!donnees) throw new NotAcceptableException('Credetials incorrects !');
        return await this.competencesService.delete(donnees);
    }
}
