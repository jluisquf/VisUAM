import { Component, OnInit } from '@angular/core';
import * as team from 'src/assets/json/team.config.json';

@Component({
  selector: 'app-equipo-section',
  templateUrl: './equipo-section.component.html',
  styleUrls: ['./equipo-section.component.css']
})
export class EquipoSectionComponent implements OnInit {

  Team: any = team;
  Researchers: any;
  Developers: any;

  showInfoStatus: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.Researchers = this.getDatos()[0];
    this.Developers = this.getDatos()[1];
  }

  getDatos(){
    return [this.Team.Researchers, this.Team.Developers];
  }

}
