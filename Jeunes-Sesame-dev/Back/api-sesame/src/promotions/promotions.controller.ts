import { Body, Controller, Delete, ForbiddenException, Get, 
    NotAcceptableException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePromotionsDto, ParamPromotionsIdDto, 
    ParamStatusProDto, UpdatePromotionsDto } from './dto';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
    constructor(
        private promotionsService: PromotionsService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createPromotions(@Body() donnees: CreatePromotionsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.promotionsService.create(donnees);
    }

    @Get('all')
    async findallPromotions() {
        return await this.promotionsService.findall();
    }

    @Get('count/status-pro/:status_id')
    async countByStatusPro(@Param() donnees: ParamStatusProDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.promotionsService.countByStatusPro(donnees);
    }

    @Put('update')
    async updatePromotions(@Body() donnees: UpdatePromotionsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.promotionsService.update(donnees);
    }

    @Delete('delete/:promotion_id')
    async deletePromotions(@Param() donnees: ParamPromotionsIdDto,  @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.promotionsService.delete(donnees);
    }
 }
