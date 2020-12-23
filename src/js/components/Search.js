// import * as _ from 'lodash';
import BaseComponent from './BaseComponent';
import create from '../utils/create';

export default class Search extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.resizeButton = '';

    this.title = create({
      tagName: 'label',
      classNames: 'search__label',
      children: 'Live search',
      dataAttr: [['for', 'search']],
      parent: this.wrap,
    });

    this.input = create({
      tagName: 'input',
      classNames: 'search__input',
      dataAttr: [
        ['type', 'text'],
        ['placeholder', 'Search country...'],
        ['id', 'search'],
      ],
      parent: this.wrap,
    });

    this.model.listen(() => {
      setTimeout(() => {
        this.list = [...document.querySelectorAll('.list__item-country')];
        if (this.list.length !== 0) {
          this.update();
        }
      }, 200);
    });
    this.isStarted = false;
  }

  update = () => {
    this.init();
    setTimeout(() => {
      this.inputEvent();
    }, 0);
  }

  handleEvent = () => {

  }

  inputEvent = () => {
    const value = this.input.value.trim().toLowerCase();
    if (value !== '') {
      this.list.forEach((item) => {
        setTimeout(() => {
          const parent = item.parentNode;
          const text = item.innerText.toLowerCase();
          if (text.search(value) === -1) {
            parent.classList.add('hidden');
          } else {
            parent.classList.remove('hidden');
          }
        }, 0);
      });
    } else {
      this.list.forEach((item) => {
        setTimeout(() => {
          const parent = item.parentNode;
          parent.classList.remove('hidden');
        }, 0);
      });
    }
  }

  init = () => {
    if (!this.isStarted) {
      this.isStarted = true;
      this.input.addEventListener('input', this.inputEvent);
      this.loaded();
    }
  }
}
