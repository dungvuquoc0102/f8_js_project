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
  productDiscount = +cart
    .reduce((total, item) => {
      return (
        total + (item.price * item.quantity * item.discountPercentage) / 100
      );
    }, 0)
    .toFixed(2);
  shippingFee = 0;
  totalAmount = +(subTotal - productDiscount + shippingFee).toFixed(2);
}
function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id);
  if (item.quantity > 1) {
    item.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart) || []);
    calcCartTotal();
    renderCartTotal();
    renderCartItemList();
  }
}

//get elements
const cartTotalEl = document.getElementById("cart-total-detail");
const cartItemListEl = document.getElementById("cart-item-list");

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
  // const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemListEl.innerHTML = cart
    .map(
      (item) => `
    <tr class="text-center">
      <td class="max-w-[200px] py-2">
        <a href="product-detail.html?id=${item.id}" class="flex items-center">
          <img
            class="h-16 w-16 rounded-lg object-cover"
            src="${item.thumbnail}"
            alt="product"
          />
          <div class="ml-3">
            <p class="line-clamp-2 text-left text-sm font-bold">
              ${item.title}
            </p>
            <p class="text-left text-xs text-gray-400">${item.category}</p>
          </div>
        </a>
      </td>
      <td class="py-2">
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
            class="flex h-[38px] w-[38px] items-center justify-center rounded-lg"
            id="decrease-quantity"
            data-id="${item.id}"
            onclick="decreaseQuantity(${item.id})"
          >
            <i class="fa-solid fa-minus text-gray-500"></i>
          </button>
          <input
            class="h-[38px] w-[60px] border-x-[1px] border-gray-300 text-center outline-none"
            type="text"
            value="${item.quantity}"
            id="quantity"
            disabled
            data-id="${item.id}"
          />
          <button
            class="flex h-[38px] w-[38px] items-center justify-center rounded-lg"
            id="increase-quantity"
            data-id="${item.id}"
          >
            <i class="fa-solid fa-plus text-gray-500"></i>
          </button>
        </div>
      </td>
      <td class="py-2">
        <!-- total -->
        <span class="text-orange-500" id="item-total" data-id="${item.id}">$${(+((item.price * (100 - item.discountPercentage)) / 100).toFixed(2) * item.quantity).toFixed(2)}</span>
      </td>
      <td class="py-2">
        <button
          class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
          id="delete-item"
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
}

//run app
calcCartTotal();
renderCartTotal();
renderCartItemList();
