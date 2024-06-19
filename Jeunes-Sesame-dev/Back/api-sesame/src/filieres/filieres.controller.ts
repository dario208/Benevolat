import { Body, Controller, ForbiddenException, Get, NotAcceptableException, 
    Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateFilieresDto, ParamFilieresDomaineId, 
    UpdateFilieresDto } from './dto/filieres.dto';
import { FilieresService } from './filieres.service';

@ApiBearerAuth()
@Controller('filieres')
export class FilieresController {
    constructor(
        private filiereService: FilieresService
    ) {}

    @UseGuards(AuthGuard('jwtService'))
    @Post('create')
    async createFilieres(@Body() donnees: CreateFilieresDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.filiereService.create(donnees);
    }

    @Get('all')
    async findallFilieres() {
        return await this.filiereService.findall();
    }

    @Get('domaine/:domaine_id')
    async findFilieresByDomaineId(@Param() donnees: ParamFilieresDomaineId) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.filiereService.findByDomaineId(donnees);
    }

    @UseGuards(AuthGuard('jwtService'))
    @Put('update')
    async updateFilieres(@Body() donnees: UpdateFilieresDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.filiereService.update(donnees);
    } 
}
