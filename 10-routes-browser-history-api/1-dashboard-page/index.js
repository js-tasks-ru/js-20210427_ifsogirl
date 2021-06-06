import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru/';


const today = new Date();
const monthAgo = new Date();
monthAgo.setMonth(today.getMonth() - 1);

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export default class Page {
  element = null;
  subElements = {};
  components = {};

  onDateChange = async ({ detail: { from, to } }) => {
    await this.loadData(from, to);
  };

  createComponents() {
    const initialDates = { from: monthAgo, to: today };
    this.components.rangePicker = new RangePicker(initialDates);


    this.components.ordersChart = new ColumnChart({
      label: 'Заказы',
      url: 'api/dashboard/orders',
      link: 'Подробнее',
      range: initialDates
    });

    this.components.ordersChart.element.classList.add('dashboard__chart_orders');

    this.components.salesChart = new ColumnChart({
      label: 'Продажи',
      url: 'api/dashboard/sales',
      range: initialDates,
      formatHeading: (total) => formatter.format(total)
    });
    this.components.salesChart.element.classList.add('dashboard__chart_sales');

    this.components.customersChart = new ColumnChart({
      label: 'Заказы',
      url: 'api/dashboard/customers',
      range: initialDates
    });
    this.components.customersChart.element.classList.add('dashboard__chart_customers');

    this.components.sortableTable = new SortableTable(header, {
      url: '/api/dashboard/bestsellers',
      isSortLocally: true,
      range: [initialDates.from, initialDates.to]
    });

    Object.keys(this.components).forEach(componentName => {
      this.subElements[componentName] = this.components[componentName].element;
    });
  }

  async loadData(from, to) {
    ['ordersChart', 'salesChart', 'customersChart'].forEach(chartName => {
      this.components[chartName].update(from, to);
    });

    return this.components.sortableTable.loadDataByRange(from, to);
  }

  async render() {
    this.createComponents();
    const container = document.createElement('div');

    container.innerHTML = `<div class='dashboard'>
    <div class='content__top-panel'><h2 class='page-title'>Панель управления</h2></div>
      <div class='dashboard__charts'>
      </div>
    </div>`;

    this.element = container.firstElementChild;
    const headerContainer = this.element.querySelector('.content__top-panel');
    headerContainer.append(this.subElements.rangePicker);

    const chartsContainer = this.element.querySelector('.dashboard__charts');

    chartsContainer.append(this.subElements.ordersChart);
    chartsContainer.append(this.subElements.salesChart);
    chartsContainer.append(this.subElements.customersChart);

    this.element.append(this.subElements.sortableTable);
    this.element.addEventListener('date-select', this.onDateChange);
    // await this.loadData(monthAgo, today);

    return this.element;
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
