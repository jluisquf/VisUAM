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

  showInfoStatus: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
    this.Researchers = this.getDatos()[0];
    this.Developers = this.getDatos()[1];


    for (let i = 0; i < this.Researchers.length; i++){
      this.showInfoStatus.push(false);
    }
  }

  getDatos(){
    return [this.Team.Researchers, this.Team.Developers];
  }

  toggleShowInfo(i: number){
    this.showInfoStatus[i] = !this.showInfoStatus[i];
    console.log(this.showInfoStatus);
  }

  getInfoStatus(i: number){
    return this.showInfoStatus[i];
  }

  getClassInfo(i: number){
    var elem = this.showInfoStatus[i];

    if (elem){
      return "accordion-info-container active";
    } else {
      return "accordion-info-container";
    }
  }
}
