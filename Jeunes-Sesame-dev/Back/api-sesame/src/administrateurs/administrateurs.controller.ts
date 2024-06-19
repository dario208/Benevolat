import { Body, Controller, ForbiddenException, Get, 
    HttpCode, NotAcceptableException, Patch, Post, Request, 
    UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Administrateurs } from 'src/entities/Administrateurs';
import { AdministrateursService } from './administrateurs.service';
import { CreateAdminDto, UpdateAdminDto, UpdateAdminPasswordDto, 
    UpdateForgotPasswordAdminDto } from './dto';

@ApiBearerAuth()
@Controller('administrateurs')
export class AdministrateursController {
    constructor(
        private adminService: AdministrateursService
    ) {}

    @UseGuards(AuthGuard('jwtSesame'))
    @Post('create')
    async createAdmin(@Body() donnees: CreateAdminDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects');
        return await this.adminService.create(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('all')
    async findallAdmin() {
        return await this.adminService.findall();
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Get('find')
    async findoneAdmin(@Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        return await this.adminService.findone(parseInt(req.user.id));
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update')
    async updateAdmin(@Body() donnees: UpdateAdminDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.adminService.update(donnees, parseInt(req.user.id));
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @Patch('update-password')
    async updatePasswordAmdin(@Body() donnees: UpdateAdminPasswordDto, @Request() req: any) {
        if(req.user.fonction !== 'admin') throw new ForbiddenException('Credentials incorrects !');
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.adminService.updatePassword(donnees, parseInt(req.user.id));
    }

    @Post('update-forgot-password')
    @HttpCode(200)
    async updateForgotPasswordAdmin(@Body() donnees: UpdateForgotPasswordAdminDto) {
        if(!donnees) throw new NotAcceptableException('Credentials incorrects !');
        return await this.adminService.updateForgotPassword(donnees);
    }

    @UseGuards(AuthGuard('jwtSesame'))
    @UseInterceptors(FileInterceptor('filepdp', {
        storage: diskStorage({
            destination: './uploads/admin_profils/',
            filename: (req, file, cb): void => {
                const name: string = file.originalname.split('.')[0];
                const tmp: Array<string> = file.originalname.split('.');
                const fileExtension: string = tmp[tmp.length -1];
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
    @Patch('update-profil')
    async updateProfilAdmin(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        const lastProfil: Administrateurs = await this.adminService.verifyProfil(parseInt(req.user.id));
        if(lastProfil.profilPath) {
            const fs = require('fs');
            fs.unlink('./uploads' + lastProfil.profilPath, (err: any, data: any) => {
                if(err) throw new Error('Erreur de supression du fichier !');
            });
        }
        const pathfile: string = `/admin_profils/${ file.filename }`;
        return await this.adminService.updateProfil(pathfile, parseInt(req.user.id));
    }
}
