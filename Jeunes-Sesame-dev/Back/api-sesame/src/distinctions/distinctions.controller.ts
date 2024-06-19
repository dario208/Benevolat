import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, 
    Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DistinctionsService } from './distinctions.service';
import { CreateDistinctionsDto, ParamDistinctionsEtudiantIdDto, 
    ParamDistinctionsIdDto, UpdateDistinctionsDto } from './dto';

@ApiBearerAuth()
@Controller('distinctions')
export class DistinctionsController {
    constructor(
        private distinctionsService: DistinctionsService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createDistinctions(@Body() donnees: CreateDistinctionsDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.distinctionsService.create(donnees, +req.user.id);
    }

    @Get('all')
    async findallDistinctions() {
        return await this.distinctionsService.findall();
    }

    @Get('etudiants/:etudiant_id')
    async findDistinctionsByEtudiantId(@Param() donnees: ParamDistinctionsEtudiantIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.distinctionsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('etudiants')
    async findDistinctionsByEtudiants(@Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects !');
        const donnees = { etudiant_id: parseInt(req.user.id) };
        return await this.distinctionsService.findByEtudiantId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateDistinctions(@Body() donnees: UpdateDistinctionsDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.distinctionsService.update(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/distinction_id')
    async deleteDistinctions(@Param() donnees: ParamDistinctionsIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.distinctionsService.delete(donnees);
    }
}
