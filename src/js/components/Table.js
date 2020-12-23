import * as _ from 'lodash';

import BaseComponent from './BaseComponent';

export default class Table extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.isStarted = false;

    this.model.listen(() => {
      if (!this.isStarted) {
        const data = this.model.getTotalStatus();
        if (!data || data.length === 0) {
          this.isStarted = false;
          this.model.requestTotalStatus();
        } else {
          this.update(data);
        }
      }
      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        const stateCountryCode = state.country;
        let data = this.model.getTotalStatus();

        if (stateCountryCode !== 'global') {
          data = this.model.getDataByCountry(stateCountryCode);
          this.setState(state);
          this.update(data);
        } else {
          this.setState(state);
          this.update(data);
        }
      }
    });
  }

 setTableInfo = (data) => {
   if (this.state.country === 'global') {
     this.tableCaption.textContent = 'World';
     if (this.state.abs && this.state.period) {
       this.tableConfirmed.textContent = ((data.todayCases / data.population) * 100000).toFixed(2);
       this.tableRecovered.textContent = (
         (data.todayRecovered / data.population)
         * 100000
       ).toFixed(2);
       this.tableDeaths.textContent = (
         (data.todayDeaths / data.population)
         * 100000
       ).toFixed(2);
     } else if (this.state.abs && !this.state.period) {
       this.tableConfirmed.textContent = Math.trunc(data.casesPerOneMillion / 10);
       this.tableRecovered.textContent = Math.trunc(
         data.recoveredPerOneMillion / 10,
       );
       this.tableDeaths.textContent = Math.trunc(data.deathsPerOneMillion / 10);
     } else if (!this.state.abs && this.state.period) {
       this.tableConfirmed.textContent = data.todayCases;
       this.tableRecovered.textContent = data.todayRecovered;
       this.tableDeaths.textContent = data.todayDeaths;
     } else {
       this.tableConfirmed.textContent = data.cases;
       this.tableRecovered.textContent = data.recovered;
       this.tableDeaths.textContent = data.deaths;
     }
   } else {
     this.tableCaption.textContent = data.country;
     if (this.state.abs && this.state.period) {
       this.tableConfirmed.textContent = data.todayCasesPer100k;
       this.tableRecovered.textContent = data.todayRecoveredPer100k;
       this.tableDeaths.textContent = data.todayDeathsPer100k;
     } else if (this.state.abs && !this.state.period) {
       this.tableConfirmed.textContent = data.casesPer100k;
       this.tableRecovered.textContent = data.recoveredPer100k;
       this.tableDeaths.textContent = data.deathsPer100k;
     } else if (!this.state.abs && this.state.period) {
       this.tableConfirmed.textContent = data.todayCases;
       this.tableRecovered.textContent = data.todayRecovered;
       this.tableDeaths.textContent = data.todayDeaths;
     } else {
       this.tableConfirmed.textContent = data.cases;
       this.tableRecovered.textContent = data.recovered;
       this.tableDeaths.textContent = data.deaths;
     }
   }
 }

  update = (data) => {
    if (!this.isStarted) {
      this.isStarted = true;
      this.init();
    }
    this.data = data;
    this.setTableInfo(this.data);
  }

  handleEvent = (event) => {
    const { target } = event;
    if (target === this.resizeButton) {
      this.fold();
    } else if (target === this.periodCheck) {
      const check = this.periodCheck.checked;
      this.model.setState('period', check);
    } else if (target === this.absCheck) {
      const check = this.absCheck.checked;
      this.model.setState('abs', check);
    }
  }

  init = () => {
    this.tableCaption = document.getElementById('table-caption');
    this.tableConfirmed = document.getElementById('table-confirmed');
    this.tableRecovered = document.getElementById('table-recovered');
    this.tableDeaths = document.getElementById('table-deaths');
    this.periodCheck = document.getElementById('checkbox-period');
    this.absCheck = document.getElementById('checkbox-abs');

    this.wrap.addEventListener('click', this.handleEvent);
    this.loaded();
  }
}
