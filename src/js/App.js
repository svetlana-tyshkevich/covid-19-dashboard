import create from './utils/create';

import model from './model/model';

import Table from './components/Table';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.table = new Table('table');
    this.table.init();

    this.model.listen(() => {
      const countries = this.model.getCountriesStatus();
      this.table.update(countries);
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
