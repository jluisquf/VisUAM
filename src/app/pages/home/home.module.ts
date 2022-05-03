import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoSectionComponent } from './equipo-section/equipo-section.component';
import { TecnologiasSectionComponent } from './tecnologias-section/tecnologias-section.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgsRevealModule } from 'ngx-scrollreveal';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    EquipoSectionComponent,
    TecnologiasSectionComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgsRevealModule,
    RouterModule
  ]
})
export class HomeModule { }
