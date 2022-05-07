import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  public isMenuActive: boolean = true;

  // Variable que guarda la ruta actual
  // Se usa para ocultar el botón "Abrir Visualizador" cuando se está 
  // en la ruta /visualizador
  ruta: String;

  constructor(private router: Router) {
    // Al momento de crear el componente en cualquier ruta leemos la ruta en la
    // que se encuentra el usuario
    this.ruta = router.url;
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
  }

  showMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

}
