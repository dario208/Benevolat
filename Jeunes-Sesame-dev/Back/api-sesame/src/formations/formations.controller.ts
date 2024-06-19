import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, 
    Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateFormationsDto, ParamFormationsEtudiantIdDto, 
    ParamFormationsIdDto, UpdateFormationsDto } from './dto';
import { FormationsService } from './formations.service';

@ApiBearerAuth()
@Controller('formations')
export class FormationsController {
    constructor(
        private formationsService: FormationsService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createFormations(@Body() donnees: CreateFormationsDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.formationsService.create(donnees, +req.user.id);
    }

    @Get('all')
    async findallFormations() {
        return await this.formationsService.findall();
    }

    @Get('etudiants/:etudiant_id')
    async findFormationsByEtudiantId(@Param() donnees: ParamFormationsEtudiantIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.formationsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('etudiants')
    async findFormationsEtudiants(@Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        const donnees = { etudiant_id: parseInt(req.user.id) };
        return await this.formationsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateFormations(@Body() donnees: UpdateFormationsDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.formationsService.update(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/:formation_id')
    async deleteFormations(@Param() donnees: ParamFormationsIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.formationsService.delete(donnees);
    }
}
