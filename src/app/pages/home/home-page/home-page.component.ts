import { Component, OnInit } from '@angular/core';
import { NgsRevealConfig } from 'ngx-scrollreveal';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(config: NgsRevealConfig) {
    config.scale = 1; 
    config.distance = '60px';
    config.duration = 500;
    config.delay = 500;
  }
  ngOnInit(): void {
  }

}
