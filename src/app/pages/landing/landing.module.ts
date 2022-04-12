import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoSectionComponent } from './equipo-section/equipo-section.component';
import { TecnologiasSectionComponent } from './tecnologias-section/tecnologias-section.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgsRevealModule } from 'ngx-scrollreveal';


@NgModule({
  declarations: [
    EquipoSectionComponent,
    TecnologiasSectionComponent,
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgsRevealModule
  ]
})
export class LandingModule { }
