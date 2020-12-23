import * as _ from 'lodash';

import create from '../utils/create';

import BaseComponent from './BaseComponent';

export default class Table extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.isStarted = false;

    this.model.listen(() => {
      if (!this.isStarted) {
        const data = this.model.getWorldStatus();
        this.update(data);
      }
      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        this.update();
      }
    });
  }

  createTable = () => {
    this.table = create({
      tagName: 'table',
    });
    this.table.innerHTML = `<caption id="table-caption">World</caption>
    <tr>
      <td id="table-confirmed">Confirmed</td>
      <td></td>
    </tr>
    <tr>
      <td id="table-recovered">Recovered</td>
      <td></td>
    </tr>
    <tr>
      <td id="table-deaths">Deaths</td>
      <td></td>
    </tr>`;

    this.wrap.append(this.table);
  }

  update = (data) => {
    if (!this.isStarted) {
      this.isStarted = true;
      this.init();
    }
    this.data = data;
  }

  handleEvent = (event) => {
    const { target } = event;
    if (target === this.periodCheck) {
      const check = this.periodCheck.checked;
      this.model.setState('period', check);
    } else if (target === this.absCheck) {
      const check = this.absCheck.checked;
      this.model.setState('abs', check);
    }
  }

  init = () => {
    this.periodCheck = create({
      tagName: 'input',
      classNames: 'checkbox period',
      dataAttr: [['type', 'checkbox']],
    });
    this.absCheck = create({
      tagName: 'input',
      classNames: 'checkbox abs',
      dataAttr: [['type', 'checkbox']],
    });
    this.wrap.append(this.periodCheck, this.absCheck);
    this.createTable();

    this.wrap.addEventListener('click', this.handleEvent);
    this.loaded();
  }
}
