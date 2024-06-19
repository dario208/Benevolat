import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { BodyComponent } from './components/body/body.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { EmploisComponent } from './components/emplois/emplois.component';
import { EtudiantsComponent } from './components/etudiants/etudiants.component';
import { ExporterComponent } from './components/exporter/exporter.component';

const routes: Routes = [
  { 
    path: '', 
    component: BodyComponent,
    children: [
      {path: 'accueil', component: AccueilComponent},
      {path: 'emplois', component: EmploisComponent},
      {path: 'etudiants', component: EtudiantsComponent},
      {path: 'comptes', component: ComptesComponent},
      {path: 'exporter', component: ExporterComponent},
      {path: '**', redirectTo: 'accueil', pathMatch: 'prefix'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
