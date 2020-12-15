import create from './utils/create';

import model from './model/model';

import List from './components/List';
import ChartBoard from './components/Chart';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');
    this.list.init();

    this.chart = new ChartBoard('chart');
    this.chart.init();

    this.model.listen(() => {
      const countries = this.model.getCountriesStatus();
      this.list.update(countries);
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
