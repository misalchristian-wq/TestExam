---
name: it415-system-security
description: "Review, implement, and harden security for the IT415 Student Supplies Ordering System, a small browser-based or desktop-friendly cash-only school supplies checkout. Use for input validation, injection protection, dependency safety, defensive cart and payment state, data minimization, or a focused security audit. Keep recommendations proportionate to the practice exam; authentication and a database are not required."
---

# IT415 System Security

## Governing scope

Implement security for the **Student Supplies Ordering System**, not a generic banking or e-commerce platform. The PDF requires a local product catalog, shopping cart, numeric cash payment, and digital receipt. **A database and user authentication are explicitly not required.** Do not add accounts, roles, servers, card processing, OTP, or cloud services solely for this exercise. Do not compromise the 150-minute exam's working-app priority.

## Review procedure

1. Read the existing stack and entry points. Identify where catalog prices, cart quantities, totals, payment input, receipt content, and transaction state are created or mutated.
2. Build a minimal trust map: catalog is the source of truth; user-entered quantities and cash are untrusted; total and change are always computed values, never user-supplied values.
3. Implement the controls below using the existing framework's idioms. Avoid unnecessary packages and infrastructure.
4. Test both normal behavior and malicious or malformed inputs. Report observed results separately from unexecuted recommendations.

## Required-by-PDF protections

- Reject an empty payment input, invalid number, negative amount, and amount below the total. Communicate the reason rather than silently failing (PDF Section III, Step 4).
- Keep quantity positive while an item remains in the cart; when decrementing from one, either remove the item or retain one and offer a working separate Remove action (Section III, Step 3).
- Recompute all subtotals and totals from the six trusted catalog prices and current quantities. Never accept an editable subtotal or client-entered total as authoritative.
- Generate a receipt **only after successful validation and confirmed cash payment**. Include reference, products, units, quantities, subtotals, total, cash, change, and confirmation (Section III, Step 5).
- On New Transaction, clear the cart, cash input, validation feedback, and displayed receipt together.

## Recommended security enhancements (not exam requirements)

- **Strict numeric conversion:** reject `NaN`, infinite values, unsupported characters, empty whitespace, negative payments, and excessive decimal places. Use integer centavos or exact decimal arithmetic for money. Reject overlarge numbers that cannot be represented safely.
- **Safe cart updates:** resolve products from a hard-coded ID-to-price catalog; reject unknown IDs, fractions, zero/negative quantities stored as active items, and quantities beyond a reasonable limit. Do not trust text fields or URL parameters to assign prices.
- **Output safety:** render customer-controlled strings through framework text interpolation or text content. Avoid assigning uncontrolled values to HTML injection sinks such as `innerHTML`; never evaluate user input as JavaScript.
- **Transaction integrity:** stop repeated confirmation from generating duplicate receipts or altering a completed receipt. Freeze or snapshot receipt line items after payment and require New Transaction before editing a new order.
- **Dependency hygiene:** use existing installed packages if adequate; inspect package scripts and dependencies, keep lockfiles tracked, avoid embedding secrets, and do not commit `.env` files with credentials. This simple system should not need API keys.
- **Privacy:** do not request names, student IDs, phone numbers, or payment-card information to conduct a cash transaction. Keep receipts free of unnecessary personal information.

## Security-focused acceptance checks

| Input / action | Expected result |
| --- | --- |
| Empty or whitespace-only payment | Visible required-field error; no receipt |
| `abc`, `NaN`, `Infinity` or malformed numeric string | Invalid amount error; no receipt |
| Negative cash amount | Negative amount rejected; no receipt |
| Payment `58.99` for a `59.00` order | Insufficient payment error |
| Payment `100.00` for a `59.00` order | Change of `41.00`; one confirmed receipt |
| Repeated Confirm Payment after success | No duplicate confirmation or stale receipt mutation |
| Unknown product ID / manipulated unit price | Ignore or reject; use catalog as source of truth |
| New Transaction | No previous receipt, stale error, or prior cash value |

## Security review output

Return (1) verified controls, (2) vulnerabilities with severity and exact code locations, (3) minimal patches, (4) tests executed and outcomes, and (5) remaining risks. Distinguish **PDF-mandated** controls from **additional best practices**. Never call a feature secure without inspection or testing.
