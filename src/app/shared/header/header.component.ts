import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

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
  }

}
