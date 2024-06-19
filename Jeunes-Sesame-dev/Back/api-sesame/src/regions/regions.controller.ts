import { Body, Controller, ForbiddenException, 
    Get, NotAcceptableException, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRegionsDto, UpdateRegionsDto } from './dto';
import { RegionsService } from './regions.service';

@ApiBearerAuth()
@Controller('regions')
export class RegionsController {
    constructor(
        private regionsService: RegionsService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createRegions(@Body() donnees: CreateRegionsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.regionsService.create(donnees);
    }

    @Get('all')
    async findallRegions() {
        return await this.regionsService.findall();
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateRegions(@Body() donnees: UpdateRegionsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.regionsService.update(donnees);
    }
}
