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
    this.loaderWrap = create({
      tagName: 'div',
      classNames: 'loader__wrap',
      children: this.loader,
    });

    this.tabs = create({
      tagName: 'div',
      classNames: 'tabs',
    });

    this.wrap.append(this.loaderWrap);
  }

  fold = () => {
    this.wrap.classList.toggle('expanded');
    this.resizeButton.classList.toggle('pressed');
  }

  loaded = () => {
    setTimeout(() => {
      this.loaderWrap.innerHTML = '';
      this.loaderWrap.parentNode.removeChild(this.loaderWrap);
    }, 0);
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
