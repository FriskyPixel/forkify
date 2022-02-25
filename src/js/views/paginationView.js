import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = 'No recipes found for your query! Please try again.';
  _message = '';

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const markupButtonBack = `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
    const markupButtonForward = `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    // On first of multiple pages
    if (curPage === 1 && numPages > 1) {
      return `${markupButtonForward}`;
    }

    // On last of multiple pages
    if (curPage === numPages && numPages > 1) {
      return `${markupButtonBack}`;
    }

    // Not on first or last of muliple pages
    if (curPage < numPages) {
      return `${markupButtonBack}${markupButtonForward}`;
    }

    // Only 1 page
    return '';
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
