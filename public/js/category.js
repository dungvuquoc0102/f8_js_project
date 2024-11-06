import services from "./partials/services.js";
import renderHeaderAndFooter from "./partials/headerAndFooter.js";

//render header and footer
renderHeaderAndFooter();

//variables
let categoryFilter = location.search.split("category=")[1] || "all";
let brandFilter = "all";
let lowPriceFilter = null;
let highPriceFilter = null;
let sortFilter = null;
let searchFilter = location.search.split("search=")[1] || "";

//get element
const resultProductListEl = document.getElementById("result-product-list");
const categorySelectEl = document.getElementById("category");
const brandSelectEl = document.getElementById("brand");
const lowPricePriceInputEl = document.getElementById("low-price");
const highPricePriceInputEl = document.getElementById("high-price");
const sortPriceButtonEl = document.getElementById("sort-price-button");
const sortSelectEl = document.getElementById("sort");
const searchInputEl = document.getElementById("search");

//render product list, category select, brand select
async function renderProductList() {
  resultProductListEl.innerHTML = `
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  <li class="h-[214px] rounded-lg bg-gray-200"></li>
  `;
  let resultProductListHTML = ``;
  let result;
  //filter by category
  if (categoryFilter === "all") {
    result = await services.getProducts();
  } else {
    result = await services.getProductsByCategory(categoryFilter);
  }
  let { data } = result;
  let products = data.products;
  //filter by brand
  if (brandFilter !== "all") {
    products = products.filter((product) => product.brand === brandFilter);
  }
  //filter by price
  if (lowPriceFilter !== null && highPriceFilter !== null) {
    products = products.filter(
      (product) =>
        product.price >= lowPriceFilter && product.price <= highPriceFilter,
    );
  }
  //filter by sort
  switch (sortFilter) {
    case "asc-price":
      products.sort((a, b) => a.price - b.price);
      break;
    case "desc-price":
      products.sort((a, b) => b.price - a.price);
      break;
    case "asc-title":
      products.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "desc-title":
      products.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  //filter by search
  if (searchFilter !== "") {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(searchFilter.toLowerCase()),
    );
  }
  products = products.slice(0, 100);
  products.forEach((product) => {
    resultProductListHTML += `
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
    </li>
    `;
  });
  resultProductListEl.innerHTML = resultProductListHTML;
}
async function renderAndSetCategorySelect() {
  let categorySelectHTML = `<option value="all">All</option>`;
  const { data } = await services.getCategories();
  data.forEach((category) => {
    categorySelectHTML += `<option value="${category.slug}" ${category.slug === categoryFilter ? "selected" : ""}>${category.name}</option>`;
  });
  categorySelectEl.innerHTML = categorySelectHTML;
}
async function renderAndSetBrandSelect() {
  let brandSelectHTML = `<option value="all" ${brandFilter === "all" ? "selected" : ""}>All</option>`;
  let result;
  result = await services.getProducts();
  const { data } = result;
  data.products.forEach((product) => {
    if (
      !brandSelectHTML.includes(product.brand) &&
      product.brand !== undefined
    ) {
      brandSelectHTML += `<option value="${product.brand}" ${product.brand === brandFilter ? "selected" : ""}>${product.brand}</option>`;
    }
  });
  brandSelectEl.innerHTML = brandSelectHTML;
}
function renderSearchInput() {
  searchInputEl.value = searchFilter;
}

//event listener
categorySelectEl.addEventListener("change", async (e) => {
  categoryFilter = e.target.value;
  renderProductList();
});
brandSelectEl.addEventListener("change", (e) => {
  brandFilter = e.target.value;
  renderProductList();
});
lowPricePriceInputEl.addEventListener("input", (e) => {
  if (e.target.value === "" || isNaN(e.target.value) || e.target.value < 0) {
    lowPriceFilter = null;
  } else {
    lowPriceFilter = e.target.value;
    lowPricePriceInputEl.style.border = "1px solid #9ca3af";
  }
});
highPricePriceInputEl.addEventListener("input", (e) => {
  if (e.target.value === "" || isNaN(e.target.value) || e.target.value < 0) {
    highPriceFilter = null;
  } else {
    highPriceFilter = e.target.value;
    highPricePriceInputEl.style.border = "1px solid #9ca3af";
  }
});
sortPriceButtonEl.addEventListener("click", (e) => {
  if (
    lowPriceFilter !== null &&
    highPriceFilter !== null &&
    lowPriceFilter <= highPriceFilter
  ) {
    renderProductList();
  } else {
    if (lowPriceFilter === null) {
      lowPricePriceInputEl.style.border = "1px solid red";
    }
    if (highPriceFilter === null) {
      highPricePriceInputEl.style.border = "1px solid red";
    }
  }
});
sortSelectEl.addEventListener("change", (e) => {
  sortFilter = e.target.value;
  renderProductList();
});
searchInputEl.addEventListener("input", (e) => {
  searchFilter = e.target.value;
  renderProductList();
});

//run app
renderProductList();
renderAndSetCategorySelect();
renderAndSetBrandSelect();
renderSearchInput();
