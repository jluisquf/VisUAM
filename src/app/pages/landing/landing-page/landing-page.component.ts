import { Component, OnInit } from '@angular/core';
import { NgsRevealConfig } from 'ngx-scrollreveal';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(config: NgsRevealConfig) {
    config.scale = 1; 
    config.distance = '60px';
    config.duration = 500;
    config.delay = 500;
  }
  ngOnInit(): void {
  }

}
