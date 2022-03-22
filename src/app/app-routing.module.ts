import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { VisualizadorPageComponent } from './pages/visualizador/visualizador-page/visualizador-page.component';

const routes: Routes = [
  { path: 'visualizador', component: VisualizadorPageComponent },
  { path: 'home', component: LandingPageComponent },
  { path: '', component: LandingPageComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
