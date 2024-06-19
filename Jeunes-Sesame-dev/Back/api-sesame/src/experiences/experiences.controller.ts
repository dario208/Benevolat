import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, 
    Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateExperiencesDto, ParamExperiencesEtudiantIdDto, 
    ParamExperiencesIdDto, UpdateExperiencesDto } from './dto';
import { ExperiencesService } from './experiences.service';

@ApiBearerAuth()
@Controller('experiences')
export class ExperiencesController {
    constructor(
        private experiencesService: ExperiencesService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createExperiences(@Body() donnees: CreateExperiencesDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.experiencesService.create(donnees, +req.user.id);
    }

    @Get('all')
    async findallExperiences() {
        return await this.experiencesService.findall();
    }

    @Get('etudiants/:etudiant_id')
    async findExperiencesByEtudiantsId(@Param() donnees: ParamExperiencesEtudiantIdDto) {
        return await this.experiencesService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('etudiants')
    async findExperiencesByEtudiants(@Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        const donnees = { etudiant_id: parseInt(req.user.id) };
        return await this.experiencesService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateExperiences(@Body() donnees: UpdateExperiencesDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrets!');
        return await this.experiencesService.udpate(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/:experience_id')
    async deleteExperiences(@Param() donnees: ParamExperiencesIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.experiencesService.delete(donnees);
    }
}
