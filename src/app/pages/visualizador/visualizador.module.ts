import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizadorPageComponent } from './visualizador-page/visualizador-page.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    VisualizadorPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class VisualizadorModule { }
