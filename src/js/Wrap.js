export default class Wrap {
  constructor(cssClass) {
    this.wrap = document.querySelector(`.${cssClass}`);
    this.resizeButton = this.wrap.querySelector('.resize-button');
  }

  fold = () => {
    this.resizeButton.addEventListener('click', (e) => {
      e.currentTarget.parentNode.classList.toggle('expanded');
      e.currentTarget.classList.toggle('pressed');
    });
  };

  init = () => {
    this.fold();
  }
}
