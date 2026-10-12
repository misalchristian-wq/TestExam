---
name: it415-error-handling
description: "Implement predictable error handling and debug failure states in the IT415 Student Supplies Ordering System. Use for missing or invalid payments, negative/insufficient cash, empty cart operations, illegal quantities, receipt or reset defects, startup failures, and user-visible feedback. Favor precise validation, safe state transitions, fast fault isolation, and minimal fixes that protect the teacher-required checkout flow."
---

# IT415 Error Handling

## Error-handling goal

Make the mandatory school supplies ordering journey recoverable without misleading success messages. The teacher explicitly requires visible errors for **empty**, **invalid number**, **negative**, and **insufficient** cash payments (PDF Section III, Step 4), and asks students to debug issues before submission (Sections III, IV). Avoid adding backend error frameworks to a no-database, no-auth practice app.

## Payment validation precedence

Process cash submission in a deterministic order:

1. Inspect raw input before converting. If absent or only whitespace, show `Enter the cash amount.`
2. Parse strictly as a finite numeric amount. If malformed or non-finite, show `Enter a valid cash amount.`
3. If negative, show `Cash amount cannot be negative.`
4. Normalize currency safely to two decimal places or integer centavos. If unsupported precision/size is entered, show a specific amount-format error.
5. Obtain the current computed cart total; recommended: block checkout of an empty cart with `Add an item before confirming payment.` (this extra rule is not expressly required by PDF).
6. If cash is below total, show `Insufficient payment. Enter at least ₱X.XX.`
7. Only on valid sufficient payment compute change and create the confirmed receipt. Clear any earlier error.

Do not use logic such as `if (!Number(input))` to detect an empty field: it incorrectly rejects valid zero and conflates missing with invalid input.

## Cart and state failure rules

- If the user tries to decrement quantity one, either remove the product or keep the quantity at one with a working Remove control; never store a negative value.
- If the item identifier is unknown, ignore the update safely or show a concise failure without corrupting cart state. Prices always come from the fixed product catalog.
- After cart edits, recompute totals immediately and re-evaluate or clear any stale insufficient-payment message so it does not contradict the current total.
- After successful payment, prevent later cart changes from quietly modifying the already-issued receipt. Require New Transaction or make receipt data immutable.
- A New Transaction resets cart, amount entered, errors, success flag, receipt, and computed UI state in one logical operation.
- A receipt render failure should not claim a completed visible receipt; preserve accurate status and offer an explicit recovery path.

## Error display rules

- Show concise inline text adjacent to the relevant field or control. Do not rely only on a browser alert, console, or color.
- Preserve non-sensitive input while the user corrects it, except when starting a new transaction.
- Mark error state semantically where supported and preserve keyboard access; consider `aria-invalid`, `aria-describedby`, and live error announcements for a browser UI.
- Keep engineering details (stack traces, internal exceptions, package paths) out of customer-facing messages; use the developer console while debugging.
- Disable or guard repeated submission during transition into a confirmed transaction.

## Debugging workflow

1. **Reproduce** using a small exact scenario, recording catalog, quantity, cash input, action, and observed result.
2. **Localize** to input parsing, cart mutation, derived total, payment validation, receipt snapshot, state reset, or display formatting.
3. **Inspect** the real execution path and state; do not guess based only on the symptom.
4. **Patch minimally**. Preserve product prices and the behavior already working. Avoid unrelated refactors before the exam.
5. **Retest** the failed case plus a successful payment, empty payment, quantity update, and New Transaction.
6. **Record** the problem, root cause if established, code changed, before/after behavior, and test results. Commit meaningful fixes as part of the PDF-required progress history.

## Common defect checklist

| Symptom | Likely cause to investigate | Verification |
| --- | --- | --- |
| Blank cash treated as zero | Implicit coercion before emptiness check | Blank -> error, no receipt |
| `abc` produces `NaN` change | Missing finite-number check | Invalid text -> error |
| Total remains stale after Remove | Mutated state or missing recomputation | Remove -> immediate total update |
| `-` shows quantity `0` | Missing boundary/removal behavior | Decrement one -> valid remove/floor |
| Cash equal to total rejected | `>` used instead of `>=` | Exact payment -> change `₱0.00` |
| Receipt changes after checkout | Rendering live cart instead of transaction snapshot | Confirm -> cart changes cannot rewrite receipt |
| Old validation persists on new order | Incomplete reset | New Transaction -> all prior state cleared |
| Button seems broken | Event handler, disabled-state, or runtime error | Verify click, console, and intended transition |

## Response contract

For each issue, return severity, reproduction steps, root cause or clearly labeled hypothesis, minimal fix, evidence of tests run, and remaining uncertainty. Keep teacher-required errors separate from recommended safeguards. Never mark an unexecuted fix as confirmed.
