/* eslint-disable no-unused-vars */
import create from './utils/create';

import model from './model/model';

import Example from './components/example';
import WorldMap from './components/Map';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.exp = new Example(); // Компонент для примера, который ждет пока ему придут данные
    this.map = new WorldMap('map');
    this.map.init();

    this.model.listen(() => {
      // const dayOneData = this.model.getStatus();
      // this.exp.update(dayOneData); // Тут мы ему говорим вот данные, кушай
      const countries = this.model.getCountriesStatus();
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
