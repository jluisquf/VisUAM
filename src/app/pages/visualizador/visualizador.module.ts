import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizadorPageComponent } from './visualizador-page/visualizador-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgsRevealModule } from 'ngx-scrollreveal';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    VisualizadorPageComponent,
    CanvasComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgsRevealModule
  ]
})
export class VisualizadorModule { }
