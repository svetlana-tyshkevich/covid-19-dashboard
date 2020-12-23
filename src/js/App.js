import create from './utils/create';

import model from './model/model';

import WorldMap from './components/Map';
import List from './components/List';
import ChartBoard from './components/Chart';
import Table from './components/Table';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');
    this.map = new WorldMap('map');
    this.chart = new ChartBoard('chart');

    this.table = new Table('table');

    this.model.listen(() => {
      const countries = this.model.getSummaryData();
      if (countries && countries.length > 0) {
        this.map.update(countries);
      }
    });

    this.model.requestSummaryData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
