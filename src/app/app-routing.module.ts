import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { VisualizadorPageComponent } from './pages/visualizador/visualizador-page/visualizador-page.component';

const routes: Routes = [
  { path: 'visualizador', component: VisualizadorPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
