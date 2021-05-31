const MONTH_NAMES = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

function formatDate(date) {
  if (!date) {
    return '';
  }

  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  const year = String(date.getFullYear());

  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  return [day, month, year].join('.');
}

function getEndOfMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month + 1, 0);
}

function compareDates(date1, date2) {
  const d1 = new Date(date1.getTime());
  const d2 = new Date(date2.getTime());

  d1.setHours(0);
  d1.setMinutes(0);
  d1.setSeconds(0);
  d1.setMilliseconds(0);

  d2.setHours(0);
  d2.setMinutes(0);
  d2.setSeconds(0);
  d2.setMilliseconds(0);

  // >=1 если date1 > date2
  // 0 если равны
  // <=-1, если date1 < date2
  return date1.getTime() - date2.getTime();
}


const WEEK_TEMPLATE = `<div class='rangepicker__day-of-week'>
  <div data-dayNumber='1'>Пн</div>
  <div data-dayNumber='2'>Вт</div>
  <div data-dayNumber='3'>Ср</div>
  <div data-dayNumber='4'>Чт</div>
  <div data-dayNumber='5'>Пт</div>
  <div data-dayNumber='6'>Сб</div>
  <div data-dayNumber='0'>Вс</div>
</div>`;


export default class RangePicker {
  dateFrom = new Date();
  dateTo = new Date();

  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  isStartSelected = false;
  isOpenedCalendar = false;

  element = null;
  calendar = null;
  subElements = {};

  showCalendar = () => {
    this.element.classList.add('rangepicker_open');
    this.subElements.selector.innerHTML = this.calendarContent;

    const calendarComponents = this.subElements.selector.querySelectorAll('[data-element]');
    calendarComponents.forEach(component => {
      this.subElements[component.dataset.element] = component;
    });

    this.subElements.selector.addEventListener('click', this.onDateClick);
    this.subElements.prevMonth.addEventListener('click', this.onPrevMonthClick);
    this.subElements.nextMonth.addEventListener('click', this.onNextMonthClick);

    this.isOpenedCalendar = true;
    window.addEventListener('click', this.onDocumentClick);
  };

  hideCalendar = () => {
    this.element.classList.remove('rangepicker_open');
    this.subElements.selector.innerHTML = '';
    this.isOpenedCalendar = false;
    window.removeEventListener('click', this.onDocumentClick);
  };

  onInputClick = (ev) => {
    ev.stopPropagation();
    this.isOpenedCalendar ? this.hideCalendar() : this.showCalendar();
  };

  onDocumentClick = (ev) => {
    const isClickInside = this.subElements.selector.contains(ev.target);
    if (!isClickInside && this.isOpenedCalendar) {
      this.hideCalendar();
    }
  };

  onDateClick = (ev) => {
    const cellClicked = ev.target.closest('.rangepicker__cell');
    ev.stopPropagation();
    if (cellClicked) {
      const selectedDate = new Date(cellClicked.dataset.value);

      if (!this.isStartSelected) {
        this.isStartSelected = true;
        this.clearSelection();
        this.dateFrom = selectedDate;
        cellClicked.classList.add('rangepicker__selected', 'rangepicker__selected-from');
        this.dateTo = null;
      } else {
        this.isStartSelected = false;
        this.dateTo = selectedDate;
        cellClicked.classList.add('rangepicker__selected', 'rangepicker__selected-to');
        this.updateDisplayMonths();
        // this.hideCalendar();
        this.updateSelectedDates();

        this.element.dispatchEvent(new CustomEvent('date-select', {
          dateFrom: this.dateFrom,
          dateTo: this.dateTo
        }));
      }
    }
  };

  onPrevMonthClick = (ev) => {
    const date = new Date(this.selectedYear, this.selectedMonth, 1);
    date.setMonth(this.selectedMonth - 1);
    this.selectedYear = date.getFullYear();
    this.selectedMonth = date.getMonth();

    this.updateDisplayMonths();
  };

  onNextMonthClick = (ev) => {
    const date = new Date(this.selectedYear, this.selectedMonth, 1);
    date.setMonth(this.selectedMonth + 1);
    this.selectedYear = date.getFullYear();
    this.selectedMonth = date.getMonth();

    this.updateDisplayMonths();
  };

  constructor({ from = null, to = null } = {}) {
    if (from) {
      this.dateFrom = from;
      this.selectedMonth = from.getMonth();
      this.selectedYear = from.getFullYear();
      // 1 число выбранного месяца "с"
    }

    if (to) {
      this.dateTo = to;
      // Последний день выбраного месяяца "по"
    }

    this.render();
  }

  getMonthTemplate(month, isFrom) {
    let date = new Date(this.selectedYear, month, 1);

    if (!MONTH_NAMES[month]) {
      console.log('Error for month', month);
    }

    const monthName = MONTH_NAMES[month];
    const lastDayOfMonth = getEndOfMonth(date);
    const startDayOfWeek = date.getDay();
    const dates = Array.from(Array(lastDayOfMonth.getDate()).keys());

    const dateCells = [];
    dates.forEach(dayOfMonth => {
      date.setDate(dayOfMonth + 1);
      const dateStr = formatDate(date);

      const isDateFrom = this.dateFrom && formatDate(this.dateFrom) === dateStr;
      const isDateTo = this.dateTo && formatDate(this.dateTo) === dateStr;

      const isBetween = this.dateFrom && this.dateTo && !isDateFrom && !isDateTo
        && compareDates(date, this.dateFrom) > 0 && compareDates(date, this.dateTo) < 0;


      let addClassName = '';
      if (isDateFrom || isDateTo) {
        addClassName = `rangepicker__selected${ isDateFrom ? '-from' : '-to' }`;
      } else if (isBetween) {
        addClassName = 'rangepicker__selected-between';
      }

      dateCells.push(
        `<button
          type='button'
          class='rangepicker__cell ${ addClassName }'
          data-value='${ date.toISOString() }'
          style='--start-from:${ startDayOfWeek }'
        >
            ${ dayOfMonth + 1 }
        </button>`
      );
    });

    return `<div class='rangepicker__month-indicator'>
    <time datetime='${ monthName }'>${ monthName }</time>
    </div>
    ${ WEEK_TEMPLATE }
    <div class='rangepicker__date-grid' data-element='${ `dateGrid${ isFrom ? 'From' : 'To' }` }'>
    ${ dateCells.join('') }
    </div>`
      ;
  }

  get calendarContent() {
    return `<div class='rangepicker__selector-arrow'></div>
    <div class='rangepicker__selector-control-left' data-element='prevMonth'></div>
    <div class='rangepicker__selector-control-right' data-element='nextMonth'></div>
    <div
      class='rangepicker__calendar'
      data-element='monthFrom'
    >
      ${ this.getMonthTemplate(this.selectedMonth, true) }
    </div>
    <div
      class='rangepicker__calendar'
      data-element='monthTo'
    >
      ${ this.getMonthTemplate(this.selectedMonth === 11 ? 0 : this.selectedMonth + 1) }
    </div>`;
  }

  get template() {
    return `<div class='rangepicker'>
    <div
    class='rangepicker__input'
    data-element='input'
    >
    <span data-element='from'>${ formatDate(this.dateFrom) }</span>
    -
    <span data-element='to'>${ formatDate(this.dateTo) }</span>
    </div>

        <div
    class='rangepicker__selector'
    data-element='selector'
    ></div>
    </div>`;
  }

  addEventListeners() {
    this.subElements.input.addEventListener('click', this.onInputClick);
  }

  clearSelection() {
    const classesToRemove = ['rangepicker__selected-between', 'rangepicker__selected-from', 'rangepicker__selected-to'];

    const cellsFrom = this.subElements.dateGridFrom.querySelectorAll('.rangepicker__cell');
    cellsFrom.forEach(cell => {
      cell.classList.remove(...classesToRemove);
    });

    const cellsTo = this.subElements.dateGridTo.querySelectorAll('.rangepicker__cell');
    cellsTo.forEach(cell => {
      cell.classList.remove(...classesToRemove);
    });
  }

  updateSelectedDates() {
    this.subElements.from.innerHTML = formatDate(this.dateFrom);
    this.subElements.to.innerHTML = formatDate(this.dateTo);
  }

  updateDisplayMonths() {
    this.subElements.monthFrom.innerHTML = this.getMonthTemplate(this.selectedMonth, true);
    this.subElements.monthTo.innerHTML = this.getMonthTemplate(this.selectedMonth === 11 ? 0 : this.selectedMonth + 1);
  }

  render() {
    const container = document.createElement('div');
    container.innerHTML = this.template;
    this.element = container.firstElementChild;

    const components = this.element.querySelectorAll('[data-element]');
    components.forEach(component => {
      this.subElements[component.dataset.element] = component;
    });

    // const calendarComponents = this.calendar.querySelectorAll('[data-element]');
    // calendarComponents.forEach(component => {
    //   this.subElements[component.dataset.element] = component;
    // });


    this.addEventListeners();
  }

  removeEventListeners() {
    window.removeEventListener('click', this.onDocumentClick);
  }

  remove() {
    this.removeEventListeners();
    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.subElements = {};
  }

  destroy() {
    this.remove();
  }
}
