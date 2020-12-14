import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class Table extends BaseComponent {
  constructor(className) {
    super(className);
    this.list = create({ tagName: 'ul', classNames: `${className}__inner` });
  }

  makeList = (cases) => {
    if (!cases.match(/confirmed|recovered|deaths/)) {
      throw new Error('Cases must be one of: confirmed, recovered, deaths!');
    }
    this.list.innerHTML = '';

    this.dataList.forEach((element) => {
      const { Country, CountryCode } = element;
      let casesOf = '';

      if (cases === 'confirmed') {
        casesOf = element.TotalConfirmed;
      } else if (cases === 'recovered') {
        casesOf = element.TotalDeaths;
      } else {
        casesOf = element.TotalRecovered;
      }

      const urlOfImg = `https://www.countryflags.io/${CountryCode.toLowerCase()}/flat/32.png`;

      const img = create({
        tagName: 'img',
        dataAttr: [['src', urlOfImg]],
      });

      const imgWrap = create({
        tagName: 'div',
        classNames: 'list__item-img',
        children: img,
      });

      const listItem = create({
        tagName: 'li',
        classNames: 'list__item',
        children: [imgWrap, Country, casesOf],
        dataAttr: [['country', CountryCode]],
      });

      this.list.append(listItem);
    });
  }

  update = (data) => {
    this.dataList = [...data];
    this.makeList('confirmed');
    this.loaded();
  }

  handleEvent = (event) => {
    const { target } = event;

    if (target === this.resizeButton) {
      this.fold();
    }
  }

  init = () => {
    this.addTab('Confermed', 'confermd');
    this.wrap.append(this.list);
    this.wrap.addEventListener('click', this.handleEvent);
  }
}
