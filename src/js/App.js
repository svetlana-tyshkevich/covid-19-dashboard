import create from './utils/create';

import model from './model/model';

import WorldMap from './components/Map';

import List from './components/List';
import ChartBoard from './components/Chart';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');
    this.map = new WorldMap('map');

    this.chart = new ChartBoard('chart');

    // this.model.listen(() => {
    //   const countries = this.model.getSummaryData();
    //   if (countries && countries.length > 0) {
    //     this.list.update(countries);
    //     this.map.update(countries);
    //   }
    // });
    // this.model.listen(() => {
    //   const global = this.model.getWorldStatus();
    //   if (global && global.length > 0) {
    // this.chart.update(global);
    //   }
    // });

    this.model.requestSummaryData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
