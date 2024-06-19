import { Body, Controller, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConsulatationsService } from './consulatations.service';
import { CreateConsultationsDto, ParamConsultationsIdDto, UpdateConsultationsDto } from './dto';

@ApiBearerAuth()
@Controller('consulatations')
export class ConsulatationsController {
    constructor(
        private consultationsService: ConsulatationsService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createConsultations(@Body() donnees: CreateConsultationsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.consultationsService.create(donnees);
    }

    @Get('all')
    async findall() {
        return await this.consultationsService.findall();
    }

    @Get(':consultation_id')
    async findoneConsultations(@Param() donnees: ParamConsultationsIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.consultationsService.findone(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateConsultations(@Body() donnees: UpdateConsultationsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.consultationsService.update(donnees);
    }
}
