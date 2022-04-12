import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizadorPageComponent } from './visualizador-page/visualizador-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgsRevealModule} from 'ngx-scrollreveal';


@NgModule({
  declarations: [
    VisualizadorPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgsRevealModule
  ]
})
export class VisualizadorModule { }
