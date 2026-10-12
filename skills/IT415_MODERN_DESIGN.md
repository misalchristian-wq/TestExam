---
name: it415-modern-design
description: "Create or refine a polished, simple, contemporary visual design for the IT415 Student Supplies Ordering System. Use when asked to modernize appearance, establish visual hierarchy, choose typography/colors, style product cards, improve responsiveness, or remove interface clutter. Preserve the five required interface sections and prioritize fast, reliable school-supply checkout over optional animations or complicated design systems."
---

# IT415 Modern Design

## Design objective

Design a trustworthy, modern interface for a **small campus school-supplies shop**. The PDF explicitly requires a working application before advanced styling (Sections I and VII). Keep the first usable implementation simple. Treat animated effects, elaborate dashboards, theme engines, and nonessential imagery as optional only after functionality is fully validated.

## Required information architecture

Preserve these five recognizable sections exactly as functional concepts (Section III, Step 1):

1. **Product List**: all six hard-coded supplies and prices; each with Add to Cart.
2. **Shopping Cart**: chosen products, quantity controls, item subtotals, and Remove.
3. **Order Summary**: clear total recalculated on cart changes.
4. **Payment Section**: cash amount field, Confirm Payment, and inline validation.
5. **Receipt Section**: full receipt shown after successful confirmation, with New Transaction.

Never sacrifice visibility of quantity buttons, error messages, amount due, or receipt data for decoration.

## Visual design system (recommendations, not PDF mandates)

- **Tone:** clean, campus-friendly, professional retail utility; avoid unrelated food imagery, excessive gradients, glowing elements, and playful distractions.
- **Color:** use a calm light neutral canvas, high-contrast near-black body text, one restrained primary accent, and reserved semantic colors for errors and success. Choose a compact palette and ensure contrast.
- **Typography:** readable system or already-available sans serif; use no more than two complementary families. Establish clear scales for page title, section headings, product names, prices, and supporting labels.
- **Spacing:** use consistent 4/8/12/16/24 px increments; align buttons, card edges, currency amounts, and section headings. Avoid overly dense product tiles.
- **Components:** subtle borders, modest radius, restrained shadow, consistent focus outline, clear disabled states, and appropriately large clickable targets.
- **Product display:** simple product cards or rows with product name, peso price, and Add to Cart. Product images are optional and must not displace required content or require a network connection.
- **Transaction emphasis:** make the total due and change visually prominent; keep receipt formatting closer to an authentic register slip than a marketing card.

## Suggested desktop composition

Use a header with the app name and a concise shopping subtitle; below, a two-column workspace for wider screens: Product List on the larger left side, Shopping Cart + Order Summary + Payment on the right. Place the Receipt below or display it clearly after payment. Ensure the five sections are easy to locate even if some are initially empty. On narrow viewports, stack in a predictable order; responsive behavior is recommended, not an explicit PDF criterion.

## Workflow

1. Inspect existing functionality and identify the current component and CSS approach.
2. Keep the same business logic; refactor visuals without silently changing prices or behavior.
3. Apply visual hierarchy to all six listed products: Ballpen `₱12.00`, Pencil `₱10.00`, Notebook `₱35.00`, Yellow Pad `₱45.00`, Eraser `₱8.00`, Ruler `₱15.00`.
4. Implement distinct UI states: empty cart, cart populated, invalid payment, sufficient payment, receipt displayed, new transaction reset.
5. Check the complete flow at desktop resolution; if practical also check a narrow window. Ensure usable keyboard focus, labels, and readable text.
6. Run available tests and a build after changing styles. Reject purely cosmetic changes that break checkout.

## Visual QA checklist

- All six names and prices are accurate, visible, and legible.
- Add to Cart, +/- controls, Remove, Confirm Payment, and New Transaction remain prominent and interactive.
- The payable total uses `₱` and exactly two decimal places.
- Validation messages appear next to the cash field and do not shift controls unpredictably.
- Disabled buttons and receipt-success states are understandable without relying on color alone.
- No text clipping, horizontal page overflow, or overlapping cards at intended desktop size.
- No external services or decorative dependencies were added without need.

## Deliverable from this skill

Provide a concise design summary, changed files, screenshots if the environment permits, implementation status, and regressions tested. Label enhanced style as **recommended** rather than teacher-required. Preserve function over polish.
