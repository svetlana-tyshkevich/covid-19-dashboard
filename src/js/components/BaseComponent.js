import create from '../utils/create';

export default class BaseComponent {
  constructor(cssClass) {
    this.wrap = document.querySelector(`.${cssClass}`);
    this.wrap.classList.add('component');

    this.resizeButton = this.wrap.querySelector('.resize-button');

    this.loader = create({
      tagName: 'div',
      classNames: 'loader',
      children: '<div></div><div></div><div></div><div></div>',
    });

    this.tabs = create({
      tagName: 'div',
      classNames: 'tabs',
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

  addTab = (name, attr) => {
    const element = create({
      tagName: 'div',
      classNames: 'tab',
      children: name,
      dataAttr: [['tab', attr]],
    });
    this.tabs.append(element);

    this.wrap.append(this.tabs);
  }
}
