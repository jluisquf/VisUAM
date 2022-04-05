import { Component, OnInit } from '@angular/core';
import * as users from 'src/assets/json/team.config.json';

@Component({
  selector: 'app-equipo-section',
  templateUrl: './equipo-section.component.html',
  styleUrls: ['./equipo-section.component.css']
})
export class EquipoSectionComponent implements OnInit {

  Datos:any = users;
  constructor() { }

  ngOnInit(): void {
    this.Datos = this.getDatos();
  }

  getDatos(){
    return this.Datos.Integrantes;
  }

}
