import renderHeaderAndFooter from "./partials/headerAndFooter.js";

//render header and footer
renderHeaderAndFooter();

//variables
let cart, subTotal, productDiscount, shippingFee, totalAmount;

//functions
function calcCartTotal() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  subTotal = +cart
    .reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0)
    .toFixed(2);
  shippingFee = 0;
  totalAmount =
    +cart
      .reduce((total, item) => {
        return (
          total +
          +(
            +((item.price * (100 - item.discountPercentage)) / 100).toFixed(2) *
            item.quantity
          ).toFixed(2)
        );
      }, 0)
      .toFixed(2) + shippingFee;
  productDiscount = +(subTotal - totalAmount).toFixed(2);
}
function cartDecreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item.quantity > 1) {
    item.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart) || []);
    calcCartTotal();
    renderCartTotal();
    renderCartItemList();
  }
}
function cartIncreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item.quantity < item.stock) {
    item.quantity++;
    localStorage.setItem("cart", JSON.stringify(cart) || []);
    calcCartTotal();
    renderCartTotal();
    renderCartItemList();
  }
}

//get elements
const cartTotalEl = document.getElementById("cart-total-detail");
const cartItemListEl = document.getElementById("cart-item-list");
const searchInputEl = document.getElementById("search");

//render
function renderCartTotal() {
  cartTotalEl.innerHTML = `
    <h1 class="mb-3 text-2xl text-orange-500">Cart Detail</h1>
      <div class="flex justify-between">
        <p>Subtotal</p>
        <p>$${subTotal}</p>
      </div>
      <div class="flex justify-between">
        <p>Product Discount</p>
        <p>$${productDiscount}</p>
      </div>
      <div class="flex justify-between">
        <p>Shipping</p>
        <p>${shippingFee === 0 ? "Free" : "$" + shippingFee}</p>
      </div>
      <div class="flex justify-between">
        <p>Total Amount</p>
        <p>$${totalAmount}</p>
      </div>
      <div class="mt-2 text-right">
        <button
          class="hidden rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-500"
        >
          Checkout
        </button>
      </div>
  `;
}
function renderCartItemList() {
  if (cart.length === 0) {
    cartItemListEl.innerHTML = `
    <tr>
      <td colspan="5" class="text-center pt-4 text-gray-400">No items in cart</td>
    </tr>
    `;
    return;
  }
  cartItemListEl.innerHTML = cart
    .map(
      (item) => `
    <tr class="text-center">
      <td class="max-w-[200px] py-2">
        <a href="product-detail.html?id=${item.id}" class="flex items-center">
          <img
            class="w-32 aspect-square rounded-lg object-cover"
            src="${item.thumbnail}"
            alt="product"
          />
          <div class="ml-3 flex flex-col gap-2">
            <p class="line-clamp-2 text-left font-bold">
              ${item.title}
            </p>
            <p class="text-left text-xs text-gray-400">${item.category}</p>
            <p class="text-left md:hidden">
              <!-- old price -->
              <span class="text-sm text-gray-400 line-through">$${item.price}</span>
              <!-- new price -->
              <span>$${((item.price * (100 - item.discountPercentage)) / 100).toFixed(2)}</span>
            </p>
          </div>
        </a>
      </td>
      <td class="py-2 hidden md:table-cell">
        <!-- old price -->
        <span class="text-sm text-gray-400 line-through">$${item.price}</span>
        <!-- new price -->
        <span>$${((item.price * (100 - item.discountPercentage)) / 100).toFixed(2)}</span>
      </td>
      <td class="">
        <!-- quantity -->
        <div
          class="mx-auto flex w-fit items-center rounded-md border-[1px] border-gray-300"
        >
          <button
            class="flex h-[38px] w-[38px] items-center justify-center rounded-lg decrease-quantity-btn ${+item.quantity === 1 ? "opacity-50" : ""}"
            data-id="${item.id}"
            ${item.quantity === 1 ? "disabled" : ""}
          >
            <i class="fa-solid fa-minus text-gray-500"></i>
          </button>
          <input
            class="h-[38px] w-[60px] border-x-[1px] border-gray-300 text-center outline-none"
            type="text"
            value="${item.quantity}"
            disabled
          />
          <button
            class="flex h-[38px] w-[38px] items-center justify-center rounded-lg increase-quantity-btn ${+item.quantity === item.stock ? "opacity-50" : ""}"
            data-id="${item.id}"
            ${item.quantity === item.stock ? "disabled" : ""}
          >
            <i class="fa-solid fa-plus text-gray-500"></i>
          </button>
        </div>
      </td>
      <td class="py-2 hidden md:table-cell">
        <!-- total -->
        <span class="text-orange-500">$${(+((item.price * (100 - item.discountPercentage)) / 100).toFixed(2) * item.quantity).toFixed(2)}</span>
      </td>
      <td class="py-2">
        <button
          class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500 delete-item-btn"
          data-id="${item.id}"
        >
          Delete
        </button>
      </td>
    </tr>
    </div>
  `,
    )
    .join("");

  //get elements
  const decreaseQuantityBtns = document.querySelectorAll(
    ".decrease-quantity-btn",
  );
  const increaseQuantityBtns = document.querySelectorAll(
    ".increase-quantity-btn",
  );
  const deleteItemBtns = document.querySelectorAll(".delete-item-btn");

  //add event listeners
  decreaseQuantityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cartDecreaseQuantity(+btn.dataset.id);
    });
  });
  increaseQuantityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cartIncreaseQuantity(+btn.dataset.id);
    });
  });
  deleteItemBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cart = cart.filter((item) => item.id !== +btn.dataset.id);
      localStorage.setItem("cart", JSON.stringify(cart) || []);
      calcCartTotal();
      renderCartTotal();
      renderCartItemList();
      renderHeaderAndFooter();
    });
  });
}

//event listeners
searchInputEl.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const search = searchInputEl.value;
    if (search) {
      window.location.href = `category.html?search=${search}`;
    }
  }
});

//run app
calcCartTotal();
renderCartTotal();
renderCartItemList();
