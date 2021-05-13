const EmptyProps = {
  label: '',
  data: [],
  value: '',
  link: ''
};

export default class ColumnChart {
  chartHeight = 50;
  element = null;
  chartComponent = null;

  constructor({ label, data, value, link, formatHeading } = EmptyProps) {
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
    return !Array.isArray(this.data) || !this.data.length;
  }

  renderColumns() {
    if (this.isEmptyData()) {
      return '';
    }

    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
    return this.data.map(value => {
      const scaledValue = String(Math.floor(value * scale));
      const percentValue = `${ (value / maxValue * 100).toFixed(0) }%`;
      return `<div style='--value: ${ scaledValue }' data-tooltip='${ percentValue }'></div>`;
    }).join('');
  }

  renderChart() {
    return `
        <div class='column-chart__container'>
           <div class='column-chart__header'>
                ${ this.displayValue }
           </div>
           <div class='column-chart__chart'>
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
    this.chartComponent = elementContainer.getElementsByClassName('column-chart__container')[0];
  }

  update(newData) {
    this.data = Array.isArray(newData) ? newData : [];

    if (this.isEmptyData()) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }

    this.chartComponent.innerHTML = this.renderChart();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.chartComponent = null;
  }
}
