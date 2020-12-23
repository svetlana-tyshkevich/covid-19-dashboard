import create from './utils/create';

import model from './model/model';
import { get } from './utils/storage';

import WorldMap from './components/Map';
import List from './components/List';
import ChartBoard from './components/Chart';
import Table from './components/Table';
import Search from './components/Search';
import Keyboard from './components/Keyboard';

export default class App {
  constructor() {
    this.element = create({ tagName: 'main', classNames: 'app' });

    this.model = model;

    this.list = new List('list');
    this.map = new WorldMap('map');
    this.chart = new ChartBoard('chart');
    this.table = new Table('table');
    this.search = new Search('search');

    (function upToDate() {
      const element = document.querySelector('.last__update');
      const date = new Date().toLocaleDateString('US-us');
      element.innerHTML = `<h3>Last updated: ${date}</h3>`;
    }());

    this.model.requestTotalStatus();
    this.model.requestSummaryData();
    this.model.requestWorldStatus();

    setTimeout(() => {
      this.createKeyboard();
    }, 0);
  }

  createKeyboard = () => {
    const rowsOrder = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash'],
      ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'IntlBackslash', 'Backspace'],
      ['ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowRight', 'Enter'],
    ];
    const lang = get('language', '"en"');
    const { input, keyboardBtn } = this.search;
    this.keyboard = new Keyboard(rowsOrder, input, keyboardBtn).init(lang).generateLayout();
  }

  append = () => this.element;
}
