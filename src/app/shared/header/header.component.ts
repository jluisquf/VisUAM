import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  public isMenuActive: boolean = true;

  constructor() { }

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
