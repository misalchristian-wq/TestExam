const productButtons = document.querySelectorAll(".add-button");
const cartItems = document.getElementById("cart-items");
const orderTotal = document.getElementById("order-total");

// Prices stay in integer centavos so every subtotal and total is exact.
const products = new Map();
const cart = new Map();

productButtons.forEach((button) => {
  const productCard = button.closest(".product-card");
  products.set(button.dataset.productId, {
    name: productCard.querySelector("h3").textContent.trim(),
    priceCents: Number(button.dataset.priceCents),
  });
  button.disabled = false;
});

function formatPesos(cents) {
  return `₱${(cents / 100).toFixed(2)}`;
}

function getTotalCents() {
  let total = 0;
  cart.forEach((quantity, productId) => {
    total += products.get(productId).priceCents * quantity;
  });
  return total;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeActionButton(text, className, action, productId, label) {
  const button = makeElement("button", className, text);
  button.type = "button";
  button.dataset.action = action;
  button.dataset.productId = productId;
  button.setAttribute("aria-label", label);
  return button;
}

function makeCartItem(productId, quantity) {
  const product = products.get(productId);
  const item = makeElement("article", "cart-item");
  const header = makeElement("div", "cart-item-header");
  header.append(
    makeElement("h3", "", product.name),
    makeActionButton("Remove", "remove-button", "remove", productId, `Remove ${product.name} from cart`)
  );

  const details = makeElement("div", "cart-item-details");
  const unitPrice = makeElement("div", "cart-field");
  unitPrice.append(
    makeElement("span", "cart-field-label", "Unit price"),
    makeElement("span", "cart-field-value", formatPesos(product.priceCents))
  );

  const quantityField = makeElement("div", "cart-field quantity-field");
  const controls = makeElement("div", "quantity-controls");
  const decrease = makeActionButton("−", "quantity-button", "decrease", productId, `Decrease ${product.name} quantity`);
  decrease.disabled = quantity === 1;
  controls.append(
    decrease,
    makeElement("span", "", String(quantity)),
    makeActionButton("+", "quantity-button", "increase", productId, `Increase ${product.name} quantity`)
  );
  quantityField.append(makeElement("span", "cart-field-label", "Quantity"), controls);

  const subtotal = makeElement("div", "cart-field");
  subtotal.append(
    makeElement("span", "cart-field-label", "Subtotal"),
    makeElement("span", "cart-field-value", formatPesos(product.priceCents * quantity))
  );

  details.append(unitPrice, quantityField, subtotal);
  item.append(header, details);
  return item;
}

// Rebuild the cart and total from current quantities after every change.
function renderCart() {
  if (cart.size === 0) {
    cartItems.className = "empty-state";
    cartItems.replaceChildren(makeElement("p", "", "Your cart is empty."));
  } else {
    cartItems.className = "cart-list";
    const items = document.createDocumentFragment();
    cart.forEach((quantity, productId) => {
      items.append(makeCartItem(productId, quantity));
    });
    cartItems.replaceChildren(items);
  }
  orderTotal.textContent = formatPesos(getTotalCents());
}

document.getElementById("product-list").addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;

  const productId = button.dataset.productId;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const productId = button.dataset.productId;
  const quantity = cart.get(productId);
  if (!quantity) return;

  if (button.dataset.action === "remove") {
    cart.delete(productId);
  } else if (button.dataset.action === "increase") {
    cart.set(productId, quantity + 1);
  } else if (button.dataset.action === "decrease" && quantity > 1) {
    cart.set(productId, quantity - 1);
  }
  renderCart();
});
