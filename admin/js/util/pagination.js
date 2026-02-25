/**
 * pagination.js — Reusable pagination utility
 *
 * Usage:
 *   import { Pagination } from "./pagination.js";
 *
 *   const pager = new Pagination({
 *     containerSelector: "#pagination-container",  // or pass an element
 *     itemsPerPage: 8,
 *     onPageChange: (pageItems, currentPage, totalPages) => {
 *       renderMyTable(pageItems);
 *     },
 *   });
 *
 *   pager.setData(myArray);   // call whenever data changes
 *   pager.goToPage(1);        // programmatically jump to a page
 */

export class Pagination {
  /**
   * @param {Object}   opts
   * @param {string|HTMLElement} opts.containerSelector  – CSS selector or element to inject nav into
   * @param {number}  [opts.itemsPerPage=8]
   * @param {Function} opts.onPageChange  – called with (pageItems[], currentPage, totalPages)
   */
  constructor({ containerSelector, itemsPerPage = 8, onPageChange }) {
    this._data = [];
    this._page = 1;
    this._perPage = itemsPerPage;
    this._onPageChange = onPageChange;

    // Resolve container element
    if (typeof containerSelector === "string") {
      this._container = document.querySelector(containerSelector);
    } else {
      this._container = containerSelector;
    }

    if (!this._container) {
      return;
    }

    // Single permanent delegated listener on the container
    this._container?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn || btn.disabled || btn.hasAttribute("disabled")) return;
      this.goToPage(parseInt(btn.dataset.page));
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /** Replace the data array and jump to page 1 */
  setData(data) {
    this._data = data ?? [];
    this._page = 1;
    this._emit();
    this._render();
  }

  /** Navigate to a specific page (1-based) */
  goToPage(page) {
    const total = this._totalPages();
    if (page < 1 || page > total) return;
    this._page = page;
    this._emit();
    this._render();
  }

  /** Returns the current page number */
  get currentPage() {
    return this._page;
  }

  /** Returns total number of pages */
  get totalPages() {
    return this._totalPages();
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  _totalPages() {
    return Math.max(1, Math.ceil(this._data.length / this._perPage));
  }

  _pageItems() {
    const start = (this._page - 1) * this._perPage;
    return this._data.slice(start, start + this._perPage);
  }

  _emit() {
    if (typeof this._onPageChange === "function") {
      this._onPageChange(this._pageItems(), this._page, this._totalPages());
    }
  }

  _render() {
    if (!this._container) return;

    const total = this._totalPages();
    const current = this._page;
    const start = (current - 1) * this._perPage + 1;
    const end = Math.min(current * this._perPage, this._data.length);

    this._container.innerHTML = `
      <div class="pg-info">
        Showing <strong>${start}–${end}</strong> of <strong>${
      this._data.length
    }</strong>
      </div>
      <div class="pg-controls">
        <button class="pg-btn" data-page="${current - 1}" ${
      current === 1 ? "disabled" : ""
    }>
          ‹ Prev
        </button>
        ${this._pageButtons(current, total)}
        <button class="pg-btn" data-page="${current + 1}" ${
      current === total ? "disabled" : ""
    }>
          Next ›
        </button>
      </div>
    `;
  }

  _pageButtons(current, total) {
    const MAX = 5;
    let start = Math.max(1, current - Math.floor(MAX / 2));
    let end = Math.min(total, start + MAX - 1);
    if (end - start < MAX - 1) start = Math.max(1, end - MAX + 1);

    let html = "";

    if (start > 1) {
      html += `<button class="pg-btn" data-page="1">1</button>`;
      if (start > 2) html += `<span class="pg-ellipsis">…</span>`;
    }

    for (let i = start; i <= end; i++) {
      html += `
        <button class="pg-btn ${
          i === current ? "pg-active" : ""
        }" data-page="${i}">
          ${i}
        </button>`;
    }

    if (end < total) {
      if (end < total - 1) html += `<span class="pg-ellipsis">…</span>`;
      html += `<button class="pg-btn" data-page="${total}">${total}</button>`;
    }

    return html;
  }
}
