import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';//para la traducción

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  public isMenuActive: boolean = true;

  langs: string[] = ['es','en'];
  val: string = 'es';

  // Variable que va guardar el lenguaje seleccionado que puede estar en localStorage
  // La variable la guardamos en la función cambiaIdioma()
  valLocalStorage: string | null;


  constructor(public translate: TranslateService) {
    // Tratamos de obtener el valor del localStorage, puede ser alguno de los dos o null
    this.valLocalStorage = localStorage.getItem("lang");
    // console.log("Languaje en el constructor", this.valLocalStorage);  // Ya no te necesito

    // Actualizamos el lenguaje según el valor guardado en localStorage, si no
    // hay nada en localStorage entonces usamos 'es'
    this.val = this.valLocalStorage || 'es';

    translate.setDefaultLang(this.val);//la configuración por defecto es en español
    translate.use(this.val);//y va a usar esta config
    translate.addLangs(this.langs);
  }

  ngOnInit(): void {
    let myNav:any = document.getElementById("header");

    window.onscroll = function() {
      "use strict";
      if (window.innerWidth >= 765) {
        if (document.body.scrollTop >= 80 || document.documentElement.scrollTop >= 80) {
          myNav.classList.add("scroll-header");
        } else {
          myNav.classList.remove("scroll-header");
        }
      }
    };

    if (window.innerWidth < 765) {
      this.isMenuActive = false;
    }

    console.log(this.val)
  }

  cambiaIdioma(lang:string) {
    this.val = lang;
    this.translate.use(lang);
    console.log('cambie de indioma (val): ' + this.val)
    console.log('cambie de indioma (lang): ' + lang)
    if (window.innerWidth < 765) {
      this.isMenuActive = false;
    }

    // Guardamos en localStorage una variable llamada lang con el lenguaje
    // seleccionado para poder mantenerlo entre las diferentes páginas
    localStorage.setItem("lang", lang);
  }

  showMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

}
