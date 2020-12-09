import create from './utils/create';

import model from './model/model';

import Example from './components/example';
// Это место пока по идее для сброки всего приложения в целом
// У меня примеров нет пока как можно еще красиво его соберать
export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.exp = new Example(); // Компонент для примера, который ждет пока ему придут данные

    model.listen(() => {
      const dayOneData = model.getFilteredData('countriesRoute');
      this.exp.update(dayOneData); // Тут мы ему говорим вот данные, кушай
    });

    this.model.requestData();
  }

  append = () => this.element;
}
