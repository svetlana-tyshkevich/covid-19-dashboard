import * as _ from 'lodash';

import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class List extends BaseComponent {
  constructor(className) {
    super(className);
    this.list = create({ tagName: 'ul', classNames: `${className}__inner` });

    this.model.listen(() => {
      const countries = this.model.getSummaryData();
      if (!this.isStarted) {
        if (countries?.length > 0) {
          this.update(countries);
        }
      }
      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        const cases = state.case;
        this.setState(state);
        this.tabListener(cases);
      }
    });

    this.isStarted = false;
  }

  createString = (start, end) => {
    const capitalize = `${end.charAt(0).toUpperCase()}${end.slice(1)}`;
    return start + capitalize;
  }

  createList = (cases) => {
    setTimeout(() => {
      this.list.innerHTML = '';
      const title = create({ tagName: 'h3', classNames: 'list__title', children: 'Cases by countries' });
      this.list.append(title);
      this.sortedData = this.sort(this.data, cases);

      const fullList = this.createListItems(this.sortedData, cases);
      fullList.forEach((el) => this.list.append(el));
      this.wrap.append(this.list);
    }, 0);
  }

  createListItems = (list, cases) => {
    const fullList = [];
    list.forEach((element) => {
      const casesOf = element[cases];

      const casesItem = create({
        tagName: 'span',
        classNames: `list__item-cases ${cases}`,
        children: `${casesOf}`,
      });

      const { flag, iso2 } = element.countryInfo;

      const img = create({
        tagName: 'img',
        dataAttr: [['src', flag]],
      });

      const imgWrap = create({
        tagName: 'div',
        classNames: 'list__item-img',
        children: img,
      });

      const countryItem = create({
        tagName: 'span',
        classNames: 'list__item-country',
        children: element.country,
      });

      const listItem = create({
        tagName: 'li',
        classNames: 'list__item',
        children: [imgWrap, countryItem, casesItem],
        dataAttr: [['country', iso2]],
      });

      fullList.push(listItem);
    });
    return fullList;
  }

  handleEvent = (event) => {
    const { target } = event;
    const positonActive = _.findIndex(this.tabItems, (el) => el.closest('.active')) || 0;
    const prev = (positonActive > 0)
      ? this.tabItems[positonActive - 1]
      : this.tabItems[this.tabItems.length - 1];
    const next = positonActive < this.tabItems.length - 1
      ? this.tabItems[positonActive + 1]
      : this.tabItems[0];

    if (target === this.resizeButton) {
      this.fold();
    } else if (target?.dataset?.tab) {
      this.tabListener(target);
    } else if (target?.dataset?.country) {
      this.listListener(target);
    } else if (target.dataset.arrow === 'left') {
      this.tabListener(prev);
    } else if (target.dataset.arrow === 'right') {
      this.tabListener(next);
    }
  }

  listListener = (target) => {
    if (!target.closest('.active')) {
      this.model.setState('country', target.dataset.country);
    }
    const listItems = [...this.list.children];
    listItems.forEach((el) => {
      el.classList.remove('active');
    });
    target.classList.add('active');
  }

  tabListener = (target) => {
    let element;
    if (typeof target === 'string') {
      element = this.tabItems.find((el) => el.dataset.tab === target);
    } else if (!target.closest('.active')) {
      element = target;
    }
    let cases;
    if (this.state.abs) {
      cases = `${element.dataset.tab}Per100k`;
      this.createList(cases);
    } else if (this.state.period) {
      cases = this.createString('today', element.dataset.tab);
      this.createList(cases);
    } else if (this.state.period && this.state.abs) {
      // Тут для обоих показателей сразу
      this.createList(element.dataset.tab);
    } else {
      this.createList(element.dataset.tab);
    }
    this.model.setState('case', element.dataset.tab);
    this.tabItems.forEach((el) => {
      el.classList.remove('active');
    });
    element.classList.add('active');
  }

  init = () => {
    this.isStarted = true;
    const tabs = [
      ['Confirmed', [['tab', 'cases']]],
      ['Recovered', [['tab', 'recovered']]],
      ['Deaths', [['tab', 'deaths']]],
    ];
    tabs.forEach((el) => {
      const [name, data] = el;
      this.addTab(name, data);
    });
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
  }

  update = (data) => {
    this.data = [...data];
    if (!this.isStarted) {
      this.init();
      this.createList('cases');
      this.loaded();
    }
  }
}
