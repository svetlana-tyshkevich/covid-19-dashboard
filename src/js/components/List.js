import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class List extends BaseComponent {
  constructor(className) {
    super(className);
    this.list = create({ tagName: 'ul', classNames: `${className}__inner` });

    this.isStarted = false;
  }

  capitalize = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

  createList = (cases) => {
    if (!cases.match(/confirmed|recovered|deaths/)) {
      throw new Error('Cases must be one of: confirmed, recovered, deaths!');
    }

    this.list.innerHTML = '';
    const title = create({ tagName: 'h3', classNames: 'list__title', children: 'Cases by countries' });
    this.list.append(title);
    if (cases === 'confirmed') {
      this.sortedData = this.sort(this.dataList, 'cases');
    } else if (cases === 'deaths') {
      this.sortedData = this.sort(this.dataList, 'deaths');
    } else {
      this.sortedData = this.sort(this.dataList, 'recovered');
    }

    const fullList = this.createListItems(this.sortedData, cases);
    fullList.forEach((el) => this.list.append(el));
    this.wrap.append(this.list);
  }

  createListItems = (list, cases) => {
    const fullList = [];
    list.forEach((element) => {
      let casesOf = '';

      if (cases === 'confirmed') {
        casesOf = element.cases;
      } else if (cases === 'deaths') {
        casesOf = element.deaths;
      } else {
        casesOf = element.recovered;
      }

      const casesItem = create({
        tagName: 'span',
        classNames: `list__item-cases ${cases}`,
        children: `${casesOf}`,
      });

      const urlOfImg = element.countryInfo.flag;

      const img = create({
        tagName: 'img',
        dataAttr: [['src', urlOfImg]],
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
        dataAttr: [['country', element.countryInfo.iso2]],
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
    }
  }

  tabListener = (target) => {
    if (!target.closest('.active')) {
      this.createList(target.dataset.tab);
    }
    this.tabItems.forEach((el) => {
      el.classList.remove('active');
    });
    target.classList.add('active');
  }

  init = () => {
    this.isStarted = true;
    this.addTab('Confirmed', 'confirmed');
    this.addTab('Recovered', 'recovered');
    this.addTab('Deaths', 'deaths');
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
  }

  update = (data) => {
    this.dataList = [...data];
    if (!this.isStarted) {
      this.init();
      this.createList('confirmed');
      this.loaded();
    }
  }
}
