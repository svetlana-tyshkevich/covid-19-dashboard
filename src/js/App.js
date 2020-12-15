import create from './utils/create';

import model from './model/model';

import List from './components/List';
import ChartBoard from './components/Chart';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');

    this.chart = new ChartBoard('chart');

    this.model.listen(() => {
      const countries = this.model.getCountriesStatus();
      if (countries && countries.length > 0) {
        this.list.update(countries);
      }
    });
    this.model.listen(() => {
      const global = this.model.getWorldStatus();
      if (global && global.length > 0) {
        this.chart.update(global);
      }
    });

    // const example = {
    //   country: 'south-africa',
    //   cases: 'deaths',
    //   monthFrom: 3,
    //   monthTo: 4,
    // };
    // this.model.requestStatus(example);
    this.model.requestData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
