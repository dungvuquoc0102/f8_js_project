import services from "./partials/services.js";
import renderHeaderAndFooter from "./partials/headerAndFooter.js";

//swiper slider
var swiper = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});
var swiperPreview = new Swiper(".mySwiperPreview", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

// Render header and footer
renderHeaderAndFooter();
