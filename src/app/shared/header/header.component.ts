import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';//para la traducción

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  langs: string[] = ['es','en'];
  val: string = 'es';

  constructor(public translate: TranslateService) {
    translate.setDefaultLang(this.val);//la configuración por defecto es en español
    translate.use(this.val);//y va a usar esta config
    translate.addLangs(this.langs);
  }

  ngOnInit(): void {
    let myNav:any = document.getElementById("header");

    window.onscroll = function() {
      "use strict";
      if (document.body.scrollTop >= 80 || document.documentElement.scrollTop >= 80) {
        myNav.classList.add("scroll-header");
      } else {
        myNav.classList.remove("scroll-header");
      }
    };

    console.log(this.val)
  }

  cambiaIdioma(lang:string) {
    this.val = lang;
    this.translate.use(lang);
    console.log('cambie de indioma (val): ' + this.val)
    console.log('cambie de indioma (lang): ' + lang)
  }

}
