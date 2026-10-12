const productButtons = document.querySelectorAll(".add-button");
const cartItems = document.getElementById("cart-items");
const orderTotal = document.getElementById("order-total");
const paymentForm = document.getElementById("payment-form");
const cashInput = document.getElementById("cash-amount");
const paymentMessage = document.getElementById("payment-message");
const paymentResult = document.getElementById("payment-result");
const paymentChange = document.getElementById("payment-change");
const confirmPaymentButton = document.getElementById("confirm-payment");
const receiptContent = document.getElementById("receipt-content");
const newTransactionButton = document.getElementById("new-transaction");

// Prices stay in integer centavos so every subtotal and total is exact.
const products = new Map();
const cart = new Map();
let confirmedPayment = null;
let transactionSequence = 0;

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
  clearPaymentFeedback();
}

function clearPaymentFeedback() {
  confirmedPayment = null;
  paymentMessage.textContent = "";
  cashInput.setAttribute("aria-invalid", "false");
  paymentResult.hidden = true;
}

function showPaymentError(message) {
  confirmedPayment = null;
  paymentMessage.textContent = message;
  cashInput.setAttribute("aria-invalid", "true");
  paymentResult.hidden = true;
}

function makeReceiptSnapshot() {
  const date = new Date();
  const items = Array.from(cart, ([productId, quantity]) => {
    const product = products.get(productId);
    return {
      name: product.name,
      quantity,
      priceCents: product.priceCents,
      subtotalCents: product.priceCents * quantity,
    };
  });

  // Copy the paid order so the receipt cannot change with later cart state.
  return {
    reference: `SS-${date.getTime()}-${++transactionSequence}`,
    dateTime: date.toLocaleString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit",
    }),
    items,
    totalCents: getTotalCents(),
    amountPaidCents: confirmedPayment.amountPaidCents,
    changeCents: confirmedPayment.changeCents,
  };
}

function makeReceiptMeta(label, value) {
  const line = makeElement("p", "receipt-meta-line");
  line.append(makeElement("span", "", label), makeElement("strong", "", value));
  return line;
}

function makeReceiptAmount(label, cents, extraClass = "") {
  const line = makeElement("div", `receipt-amount-row ${extraClass}`.trim());
  line.append(makeElement("span", "", label), makeElement("strong", "", formatPesos(cents)));
  return line;
}

function renderReceipt(receipt) {
  const meta = makeElement("div", "receipt-meta");
  meta.append(
    makeReceiptMeta("Transaction Reference", receipt.reference),
    makeReceiptMeta("Date and Time", receipt.dateTime)
  );

  const table = makeElement("table", "receipt-table");
  table.append(makeElement("caption", "receipt-table-caption", "Purchased Products"));
  const tableHead = makeElement("thead", "");
  const headingRow = makeElement("tr", "");
  ["Product", "Qty", "Unit Price", "Subtotal"].forEach((label) => {
    const heading = makeElement("th", "", label);
    heading.scope = "col";
    headingRow.append(heading);
  });
  tableHead.append(headingRow);

  const tableBody = makeElement("tbody", "");
  receipt.items.forEach((item) => {
    const row = makeElement("tr", "");
    row.append(
      makeElement("td", "", item.name),
      makeElement("td", "receipt-quantity", String(item.quantity)),
      makeElement("td", "receipt-amount", formatPesos(item.priceCents)),
      makeElement("td", "receipt-amount", formatPesos(item.subtotalCents))
    );
    tableBody.append(row);
  });
  table.append(tableHead, tableBody);
  const tableWrap = makeElement("div", "receipt-table-wrap");
  tableWrap.append(table);

  const amounts = makeElement("div", "receipt-amounts");
  amounts.append(
    makeReceiptAmount("Total Amount", receipt.totalCents),
    makeReceiptAmount("Amount Paid", receipt.amountPaidCents),
    makeReceiptAmount("Change", receipt.changeCents, "receipt-change")
  );

  receiptContent.className = "receipt";
  receiptContent.replaceChildren(
    meta,
    tableWrap,
    amounts,
    makeElement("p", "receipt-confirmation", "Payment confirmed. Thank you for your purchase.")
  );
  newTransactionButton.hidden = false;
}

function setTransactionLocked(locked) {
  productButtons.forEach((button) => { button.disabled = locked; });
  cartItems.querySelectorAll("button[data-action]").forEach((button) => { button.disabled = locked; });
  cashInput.disabled = locked;
  confirmPaymentButton.disabled = locked;
}

document.getElementById("product-list").addEventListener("click", (event) => {
  if (confirmedPayment) return;
  const button = event.target.closest(".add-button");
  if (!button) return;

  const productId = button.dataset.productId;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
});

cartItems.addEventListener("click", (event) => {
  if (confirmedPayment) return;
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

cashInput.addEventListener("input", () => {
  if (!confirmedPayment) clearPaymentFeedback();
});

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (confirmedPayment) return;
  const rawAmount = cashInput.value.trim();

  if (cashInput.validity.badInput) {
    showPaymentError("Enter a valid number.");
    return;
  }
  if (rawAmount === "") {
    showPaymentError("Enter the cash amount.");
    return;
  }

  const amountPaid = Number(rawAmount);
  if (!Number.isFinite(amountPaid)) {
    showPaymentError("Enter a valid number.");
    return;
  }
  if (amountPaid < 0) {
    showPaymentError("Cash cannot be negative.");
    return;
  }

  // Round to centavos only after checking that the amount has centavo precision.
  const amountPaidCents = Math.round(amountPaid * 100);
  if (!Number.isSafeInteger(amountPaidCents) || Math.abs(amountPaid * 100 - amountPaidCents) > 1e-7) {
    showPaymentError("Enter a cash amount with up to two decimal places.");
    return;
  }
  if (cart.size === 0) {
    showPaymentError("Add an item to your cart before paying.");
    return;
  }

  const totalCents = getTotalCents();
  if (amountPaidCents < totalCents) {
    showPaymentError("Cash is less than the total due.");
    return;
  }

  confirmedPayment = {
    amountPaidCents,
    changeCents: amountPaidCents - totalCents,
  };
  paymentMessage.textContent = "";
  cashInput.setAttribute("aria-invalid", "false");
  paymentChange.textContent = formatPesos(confirmedPayment.changeCents);
  paymentResult.hidden = false;
  renderReceipt(makeReceiptSnapshot());
  setTransactionLocked(true);
});

newTransactionButton.addEventListener("click", () => {
  cart.clear();
  cashInput.value = "";
  paymentChange.textContent = formatPesos(0);
  setTransactionLocked(false);
  renderCart();
  receiptContent.className = "empty-state";
  receiptContent.replaceChildren(makeElement("p", "", "Your receipt will appear here after payment."));
  newTransactionButton.hidden = true;
});
