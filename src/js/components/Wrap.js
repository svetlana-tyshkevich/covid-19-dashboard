export default class Wrap {
  constructor(cssClass) {
    this.wrap = document.querySelector(`.${cssClass}`);
    this.resizeButton = this.wrap.querySelector('.resize-button');
  }

  fold = (event) => {
    const { target } = event;
    target.parentNode.classList.toggle('expanded');
    target.classList.toggle('pressed');
  }

  init = () => {
    this.resizeButton.addEventListener('click', this.fold);
  }
}
