import create from './utils/create';

import model from './model/model';

import Example from './components/example';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.exp = new Example(); // Компонент для примера, который ждет пока ему придут данные

    this.model.listen(() => {
      const dayOneData = this.model.getStatus();
      this.exp.update(dayOneData); // Тут мы ему говорим вот данные, кушай
    });

    const example = {
      country: 'south-africa',
      cases: 'deaths',
      monthFrom: 3,
      monthTo: 4,
    };
    this.model.requestStatus(example);
    this.model.requestData();
  }

  append = () => this.element;
}
