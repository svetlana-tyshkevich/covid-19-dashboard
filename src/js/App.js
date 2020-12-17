import create from './utils/create';
// import * as objectUtils from './utils/objectUtils';

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
      const countries = this.model.getSummaryData();
      if (countries && countries.length > 0) {
        this.list.update(countries);
      }

      const global = this.model.getWorldStatus();
      this.chart.update(global);

      // Просто тест
      // const updated = objectUtils.compareObjects(this.list.state, this.model.state);
    });

    this.model.requestSummaryData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
