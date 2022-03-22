import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('header') header: ElementRef | undefined;


  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    
  }

  headerChanger(){
    let rend = this.renderer;
    let element = this.header?.nativeElement;
    window.onscroll = function() {
      "use strict";
      if (document.body.scrollTop >= 280 || document.documentElement.scrollTop >= 280) {
        rend.addClass(element, "scroll-header")
      } else {
        rend.removeClass(element, "scroll-header")
      }
    };
  }

}
