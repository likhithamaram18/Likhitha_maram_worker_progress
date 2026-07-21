/**
 * app.js
 * -----------------------------------------------------------------------
 * Application bootstrap: initial render + global chrome interactions
 * (print action, keyboard affordances).
 * -----------------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
  render.all();

  const printBtn = document.getElementById("print-action");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  document.getElementById("year-display")?.replaceChildren(
    document.createTextNode(new Date().getFullYear())
  );
});
