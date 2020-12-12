import create from '../utils/create';

export default class Wrap {
  constructor(cssClass) {
    this.wrap = document.querySelector(`.${cssClass}`);
    this.wrap.classList.add('component');

    this.resizeButton = this.wrap.querySelector('.resize-button');

    this.loader = create({
      tagName: 'div',
      classNames: 'loader',
      children: '<div></div><div></div><div></div><div></div>',
    });

    this.wrap.append(this.loader);
  }

  fold = () => {
    this.wrap.classList.toggle('expanded');
    this.resizeButton.classList.toggle('pressed');
  }

  loaded = () => {
    this.loader.parentNode.removeChild(this.loader);
  }
}
