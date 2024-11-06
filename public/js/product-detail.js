import services from "./partials/services.js";
import renderHeaderAndFooter from "./partials/headerAndFooter.js";

document.addEventListener("DOMContentLoaded", function () {
  new Splide("#thumbnail-carousel", {
    fixedWidth: 100,
    fixedHeight: 60,
    gap: 10,
    rewind: true,
    pagination: false,
  }).mount();
});

// Render header and footer
renderHeaderAndFooter();
