import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { AproposService } from './services/apropos.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AccueilComponent } from './components/accueil/accueil.component';
import { EmploisComponent } from './components/emplois/emplois.component';
import { EtudiantsComponent } from './components/etudiants/etudiants.component';
import { AccueilService } from './services/accueil.service';
import { EmploisService } from './services/emplois.service';
import { EmploiItemComponent } from './components/emploi-item/emploi-item.component';
import { OthersService } from './services/others.service';
import { EtudiantsService } from './services/etudiants.service';
import { StatusColor } from './directives/status-color.directive';
import { RemoveSpace } from './pipes/remove-space.pipe';
import { ComptesComponent } from './components/comptes/comptes.component';
import { ExporterComponent } from './components/exporter/exporter.component';

@NgModule({
  declarations: [
    BodyComponent,
    SidenavComponent,
    HeaderComponent,
    ShortenPipe,
    AccueilComponent,
    EmploisComponent,
    EtudiantsComponent,
    EmploiItemComponent,
    StatusColor,
    RemoveSpace,
    ComptesComponent,
    ExporterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [
    AproposService,
    AccueilService,
    EmploisService,
    OthersService,
    EtudiantsService
  ]
})
export class AdminModule { }
