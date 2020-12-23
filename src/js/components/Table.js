import * as _ from 'lodash';

import create from '../utils/create';

import BaseComponent from './BaseComponent';

export default class Table extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.isStarted = false;

    this.model.listen(() => {
      let data = this.model.getSummaryData();
      if (!this.isStarted) {
        this.update(data);
      }

      // const state = this.model.getState();
      // if (!_.isEqual(this.state, state)) {
      //   this.update();
      // }

      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        const stateCountryCode = state.country;

        if (stateCountryCode !== 'global') {
          data = this.model.requestCountryStatus(stateCountryCode);
          this.setState(state);
          this.update(data);
        } else {
          this.setState(state);
          this.update(data);
        }
      }
    });
    this.tableCaption = document.getElementById('table-caption');
    this.tableConfirmed = document.getElementById('table-confirmed');
    this.tableRecovered = document.getElementById('table-recovered');
    this.tableDeaths = document.getElementById('table-deaths');
  }

 setTableInfo = () => {
   // if (this.state.country === 'global') {
   //   this.tableCaption.textContent = 'World';
   console.log(this.data);
   //   this.tableConfirmed.textContent = data.cases[dateItem];
   //   this.tableRecovered.textContent = data.recovered;
   //   this.tableDeaths.textContent = data.death;
   // }
 }

  update = (data) => {
    if (!this.isStarted) {
      this.isStarted = true;
      this.init();
    }
    this.data = data;
    console.log(this.data);
    this.setTableInfo();
    console.log(this.model.getTotalStatus());
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
    this.wrap.prepend(this.periodCheck, this.absCheck);

    this.wrap.addEventListener('click', this.handleEvent);
    this.loaded();
  }
}
