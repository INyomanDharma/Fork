import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  /**
   *
   * @param {Object | Object[]} data the data be rendered (model.state.recipe)| (model.state.bookmarks)
   * @param {boolean} [render= true] If False, create markup string instead ofrendering to the DOM
   * @returns {undefined | string} If render = false, a markup string is returned
   * @this {Object} View instance
   * @author I Nyoman Dharma
   * @todo Finish Implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('✅', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //Update changed ATTRIBUTE

      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
            <svg class="icon-triangle">
              <use href="${icons}.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg class="icon-smile">
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}svg#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
