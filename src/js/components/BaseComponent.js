import create from '../utils/create';

import model from '../model/model';

export default class BaseComponent {
  constructor(cssClass) {
    this.model = model;

    this.wrap = document.querySelector(`.${cssClass}`);
    this.wrap.classList.add('component');
    this.state = {
      case: 'cases',
      country: 'global',
    };

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

  setState = (field, value) => {
    this.state[field] = value;
    this.model.setState(this.state);
  }

  sort = (array, parametr) => {
    const newArray = [...array];
    newArray.sort((a, b) => b[parametr] - a[parametr]);
    return newArray;
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

  useState = () => {}

  update = () => {}
}
