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

    this.model.components.push(
      this.list,
      this.chart,
    );

    this.model.listen(() => {
      const countries = this.model.getSummaryData();
      const modelState = this.model.getState();
      if (countries?.length > 0) {
        this.list.update({ data: countries, state: modelState });
      }

      const global = this.model.getWorldStatus();
      this.chart.update({ data: global, state: modelState });
    });

    this.model.requestSummaryData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
