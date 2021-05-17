export default class SortableTable {
  element = null;
  subElements = {};

  constructor(headerConfig = [], {data = []} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.currentSort = {};

    this.render();
  }

  get headerTemplate() {
    const { fieldName, order } = this.currentSort;
    return this.headerConfig.map(({ id, title, sortable, sortType }) => {
      const isColumnSorted = fieldName === id;
      return `<div
        class='sortable-table__cell'
        data-id={id}
        data-sortable=${ isColumnSorted }
        data-order=${ isColumnSorted ? order : '' }
      >
        <span>${ title }</span>
        ${ isColumnSorted ? `<span
        data-element='arrow'
        class='sortable-table__sort-arrow'
      >
        <span class='sort-arrow'></span>
      </span>` : '' }
      </div>`;
    }).join('');
  }

  get rowsTemplate() {
    return this.data.map((row) => (
      `<div class='sortable-table__row'>
        ${ this.headerConfig.map(({ id, template }) => (
        typeof template === 'function' ? template(row[id]) :
          `<div class='sortable-table__cell'>${ row[id] }</div>`
      )).join('') }
       </div>`))
      .join('');
  }

  get template() {
    return `<div class='sortable-table'>
        <div data-element='header' class='sortable-table__header sortable-table__row'>
          ${ this.headerTemplate }
        </div>
        <div data-element='body' class='sortable-table__body'>
          ${ this.rowsTemplate }
        </div>
      </div>`;
  }

  updateRows() {
    this.subElements.header.innerHTML = this.headerTemplate;
    this.subElements.body.innerHTML = this.rowsTemplate;
  }

  sort(fieldName, order) {
    this.currentSort = { fieldName, order };
    const { sortType } = this.headerConfig.find(({ id }) => id === fieldName);
    const multiplier = order === 'desc' ? -1 : 1;
    this.data.sort((row1, row2) => multiplier * String(row1[fieldName]).localeCompare(String(row2[fieldName]), ['ru', 'en'], {
      caseFirst: 'upper',
      numeric: sortType === 'number'
    }));

    this.updateRows();
  }


  render() {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = this.template;

    this.element = elementContainer.firstChild;
    const tableComponents = this.element.querySelectorAll('[data-element]');

    tableComponents.forEach(component => {
      this.subElements[component.dataset.element] = component;
    });
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.subElements = {};
  }
}

