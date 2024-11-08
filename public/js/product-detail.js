import services from "./partials/services.js";
import renderHeaderAndFooter from "./partials/headerAndFooter.js";

// Render header and footer
renderHeaderAndFooter();

// variables
let productId = location.search.split("id=")[1];
const { data: product } = await services.getProductById(productId);
const productCategorySlug = product.category;
const productCategory =
  product.category.charAt([0]).toUpperCase() + product.category.slice(1);
const productImages = product.images;

//get element
const navLinkListEl = document.getElementById("nav-link-list");
const productImageEl = document.getElementById("product-image");
const productInfoEl = document.getElementById("product-info");

//render
function renderNavLinkList() {
  let navLinkListHTML = "";
  navLinkListHTML += `
    <li class="flex items-center">
      <a class="mr-3 block text-blue-500" href="index.html">Shopee</a>
      <i class="fa-solid fa-angle-right text-xs text-gray-400"></i>
    </li>
    <li class="flex items-center">
      <a class="mx-3 block text-blue-500" href="category.html?category=${productCategorySlug}">${productCategory}</a>
      <i class="fa-solid fa-angle-right text-xs text-gray-400"></i>
    </li>
    <li class="ml-3 line-clamp-1">${product.title}</li>
  `;
  navLinkListEl.innerHTML = navLinkListHTML;
}
function renderProductImage() {
  let productImageListHTML = "";
  productImages.forEach((image) => {
    productImageListHTML += `
      <div class="swiper-slide">
        <img src="${image}" />
      </div>
    `;
  });
  let productImageHTML = "";
  productImageHTML += `
    <div class="swiper mySwiperPreview">
      <div class="swiper-wrapper">
        ${productImageListHTML}
      </div>
      <div class="swiper-button-next text-gray-400"></div>
      <div class="swiper-button-prev text-gray-400"></div>
    </div>
    <div thumbsSlider="" class="swiper mySwiper">
      <div class="swiper-wrapper">
        ${productImageListHTML}
      </div>
    </div>
  `;
  productImageEl.innerHTML = productImageHTML;
}
function renderProductInfo() {
  let productInfoHTML = "";
  productInfoHTML += `
    <!-- product name -->
          <h1 class="text-xl font-bold">
            ${product.title}
          </h1>
          <!-- product rating star and stock -->
          <div class="mt-3 flex">
            <!-- star -->
            <div class="flex pr-3">
              <span>${product.rating}</span>
              <i
                class="fa-solid fa-star ml-1 mt-[5px] block text-[12px] text-yellow-500"
              ></i>
            </div>
            <!-- number of stock -->
            <div class="border-l-[1px] border-gray-300 pl-3">
              <span>${product.stock} pieces available</span>
            </div>
          </div>
          <!-- product price -->
          <div class="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 p-3">
            <span class="text-3xl font-bold text-orange-600">$${((product.price * (100 - product.discountPercentage)) / 100).toFixed(2)}</span>
            <span class="text-gray-400 line-through">$${product.price}</span>
            <span
              class="rounded-md bg-red-200 px-1 py-[2px] text-xs font-bold text-red-600"
              >-${product.discountPercentage}%</span
            >
          </div>
          <!-- form add to cart -->
          <div class="mt-4">
            <!-- quantity -->
            <div
              class="flex w-fit items-center rounded-md border-[1px] border-gray-300"
            >
              <button
                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg"
                id="decrease-quantity"
              >
                <i class="fa-solid fa-minus text-gray-500"></i>
              </button>
              <input
                class="h-[38px] w-[60px] border-x-[1px] border-gray-300 text-center outline-none"
                type="text"
                value="1"
                id="quantity"
                disabled
              />
              <button
                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg"
                id="increase-quantity"
              >
                <i class="fa-solid fa-plus text-gray-500"></i>
              </button>
            </div>
            <!-- button add to cart -->
            <div class="mt-4">
              <button
                class="rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-500"
                id="add-to-cart"
              >
                <i class="fa-solid fa-cart-shopping mr-1"></i>
                Add to cart
              </button>
            </div>
          </div>
  `;
  productInfoEl.innerHTML = productInfoHTML;
}

//run app
renderNavLinkList();
renderProductImage();
renderProductInfo();

//get element
const decreaseQuantityBtn = document.getElementById("decrease-quantity");
const increaseQuantityBtn = document.getElementById("increase-quantity");
const quantityInput = document.getElementById("quantity");
const addToCartBtn = document.getElementById("add-to-cart");

//event listener
function checkQuantityInput() {
  if (+quantityInput.value < 1) {
    quantityInput.value = 1;
  }
  if (+quantityInput.value > product.stock) {
    quantityInput.value = product.stock;
  }
  if (+quantityInput.value === 1) {
    decreaseQuantityBtn.disabled = true;
    decreaseQuantityBtn.style.opacity = "0.5";
  }
  if (+quantityInput.value > 1) {
    decreaseQuantityBtn.disabled = false;
    decreaseQuantityBtn.style.opacity = 1;
  }
  if (+quantityInput.value === product.stock) {
    increaseQuantityBtn.disabled = true;
    increaseQuantityBtn.style.opacity = 0.5;
  }
  if (+quantityInput.value < product.stock) {
    increaseQuantityBtn.disabled = false;
    increaseQuantityBtn.style.opacity = 1;
  }
}
checkQuantityInput();
decreaseQuantityBtn.addEventListener("click", () => {
  quantityInput.value = parseInt(quantityInput.value) - 1;
  checkQuantityInput();
});
increaseQuantityBtn.addEventListener("click", () => {
  quantityInput.value = parseInt(quantityInput.value) + 1;
  checkQuantityInput();
});
addToCartBtn.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItem = cart.find((item) => item.id === product.id);
  if (cartItem) {
    let tempQuantity = cartItem.quantity + +quantityInput.value;
    if (tempQuantity > product.stock) {
      alert(`Only ${product.stock} pieces available`);
      return;
    }
    cartItem.quantity = tempQuantity;
  } else {
    cart.push({ ...product, quantity: +quantityInput.value });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
  renderHeaderAndFooter();
});

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
