export default class SortableTable {
  element = null;
  subElements = {};

  constructor(headersConfig, {
    data = [],
    sorted = { id: '', order: '' }
  } = {}) {
    this.headerConfig = headersConfig;
    const { id: sortFieldName, order: sortOrder } = sorted;
    this.currentSort = {
      fieldName: sortFieldName,
      order: sortOrder
    };

    this.data = [...data];
    this.originalData = [...data];

    if (sortFieldName) {
      this.sortData(sortFieldName, sortOrder);
    }

    this.render();
  }

  get headerTemplate() {
    const { fieldName, order } = this.currentSort;
    return this.headerConfig.map(({ id, title, sortable, sortType }) => {
      const isColumnSorted = fieldName === id;
      return `<div class='sortable-table__cell' data-sortable='${ sortable }' data-id='${ id }' data-order='${ isColumnSorted ? order : '' }'>
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

    this.addEventListeners();
  }

  sortData(fieldName, order) {
    const { sortType } = this.headerConfig.find(({ id }) => id === fieldName);
    const multiplier = order === 'desc' ? -1 : 1;
    this.data.sort(({ [fieldName]: a }, { [fieldName]: b }) => {
      switch (sortType) {
        case 'string':
          return multiplier * a.localeCompare(b, ['ru', 'en'], {
            caseFirst: 'upper'
          });
        case 'number':
        default:
          return multiplier * (a - b);
      }
    });
  }

  sort = (ev) => {
    const targetFieldName = ev.currentTarget.dataset.id;
    const isFieldCurrentlySorted = this.currentSort.fieldName === targetFieldName;
    const sortOrder = isFieldCurrentlySorted && this.currentSort.order === 'desc' ? 'asc' : 'desc';
    this.currentSort = sortOrder ? { fieldName: targetFieldName, order: sortOrder } : {};
    this.sortData(targetFieldName, sortOrder);
    this.updateRows();
  };

  addEventListeners() {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');
    headerCells.forEach(headerCell => {
      if (headerCell.dataset.sortable) {
        headerCell.addEventListener('pointerdown', this.sort);
      }
    });
  }

  removeEventListeners() {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');
    headerCells.forEach(headerCell => {
      headerCell.removeEventListener('pointerdown', this.sort);
    });
  }

  render() {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = this.template;

    this.element = elementContainer.firstChild;
    const tableComponents = this.element.querySelectorAll('[data-element]');

    tableComponents.forEach(component => {
      this.subElements[component.dataset.element] = component;
    });

    this.addEventListeners();
  }

  destroy() {
    if (this.element) {
      this.removeEventListeners();
      this.element.remove();
      this.element = null;
    }

    this.subElements = {};
  }
}
