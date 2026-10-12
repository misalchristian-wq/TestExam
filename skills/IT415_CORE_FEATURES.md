---
name: it415-core-features
description: Implement and verify the mandatory business features for the IT415 Student Supplies Ordering System practical exam: six fixed products, add-to-cart, quantity controls, remove, item subtotals, total, cash validation, change, digital receipt, and New Transaction reset. Use for feature development, requirement mapping, implementing cart and checkout, refactoring transaction state, or verifying conformance to the uploaded practice instructions.
---

# IT415 Core System Features

## Source of truth and priority

The uploaded **IT415 MIDTERM PRACTICAL PRACTICE - Student Supplies Ordering System** governs this skill. Build a browser-based or desktop-friendly application; use any framework/language discussed in class. Name the project/repository `StudentSuppliesOrderingSystem`. A database and user authentication are **not required**. Prefer a small working implementation under the 150-minute assessment constraint.

## Exact catalog (PDF Section II)

| Product | Unit price (PHP) | Optional integer-centavo representation |
| --- | ---: | ---: |
| Ballpen | ₱12.00 | 1200 |
| Pencil | ₱10.00 | 1000 |
| Notebook | ₱35.00 | 3500 |
| Yellow Pad | ₱45.00 | 4500 |
| Eraser | ₱8.00 | 800 |
| Ruler | ₱15.00 | 1500 |

Render **all six**. The checklist's wording 'at least five products' is a minimum check, whereas Step 2 explicitly says six; implement six to satisfy both. Keep catalog data hard-coded unless the user expressly requests an optional extension.

## Required feature contract

### 1. Start-up and layout (Section III, Step 1)

- Run the project successfully and expose Product List, Shopping Cart, Order Summary, Payment Section, and Receipt Section.
- Show all products with readable names/prices and an Add to Cart control.

### 2. Cart lifecycle (Section III, Steps 2-3)

- Add a product; adding the same product again increases its quantity instead of creating ambiguous duplicate lines.
- For each cart line, show name, unit price, quantity, subtotal, increase, decrease, and remove controls.
- Do not retain a zero or negative quantity. On decrement from one, either remove the item or keep one with a separate functioning Remove button; choose one consistent interaction and document it.
- Recompute item subtotal = `unit price × quantity` and total = `sum of item subtotals` on every cart change.
- Keep the empty-cart state understandable; the summary must not show an old total.

### 3. Cash payment (Section III, Step 4)

- Provide a numeric cash amount field and Confirm Payment action.
- Distinguish blank, not-a-number, negative, and insufficient payments with clear validation messages.
- After sufficient payment calculate `change = cash paid − total due`.
- Recommended safeguard: disallow confirming an empty cart, even if `0` PHP is entered. This is sensible behavior but not stated explicitly in the PDF.

### 4. Receipt and reset (Section III, Step 5)

- After successful payment, display: transaction reference number; date/time **if available**; purchased product names; quantities; unit prices; subtotals; total; cash paid; change; and confirmation message.
- Keep the receipt as a snapshot of the confirmed transaction. Recommended: prevent cart edits from silently changing a paid receipt; require New Transaction to start another order.
- New Transaction clears **cart, entered cash amount, validation messages, and receipt**. Clear or recalculate totals and confirmation state as needed.

## Implementation sequence

1. Inspect current files and preserve a simple stack; create the runnable application if absent.
2. Add catalog and render the five sections with an empty cart.
3. Implement pure cart/total helpers and wire each button.
4. Implement payment input validation and change computation.
5. Implement receipt snapshot, reference ID, confirmation state, and full reset.
6. Verify each stage before improving appearance.

Use integer centavos or suitable decimal handling when practical; format `₱` with two decimal places at display boundaries. Avoid rounding drift and duplicated source-of-truth totals.

## Git, AI, and submission obligations (Sections IV-VI)

- Make progressive Git commits and push them to GitHub; do not upload the entire project only once at the end. The PDF suggests initial project setup, product interface, cart/calculations, payment/receipt, then bug fixes, with distinct descriptive commit messages.
- Use AI assistance **at least twice** and document **exact prompt, purpose, AI response summary/screenshot, evaluation (correct/partial/incorrect with reason), and modifications made**. Test AI-generated code and be ready to explain it.
- Include a concise README with app features and run instructions; capture screenshots of product list, cart, payment validation, receipt, and GitHub repository/commit history.

## Acceptance example

Ballpen x2 -> `₱24.00`; Notebook x1 -> `₱35.00`; total -> `₱59.00`; cash `₱100.00` -> change `₱41.00`. Removing Notebook updates total to `₱24.00`. After successful checkout, New Transaction returns cart, payment, validation, and receipt to initial states.

## Completion reporting

Return a traceability table marking each PDF feature as **implemented / partially implemented / missing / not tested**, plus changed files and actual test results. Do not claim completion based only on code generation.
