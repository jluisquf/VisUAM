import { Component, OnInit } from '@angular/core';
import * as tecnologias from 'src/assets/json/tecnologias.config.json';

@Component({
  selector: 'app-tecnologias-section',
  templateUrl: './tecnologias-section.component.html',
  styleUrls: ['./tecnologias-section.component.css']
})
export class TecnologiasSectionComponent implements OnInit {

  rutasImgTec:any = tecnologias;

  constructor() { }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos():void{
    this.rutasImgTec = this.rutasImgTec.Tecnologias;
  }

}