// Тут код просто для примера в консоль
export default class Example {
  constructor() {
    this.data = null;
  }

  update = (data) => {
    this.data = data;
    console.log('data is:', this.data);
  }
}
