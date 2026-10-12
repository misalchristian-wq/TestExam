---
name: it415-system-testing
description: "Plan, execute, and report unit, integration, end-to-end, and manual QA tests for the IT415 Student Supplies Ordering System practical exam. Use when asked to test calculations, carts, invalid cash inputs, payment change, receipt completeness, reset flow, browser usability, final submission readiness, GitHub history, or AI use documentation. Base pass/fail claims on observed execution, not assumptions."
---

# IT415 System Testing

## Testing standard

Treat the attached practice PDF as the acceptance baseline. Its Section III, Step 6 lists **ten mandatory application tests**. Section VII adds receipt, reset, Git, and evidence checks. Testing tools and extra automation are optional; the app must work within the exam's 150-minute period.

## Preparation

1. Inspect the existing technology stack and run instructions; install only existing declared dependencies.
2. Start the app; record command, environment, and any startup errors.
3. Identify the cart calculation, validation, payment, receipt, and reset functions. Add focused unit tests where practical without overbuilding a test harness.
4. Execute the manual matrix below; treat T02-T04 as a sequential flow, and start T05 and T09 with the required fresh fixture. For automation use the tools actually available and report gaps.

## Mandatory test matrix (PDF Section III, Step 6)

| ID | Test action | Expected result |
| --- | --- | --- |
| T01 | Add one Ballpen | Ballpen appears; quantity 1; line subtotal `₱12.00` |
| T02 | Add Ballpen and Notebook | Both lines appear; total `₱47.00` |
| T03 | Increase Ballpen to 2, then decrease to 1 | Totals update `₱59.00` then `₱47.00` |
| T04 | Remove Notebook | Notebook line disappears; total updates to `₱12.00` |
| T05 | Mix Pencil x2, Yellow Pad x1, Eraser x1 | `₱20.00 + ₱45.00 + ₱8.00 = ₱73.00` |
| T06 | Confirm blank cash payment | Error; no success receipt |
| T07 | Confirm negative cash payment | Error; no success receipt |
| T08 | Confirm cash below total | Insufficient error; no success receipt |
| T09 | Pay `₱100.00` against `₱59.00` | Payment accepted; change exactly `₱41.00` |
| T10 | Complete payment and click New Transaction | Old cart, cash, validation, receipt cleared |

The examples above are concrete test fixtures for the corresponding teacher-mandated categories, not additional mandatory product combinations.

## Supplemental edge cases (recommended)

- Reject `abc`, whitespace, `NaN`, `Infinity`, or locale-mismatched malformed input; handle exactly equal cash as zero change.
- Check 1-item decrement behavior per implemented choice (removal or quantity floor with separate Remove), without any negative cart row.
- Add an existing product repeatedly and check one accurate line and correct quantity.
- Verify the receipt includes transaction reference, product names, units, quantities, subtotals, total, cash, change, success; date/time if available.
- Double-click Confirm Payment; confirm one coherent receipt and no stale content.
- Verify displayed price formatting (`₱`, two decimals) and direct initialization to an empty cart.
- Inspect keyboard input/focus and desktop layout for readability; responsive view is a bonus, not a source requirement.
- Check direct refresh behavior if the implementation relies on transient state; persistence is not specified and need not be added.

## Unit- and integration-test targets

Where framework support exists, isolate pure functions such as `addItem`, `increment`, `decrement`, `removeItem`, `calculateSubtotal`, `calculateTotal`, `validateCash`, `calculateChange`, and `startNewTransaction`. Assert currency values exactly (integer centavos or an exact-decimal representation). Add one integration test covering add -> total -> pay -> receipt -> reset. Do not introduce a complex testing framework only to satisfy an optional automation preference.

## Git and submission verification (PDF Sections IV-VII)

- Confirm a real Git repository and pushed GitHub commits. The PDF expects separate stages for initial setup, products/UI, cart/computation, payment/receipt, and debugging/improvement; do not fabricate commit history or force rewrite of history.
- Ensure README describes the application, features, and how to run it.
- Confirm **at least two** documented AI interactions, each listing exact prompt, purpose, AI response, evaluation with reason, and modifications made.
- Capture screenshots showing product list, populated cart, payment validation, receipt, and GitHub repository + commit history.
- Do not treat a local commit as uploaded until verified on GitHub.

## Test report contract

Report each test as `PASS`, `FAIL`, `BLOCKED`, or `NOT RUN`, with actual observed output, command/browser used, and evidence path if available. Include defects ranked by effect on mandatory tasks; propose minimal fixes; rerun affected tests. Finish with the PDF final-checklist requirements annotated `met`, `not met`, or `unverified`. Never claim all tests pass without running them.
