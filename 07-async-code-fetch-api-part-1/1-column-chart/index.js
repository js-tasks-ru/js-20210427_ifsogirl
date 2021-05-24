import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  element = null;

  constructor({ label = '', data = {}, value = '', link = '', formatHeading = null } = {}) {
    this.label = label;
    this.data = data;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  get displayValue() {
    return typeof this.formatHeading === 'function' ? this.formatHeading(this.value) : this.value;
  }

  get renderTemplate() {
    return `<div style='--chart-height: 50' class='column-chart ${ this.isEmptyData() ? 'column-chart_loading' : '' }'>
            <div class='column-chart__title'>
                ${ this.label } ${ this.renderLink() }
           </div>
           ${ this.renderChart() }
        </div>`;
  }

  isEmptyData() {
    return !Object.keys(this.data).length;
  }

  renderColumns() {
    if (this.isEmptyData()) {
      return '';
    }

    const maxValue = Math.max(...Object.values(this.data));
    const scale = this.chartHeight / maxValue;
    return Object.entries(this.data).map(([date, value]) => {
      const scaledValue = String(Math.floor(value * scale));
      const percentValue = `${ (value / maxValue * 100).toFixed(0) }%`;
      return `<div style='--value: ${ scaledValue }' data-tooltip='${ date }'></div>`;
    }).join('');
  }

  renderChart() {
    return `
        <div class='column-chart__container'>
           <div class='column-chart__header' data-element='header'>
                ${ this.displayValue }
           </div>
           <div class='column-chart__chart' data-element='body'>
                ${ this.renderColumns() }
           </div>
        </div>`;
  }

  renderLink() {
    return this.link ? `<a href='${ this.link }' class='column-chart__link'> More </a>` : '';
  }

  render() {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = this.renderTemplate;

    this.element = elementContainer.firstChild;
    const childComponents = this.element.querySelectorAll('[data-element]');

    childComponents.forEach(component => {
      this.subElements[component.dataset.element] = component;
    });
  }

  update(dateFromObj, dateToObj) {
    //Показываем лоадинг
    this.element.classList.add('column-chart_loading');
    const dateFrom = dateFromObj.toISOString();
    const dateTo = dateToObj.toISOString();

    return fetchJson(`${ BACKEND_URL }/api/dashboard/orders?from=${ dateFrom }&to=${ dateTo }`)
      .then(data => {
        this.data = { ...data };

        //Убираем лоадинг, если данные не пустые
        if (!this.isEmptyData()) {
          this.element.classList.remove('column-chart_loading');
        }

        this.subElements.body.innerHTML = this.renderColumns();
        return data;
      });
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
