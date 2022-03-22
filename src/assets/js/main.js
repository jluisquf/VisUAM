var myNav = document.getElementById("header");

window.onscroll = function() {
  "use strict";
  if (document.body.scrollTop >= 280 || document.documentElement.scrollTop >= 280) {
    myNav.classList.add("scroll-header");
  } else {
    myNav.classList.remove("scroll-header");
  }
};