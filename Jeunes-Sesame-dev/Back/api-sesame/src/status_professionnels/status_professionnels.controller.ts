import { Body, Controller, ForbiddenException, Get, NotAcceptableException, 
    Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateStatusDto } from './dto';
import { StatusProfessionnelsService } from './status_professionnels.service';

@ApiBearerAuth()
@Controller('status-professionnels')
export class StatusProfessionnelsController {
    constructor(
        private statusService: StatusProfessionnelsService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createStatus(@Body() donnees: CreateStatusDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.statusService.create(donnees);
    }

    @Get('all')
    async findallStatus() {
        return await this.statusService.findall();
    }
}
