import * as _ from 'lodash';

import create from '../utils/create';

import model from '../model/model';

export default class BaseComponent {
  constructor(cssClass) {
    this.model = model;
    this.isSlider = false;

    this.wrap = document.querySelector(`.${cssClass}`);
    this.wrap.classList.add('component');
    this.state = {
      case: 'cases',
      country: 'global',
      period: false,
      abs: false,
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

  setState = (state) => {
    _.forIn(state, (value, key) => {
      if (this.state[key] !== state[key]) {
        this.state[key] = state[key];
      }
    });
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
      this.loaderWrap?.parentNode?.removeChild(this.loaderWrap);
    }, 0);
  }

  addTab = (name, dataAttr) => {
    const element = create({
      tagName: 'div',
      classNames: 'tab',
      children: name,
      dataAttr: [...dataAttr],
    });

    this.tabs.append(element);

    const tabItems = [...this.tabs.children];
    if (tabItems.length > 5) {
      this.arrowL = create({
        tagName: 'div',
        classNames: 'tab__arrow left',
        children: '<',
        dataAttr: [['arrow', 'left']],
      });
      this.arrowR = create({
        tagName: 'div',
        classNames: 'tab__arrow right',
        children: '>',
        dataAttr: [['arrow', 'right']],
      });
      if (!this.isSlider) {
        this.isSlider = true;
        this.tabs.append(this.arrowL, this.arrowR);
      }
      this.tabs.classList.add('slider');
    }

    this.wrap.append(this.tabs);
  }

  update = () => {}
}
