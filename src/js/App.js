/* eslint-disable no-unused-vars */
import create from './utils/create';

import model from './model/model';

import WorldMap from './components/Map';

import List from './components/List';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');
    this.list.init();

    this.map = new WorldMap('map');

    this.model.listen(() => {
      const countries = this.model.getCountriesStatus();
      this.list.update(countries);
      this.map.update(countries);
    });

    // const example = {
    //   country: 'south-africa',
    //   cases: 'deaths',
    //   monthFrom: 3,
    //   monthTo: 4,
    // };
    // this.model.requestStatus(example);
    this.model.requestData();
  }

  append = () => this.element;
}
