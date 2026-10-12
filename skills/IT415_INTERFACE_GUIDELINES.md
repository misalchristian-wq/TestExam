---
name: it415-interface-guidelines
description: "Design and audit interaction behavior, form controls, labels, accessibility, and UI states for the IT415 Student Supplies Ordering System. Use for reviewing the five required sections, product/cart controls, payment form feedback, order summary legibility, receipt presentation, keyboard usability, and accessible error messaging. Preserve the practice exam workflow and avoid nonessential UI complexity."
---

# IT415 Interface Guidelines

## Goal and constraints

Deliver a **desktop-friendly or browser-based** ordering interface that makes all five PDF-required areas discoverable: Product List, Shopping Cart, Order Summary, Payment Section, and Receipt Section (Section III, Step 1). The PDF values function and clarity over elaborate visuals. Do not add an account, database, login wall, or extra checkout step as a prerequisite.

## Component-level interaction rules

| Component | Required content / behavior | Useful usability enhancement |
| --- | --- | --- |
| Product List | Six fixed product names and prices; one Add to Cart button each | Consistent button labels and obvious add confirmation |
| Cart line | Name, price, quantity, subtotal, +, -, Remove | Announce quantity/total changes, prevent accidental double click issues |
| Order Summary | Up-to-date sum of cart subtotals | Show number of items and visually emphasize amount due |
| Payment | Numeric amount paid, Confirm Payment, validation | Explicit label, input hint, appropriate keyboard/input mode |
| Receipt | Reference, optional datetime, lines, total, paid, change, success, reset | Monospaced/aligned amounts, readable print layout if requested |

## Required user states

Define and render the following states; never make the interface depend on assumptions about a previously completed transaction.

1. **Fresh start:** products visible; empty cart; total `₱0.00`; no error, payment, or receipt.
2. **Shopping:** one or more products in the cart; +, -, and Remove work; total updates immediately.
3. **Payment invalid:** distinguish empty, nonnumeric, negative, and insufficient payment with text near the input; retain cart for correction.
4. **Payment confirmed:** display sufficient amount, computed change, complete digital receipt, and confirmation message.
5. **Transaction reset:** clear cart, cash field, errors, and old receipt; return to fresh start.

## Accessibility and clarity (recommended quality controls)

- Use semantic `<button>` for actions, associated `<label>` for the cash amount, and headings for each of the five sections.
- Keep buttons operable by keyboard with visible focus indicators. Avoid click-only `<div>` controls.
- Label the quantity action with the product name where helpful (e.g., `Increase Ballpen quantity`) while keeping the visual `+`/`-` affordance.
- Keep readable contrast and font sizes; never encode error/success solely as red/green.
- Associate a cash validation message with its field, announce meaningful errors for assistive technology if practical, and move focus appropriately after a failed confirmation.
- Disable or guard Confirm Payment when a completed receipt should no longer be mutated. Explain the disabled state or show New Transaction prominently.
- Use peso currency consistently, two decimals, and aligned amounts; ensure large totals fit without clipping.
- Responsive adaptation for small screens is welcome but the teacher explicitly permits desktop-friendly, so do not make it block required desktop function.

## Content and microcopy rules

- Use short, specific labels: `Add to Cart`, `Remove`, `Confirm Payment`, `New Transaction`.
- Prefer actionable messages: `Enter the cash amount.`, `Enter a valid number.`, `Cash cannot be negative.`, `Cash is less than the total due.`
- Show receipt confirmation only after accepted cash; do not show a success status when the amount is missing or insufficient.
- Do not imply online card processing or inventory reservation; those features are outside the specified practice.

## UI verification walk-through

Run the application in its intended environment and perform this sequence: add Ballpen and Notebook -> increase Ballpen quantity -> decrease Notebook quantity -> remove an item -> enter empty payment -> enter invalid, negative, and insufficient payments -> pay sufficient cash -> inspect reference and receipt line math -> click New Transaction -> confirm the previous content disappears. Observe mouse and keyboard affordances. Record the exact point of failure if any.

## Response format

Summarize the affected screen/section, issue, impact on required tasks, recommended fix, whether the PDF mandates it or it is only a usability enhancement, and test evidence. Avoid changing cart/payment business logic as a side effect of interface cleanup.
