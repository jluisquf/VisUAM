import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingModule } from './pages/landing/landing.module';
import { SharedModule } from './shared/shared.module';
import { VisualizadorModule } from './pages/visualizador/visualizador.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LandingModule,
    VisualizadorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
