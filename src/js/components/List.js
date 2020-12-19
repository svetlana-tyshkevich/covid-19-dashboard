import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class List extends BaseComponent {
  constructor(className) {
    super(className);
    this.list = create({ tagName: 'ul', classNames: `${className}__inner` });

    this.isStarted = false;
  }

  checkArgument = (cases) => {
    if (!cases.match(/cases|recovered|deaths/)) {
      throw new Error('Cases must be one of: confirmed, recovered, deaths!');
    }
  }

  createList = (cases) => {
    this.checkArgument(cases);

    this.list.innerHTML = '';
    const title = create({ tagName: 'h3', classNames: 'list__title', children: 'Cases by countries' });
    this.list.append(title);
    this.sortedData = this.sort(this.dataList, cases);

    const fullList = this.createListItems(this.sortedData, cases);
    fullList.forEach((el) => this.list.append(el));
    this.wrap.append(this.list);
  }

  createListItems = (list, cases) => {
    this.checkArgument(cases);
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
    const [confirmed, recovered, deaths] = this.tabItems;

    if (target === this.resizeButton) {
      this.fold();
    } else if (target === recovered) {
      this.tabListener(target);
    } else if (target === confirmed) {
      this.tabListener(target);
    } else if (target === deaths) {
      this.tabListener(target);
    } else if (target?.dataset?.country) {
      this.listListener(target);
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
    if (!target.closest('.active')) {
      this.createList(target.dataset.tab);
      this.model.setState('case', target.dataset.tab);
    }
    this.tabItems.forEach((el) => {
      el.classList.remove('active');
    });
    target.classList.add('active');
  }

  init = () => {
    this.isStarted = true;
    this.addTab('Confirmed', 'cases');
    this.addTab('Recovered', 'recovered');
    this.addTab('Deaths', 'deaths');
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
  }

  update = ({ data, state }) => {
    this.dataList = [...data];
    this.createList('cases');
    if (!this.isStarted) {
      this.init();
      this.loaded();
    }
    // console.log('got', state);
    this.state = state;
  }
}
