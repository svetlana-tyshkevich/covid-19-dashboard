import create from './utils/create';

import model from './model/model';

import List from './components/List';
import ChartBoard from './components/Chart';
import Table from './components/Table';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');

    this.chart = new ChartBoard('chart');

    this.chart = new Table('table');

    this.model.requestSummaryData();
    this.model.requestWorldStatus();
  }

  append = () => this.element;
}
