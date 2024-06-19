import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, Request, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { interval, map, Observable, switchMap } from 'rxjs';
import { Emplois } from 'src/entities/Emplois';
import { CreateEmploisDto, ParamEmploisAdminIdDto, ParamEmploisIdDto, UpdateEmploisDto } from './dto';
import { EmploisService } from './emplois.service';

@ApiBearerAuth()
@Controller('emplois')
export class EmploisController {
    constructor(
        private emploisService: EmploisService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createEmplois(@Body() donnees: CreateEmploisDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.emploisService.create(donnees, +req.user.id);
    }

    @Get('all')
    async findallEmplois() {
        return await this.emploisService.findall();
    }

    @Sse('sse-all')
    findallEmploisSse(): Observable<{data: Emplois[]}> {
        return interval(1000).pipe(
            switchMap(() => this.emploisService.observableFindall()),
            map(response => ({data: response}))
        );
    }

    @Sse('sse-current')
    findCurrentEmplois(): Observable<{data: {current: boolean}}> {
        return interval(1000).pipe(
            switchMap(() => this.emploisService.observableFindCurrent()),
            map(response => ({data: {current: response}}))
        );
    }
    
    @Get(':emploi_id')
    async findoneEmplois(@Param() donnees: ParamEmploisIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.emploisService.findone(donnees);
    }

    @Get('administrateurs/:administrateur_id')
    async findEmploisByAdminId(@Param() donnees: ParamEmploisAdminIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.emploisService.findByAdminId(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateEmplois(@Body() donnees: UpdateEmploisDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.emploisService.update(donnees);
    }

    @UseGuards(AuthGuard(('jwtSesame')))
    @Delete('delete/:emploi_id')
    async deleteEmplois(@Param() donnees: ParamEmploisIdDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.emploisService.delete(donnees);
    }
}
