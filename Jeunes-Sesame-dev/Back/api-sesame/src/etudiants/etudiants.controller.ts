import { Body, Controller, ForbiddenException, Get, 
    NotAcceptableException, Param, Patch, Post, Put, 
    Request, UploadedFile, UseGuards, UseInterceptors, 
    HttpCode, Query, DefaultValuePipe, ParseIntPipe, 
    Delete, StreamableFile, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateEtudiantsDto, FiltreEtudiantsDto, ParamEtudiantsDomaineIdDto, 
    ParamEtudiantsIdDto, ParamEtudiantsFiliereId, ParamEtudiantsPromotionId, 
    ParamEtudiantsRegionIdDto, ParamEtudiantsStatusId, UpdateEtudiantsDto, 
    UpdateEtudiantsPasswordDto, UpdateForgotPasswordDto, ParamActifDto,
    ParamStatusProDto, CountStatusProAndPromotionsDto, UpdateNomDto, 
    FindFilterEtudiantsDto} from './dto';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { EtudiantsService } from './etudiants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Etudiants } from 'src/entities/Etudiants';
import { Pagination } from 'nestjs-typeorm-paginate';
import { createReadStream, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';
import { Cron } from '@nestjs/schedule';

@ApiBearerAuth()
@Controller('etudiants')
export class EtudiantsController {
    constructor(
        private etudiantsService: EtudiantsService
    ) {}
    
    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createEtudiants(@Body() donnees: CreateEtudiantsDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.etudiantsService.create(donnees);
    }

    @Get('all')
    async findallPaginateEtudiants(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(31), ParseIntPipe) limit: number = 31
    ): Promise<Pagination<Etudiants>> {
        limit = limit > 31 ? 31 : limit;
        return this.etudiantsService.findallPaginate({
            page,
            limit,
            route: '/etudiants/all'
        });
    }

    @Get('find-all')
    async findallEtdudiants() {
        return await this.etudiantsService.findall();
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('')
    async findoneEtudiants(@Request() req: any) {
        const donnees = {etudiant_id: parseInt(req.user.id)};
        return await this.etudiantsService.findone(donnees);
    }

    @Get(':etudiant_id')
    async findoneEtudiantsById(@Param() donnees: ParamEtudiantsIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findone(donnees);
    }

    @Get('regions/:region_id')
    async findEtudiantsByRegionId(@Param() donnees: ParamEtudiantsRegionIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findByRegionId(donnees);
    }

    @Get('domaines/:domaine_id')
    async findEtudiantsByDomaineId(@Param() donnees: ParamEtudiantsDomaineIdDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findByDomaineId(donnees);
    }

    @Get('filiere/:filiere_id')
    async findEtudiantsByFiliereId(@Param() donnees: ParamEtudiantsFiliereId) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findByFiliereId(donnees);
    }

    @Get('status/:status_id')
    async findEtudiantsByStatusId(@Param() donnees: ParamEtudiantsStatusId) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findByStatusId(donnees);
    }

    @Get('promotions/:promotion_id')
    async findEtudiantsByPromotionId(@Param() donnees: ParamEtudiantsPromotionId) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.findByPromotionId(donnees);
    }

    @Get('count/all')
    async countallEtudiants() {
        return await this.etudiantsService.countall();
    }

    @Get('count/actif/:actif_id')
    async countActifEtudiants(@Param() donnees: ParamActifDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.countActif(donnees);
    }

    @Get('count/status-pro/:status_id')
    async countByStatusProEtudiants(@Param() donnees: ParamStatusProDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.countByStatusPro(donnees);
    }

    @Post('count/status-pro/promotion')
    @HttpCode(200)
    async countByStatusProByPromotionsEtudiants(@Body() donnees: CountStatusProAndPromotionsDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.countByStatusProByPromotions(donnees);

    }

    @Post('filtre')
    @HttpCode(200)
    async filtreEtudiants(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(31), ParseIntPipe) limit: number = 31,
        @Body() donnees: FiltreEtudiantsDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        limit = limit > 31 ? 31 : limit;
        return this.etudiantsService.filtrePaginate(
            donnees, {
                page,
                limit,
                route: '/etudiants/filtre'
            });
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('find-filter')
    @HttpCode(200)
    async findFilterEtudiants(@Body() donnees: FindFilterEtudiantsDto, 
        @Res({passthrough: true}) res: Response, @Request() req: any): Promise<StreamableFile> {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        const filename = await this.etudiantsService.findFilterExcel(donnees);
        const file =  createReadStream(join(process.cwd(), `uploads/excels/${filename}`));
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
       return new StreamableFile(file);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Put('update')
    async updateEtudiants(@Body() donnees: UpdateEtudiantsDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.update(donnees, parseInt(req.user.id));
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update-nom')
    async updateNomEtudiant(@Body() donnees: UpdateNomDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.updateNom(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update-password')
    async updatePasswordEtudiants(@Body() donnees: UpdateEtudiantsPasswordDto, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.updatePassword(donnees, parseInt(req.user.id));
    }

    @Post('update-forgot-password')
    @HttpCode(200)
    async updateForgotPasswordEtudiants(@Body() donnees: UpdateForgotPasswordDto) {
        if(!donnees) if(!donnees) throw new NotAcceptableException('Credentials incorrects');
        return await this.etudiantsService.updateForgotPassword(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update-pdp')
    @UseInterceptors(FileInterceptor('filepdp', {
        storage: diskStorage({
            destination: './uploads/etudiants_pdp/',
            filename: (req, file, cb): void => {
                const name: string = file.originalname.split('.')[0];
                const tmp: Array<string> = file.originalname.split('.');
                const fileExtension: string = tmp[tmp.length - 1];
                const newFilename: string = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if(file.size > 1000) return cb(null, false);
            if(!file.originalname.match(/\.(png|jpg|jpeg|svg)$/)) 
                return cb(null, false);
            cb(null, true);
        }
    }))
    async updatePDPEtudiants(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        const lastPdp: Etudiants = await this.etudiantsService.verifyPDP(parseInt(req.user.id));
        if(lastPdp.pdp) {
            const fs = require('fs');
            if(fs.existsSync('./uploads'+lastPdp.pdp)) {
                fs.unlink('./uploads'+lastPdp.pdp, (err: any, data: any) => {
                    if(err) throw new Error('Erreur de supression du fichier!');
                });
            }
        }
        const pathfile: string = `${process.env.API_URL}/etudiants_pdp/${file.filename}`;
        return await this.etudiantsService.updatePDP(pathfile, parseInt(req.user.id));
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update-pdc')
    @UseInterceptors(FileInterceptor('filepdc', {
        storage: diskStorage({
            destination: './uploads/etudiants_pdc/',
            filename: (req, file, cb): void => {
                const name: string = file.originalname.split('.')[0];
                const tmp: Array<string> = file.originalname.split('.');
                const fileExtension: string = tmp[tmp.length - 1];
                const newFilename: string = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
                cb(null, newFilename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if(file.size > 1000) return cb(null, false);
            if(!file.originalname.match(/\.(png|jpg|jpeg|svg)$/)) 
                return cb(null, false);
            cb(null, true);
        }
    }))
    async updatePDCEtudiants(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if(req.user.fonction !== 'etudiants') throw new ForbiddenException('Credentials incorrects!');
        const lastPdc: Etudiants = await this.etudiantsService.verifyPDC(parseInt(req.user.id));
        if(lastPdc.pdc) {
            const fs = require('fs');
            if(fs.existsSync('./uploads'+lastPdc.pdc)) {
                fs.unlink('./uploads'+lastPdc.pdc, (err: any, data: any) => {
                    if(err) throw new Error('Erreur de suppression du fichier!');
                });
            }
        }
        const pathfile: string = `${process.env.API_URL}/etudiants_pdc/${file.filename}`;
        return await this.etudiantsService.updatePDC(pathfile, parseInt(req.user.id));
    }

    @Patch('popularity/:etudiant_id')
    async setPopularityEtudiants(@Param() donnees: ParamEtudiantsIdDto, @Request() req: any) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');

        const headers = req.rawHeaders.map((value: string) => value.toLowerCase());      
        if(!headers.includes('origin'))
            throw new ForbiddenException('Credentials incorrects!');
        const indexOrigin = headers.indexOf('origin');
        const allowOrigin = (process.env.ALLOW_ORIGIN).split(',').map(value => value.trim());
        if(!allowOrigin.includes(headers[indexOrigin + 1]))
            throw new ForbiddenException('Credentials incorrects!');
        return await this.etudiantsService.setPopularity(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Delete('delete/:etudiant_id')
    async archiveEtudiant(@Param() donnees: ParamEtudiantsIdDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects!');
        return await this.etudiantsService.archive(donnees);
    }

    @Cron('* 0 0 * * *')
    async removeExcelFiles() {
        const files = readdirSync('uploads/excels');
        if(!files.length) return;
        files.forEach(value => {
            unlinkSync(`uploads/excels/${value}`);
        });
    }
}
