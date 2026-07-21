/**
 * utils.js
 * -----------------------------------------------------------------------
 * Small, dependency-free helpers shared by render.js and components.js.
 * -----------------------------------------------------------------------
 */

const utils = {
  /** Format an ISO date string ("2024-03-15") into "March 15, 2024". */
  formatDate(isoDate) {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-").map(Number);
    if (!y || !m || !d) return "";
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  },

  /** Format an ISO datetime string into "March 19, 2024 19:21". */
  formatDateTime(isoDateTime) {
    if (!isoDateTime) return "";
    const date = new Date(isoDateTime);
    if (Number.isNaN(date.getTime())) return "";
    const datePart = date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
    const timePart = date.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${datePart} ${timePart}`;
  },

  /** Create a DOM element with attributes and children in one call. */
  el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "html") node.innerHTML = value;
      else if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value !== undefined && value !== null && value !== false) {
        node.setAttribute(key, value === true ? "" : value);
      }
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  },

  /** Escape a string for safe injection via innerHTML. */
  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  },

  /** Debounce a function so it only runs after `wait` ms of silence. */
  debounce(fn, wait = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  },

  /** Generate a stable id fragment for pairing labels/inputs. */
  uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  },

  /** Clear all children from a node. */
  empty(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }
};
