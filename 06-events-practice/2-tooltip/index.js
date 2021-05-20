class Tooltip {
  static instance = null;

  element = null;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }
  }

  addEventListeners() {
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltip.forEach(el => {
      el.addEventListener('pointerover', this.show);
    });
  }

  removeEventListeners() {
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltip.forEach(el => {
      el.removeEventListener('pointerover', this.show);
    });
  }

  initialize() {
    const container = document.createElement('div');
    container.innerHTML = `<div class='tooltip'></div>`;

    this.element = container.firstElementChild;
    this.addEventListeners();
  }


  updateTooltipPosition = (ev) => {
    this.element.style.top = `${ (ev.clientY + 10) }px`;
    this.element.style.left = `${ (ev.clientX + 10) }px`;
  };

  show = (ev) => {
    ev.target.addEventListener('pointerout', this.hide);
    window.addEventListener('mousemove', this.updateTooltipPosition);
    const text = ev.target.dataset.tooltip;
    this.render(text, ev.target);
  };

  hide = () => {
    // удаляем конкретный тултип
    this.element.remove();
    window.removeEventListener('mousemove', this.updateTooltipPosition);
  };

  render(text, target) {
    this.element.innerHTML = text;

    (target || document.body).append(this.element);
  }

  destroy() {
    this.hide();
    // удаляем обработчики событий
    this.removeEventListeners();
  }
}

export default Tooltip;
