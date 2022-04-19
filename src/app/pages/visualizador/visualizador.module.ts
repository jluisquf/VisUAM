import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizadorPageComponent } from './visualizador-page/visualizador-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgsRevealModule} from 'ngx-scrollreveal';
import { CanvasComponent } from './canvas/canvas.component';


@NgModule({
  declarations: [
    VisualizadorPageComponent,
    CanvasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgsRevealModule
  ]
})
export class VisualizadorModule { }
