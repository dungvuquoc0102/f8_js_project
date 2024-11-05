import services from "./services.js";
import renderHeaderAndFooter from "./partials/headerAndFooter.js";
var splide = new Splide(".splide", {});
splide.mount();

//render header and footer
renderHeaderAndFooter();

//get element
const categoryListEl = document.getElementById("category-list");
const bigSaleProductListEl = document.getElementById("big-sale-product-list");
const goodRatingProductListEl = document.getElementById(
  "good-rating-product-list",
);
const suggestedProductListEl = document.getElementById(
  "suggested-product-list",
);

//render
async function renderCategories() {
  let categoryListHTML = "";
  const { data } = await services.getCategories();
  data.forEach((category) => {
    categoryListHTML += `
    <li
      class="border-b-[1px] border-r-[1px] border-gray-200 p-2 hover:cursor-pointer hover:bg-gray-200 text-center flex items-center justify-center"
    >
      <a href="/public/category.html?category=${category.slug}">
        <span class="font-semibold">${category.name}</span> 
      </a>
    </li>`;
  });
  categoryListEl.innerHTML = categoryListHTML;
}
async function renderBigSaleProducts() {
  let bigSaleProductListHTML = "";
  const { data } = await services.getProducts();
  //filter products with much discountPercentage
  const bigSaleProducts = data.products
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 10);
  bigSaleProducts.forEach((product) => {
    bigSaleProductListHTML += `
    <li>
      <a class="flex flex-col items-center relative hover:bg-gray-200 rounded-lg overflow-hidden" href="#!">
        <img
          class="rounded-lg object-cover aspect-square w-full"
          src="${product.thumbnail}"
          alt="sale product 1"
        />
        <div class="py-3 text-[20px] text-orange-600">
          <span>$</span>
          <span>${product.price}</span>
        </div>
        <div class="absolute top-0 right-0 bg-orange-400 text-white text-sm p-1 rounded-bl-lg">
          <span>${product.discountPercentage}%</span>
        </div>
      </a>
    </li>`;
  });
  bigSaleProductListEl.innerHTML = bigSaleProductListHTML;
}
async function renderGoodRatingProducts() {
  let goodRatingProductListHTML = "";
  const { data } = await services.getProducts();
  //filter products with the best rating
  const goodRatingProducts = data.products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  goodRatingProducts.forEach((product) => {
    goodRatingProductListHTML += `
    <li>
      <a class="flex flex-col items-center hover:bg-gray-200 rounded-lg overflow-hidden" href="#!">
        <img
          class="rounded-lg object-cover aspect-square w-full"
          src="${product.thumbnail}"
          alt="sale product 1"
        />
        <div class="flex w-full items-center justify-between px-3">
          <div class="text-[18px]">
            <span>${product.rating}</span>
            <i class="fa-solid fa-star text-orange-400 text-[16px]"></i>
          </div>
          <div class="py-3 text-[14px]">
            <span>$</span>
            <span>${product.price}</span>
          </div>
        </div>
      </a>
    </li>
    `;
  });
  goodRatingProductListEl.innerHTML = goodRatingProductListHTML;
}
async function renderSuggestedProducts() {
  let suggestedProductListHTML = "";
  const { data } = await services.getProducts();
  //process data
  const suggestedProducts = data.products.slice(0, 20);
  suggestedProducts.forEach((product) => {
    suggestedProductListHTML += `
    <li class="border-[1px] border-gray-200 rounded-lg bg-white hover:border-orange-400 hover:scale-105 shadow-md">
      <a href="#!">
        <img
          loading="lazy"
          class="aspect-square rounded-lg object-cover"
          src="${product.thumbnail}"
          alt="img product"
        />
        <div class="pt-2 px-2 line-clamp-2 h-[56px] border-t-[1px] border-gray-200">
          ${product.title}
        </div>
        <div class="mt-2 px-2 flex ${Math.round(product.discountPercentage) === 0 ? "opacity-0" : "`"}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 -0.5 4 16"
            class="-mr-px h-5 flex-none"
          >
            <path
              d="M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3"
              stroke-width="1"
              transform=""
              stroke="#F69113"
              fill="#F69113"
            ></path>
          </svg>
          <span class="bg-orange-400 text-white text-sm">${Math.round(product.discountPercentage)}% Discount</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 -0.5 4 16"
            class="-ml-px h-5 flex-none rotate-180"
          >
            <path
              d="M4 0h-3q-1 0 -1 1a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3v0.333a1.2 1.5 0 0 1 0 3q0 1 1 1h3"
              stroke-width="1"
              transform=""
              stroke="#F69113"
              fill="#F69113"
            ></path>
          </svg>
        </div>
        <div class="p-2 flex justify-between text-sm">
          <div class="font-bold text-orange-600 whitespace-nowrap">
            <span>$</span>
            <span>${product.price}</span>
          </div>
          <div class="whitespace-nowrap">Stock ${product.stock}</div>
        </div>
      </a>
    </li>`;
  });
  suggestedProductListEl.innerHTML = suggestedProductListHTML;
}

//run app
renderCategories();
renderBigSaleProducts();
renderGoodRatingProducts();
renderSuggestedProducts();
