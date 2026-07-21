# Workers Progress Report — Web Application

A premium, print-friendly recreation of the WCB Worker Progress Report, built with HTML5, CSS3, and vanilla JavaScript only (no frameworks, no libraries).

## Running it

Open `index.html` in any modern browser. No build step, no server required — all assets are relative paths.

> **Note on the logo:** `assets/logo.svg` is a generic placeholder mark, not the original organization's trademarked logo. Replace it with your organization's own logo file (same filename, or update the `src` in `js/render.js` → `render.header()`) before using this in production.

## Structure

```
workers-progress-report/
├── index.html          Semantic page shell with empty "data-slot" regions
├── css/
│   ├── styles.css       Design tokens + component styles (screen)
│   └── print.css        A4 print rules, loaded only for @media print
├── js/
│   ├── data.js           The `report` object — single source of truth
│   ├── utils.js          Formatting + DOM-building helpers
│   ├── components.js      Reusable controls: choice groups, textareas,
│   │                       pain scale, date/text inputs, checkbox
│   ├── render.js          One render function per report section
│   └── app.js             Boot sequence, print button wiring
├── assets/
│   ├── logo.svg
│   └── icons/
└── README.md
```

## How data flows

1. `data.js` defines `report` (all form state) and `optionSets` (the fixed
   choice lists — e.g. return-to-work status, working-as options).
2. `render.js` reads `report` and paints each `[data-slot]` region.
3. Every interactive control's `onChange`/`onSelect` callback mutates
   `report` directly, then calls the relevant `render.X()` again — a
   simple, dependency-free one-way data flow.

To pre-fill the report with different data (e.g. wiring it to a real
backend), edit the `report` object in `data.js` or set its fields at
runtime and call `render.all()`.

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `fieldset`/`legend`).
- All choice groups use `role="radiogroup"` with `role`-appropriate
  keyboard support (native `<input type="radio">` under the hood).
- Visible focus rings (`:focus-visible`), 44×44px minimum touch targets,
  skip link, and `prefers-reduced-motion` support.

## Printing

Use the **Print / Export** button (or your browser's print command). The
print stylesheet hides the toolbar, forces a white background, and places
a page break between each of the three report sections so the printed
output mirrors the original three-page document.
