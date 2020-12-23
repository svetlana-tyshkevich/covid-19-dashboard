import * as _ from 'lodash';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import amThem from '@amcharts/amcharts4/themes/dark';
import amAnimation from '@amcharts/amcharts4/themes/animated';
import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class ChartBoard extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.chartBox = create({ tagName: 'div', classNames: 'chart__box', parent: this.wrap });
    this.isStarted = false;
    this.isChartOn = false;
    this.isWaiting = false;
    this.isLoading = false;

    this.model.listen(() => {
      if (!this.isStarted) {
        const data = this.model.getWorldStatus();
        if (!data || data.length === 0) {
          this.isStarted = false;
          this.model.requestWorldStatus();
        } else {
          this.update(data);
        }
      }

      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        const stateCountryCode = state.country;

        if (stateCountryCode !== 'global') {
          if (!this.isWaiting) {
            this.isWaiting = true;
            this.model.requestCountryStatus(stateCountryCode);
          } else {
            this.isWaiting = false;
            const { timeline } = this.model.getCountryDaily();
            this.setState(state);
            this.update(timeline);
          }
        } else {
          const data = this.model.getWorldStatus();
          this.setState(state);
          this.update(data);
        }
      }
    });
  }

  toDeily = (cases) => {
    const data = [...this.createData(cases)];
    const simularData = [...this.createData(cases)];
    const result = [];
    data.forEach((el, ind) => {
      const val = el.value;
      const prevValue = simularData[ind - 1]?.value || 0;
      let num = val - prevValue;
      if (num < 0) { num = Math.abs(num) / 10; }
      result.push({ date: el.date, value: num });
    });
    return result;
  }

  createData = (cases) => {
    const category = this.data[cases];
    const arrayFromCases = Object.keys(category);
    const data = arrayFromCases.reduce((acc, el) => {
      const strToDate = el.split('/');
      const [mounth, day, year] = strToDate;
      const dateItem = new Date(+`20${year}`, (mounth - 1), day);
      acc.push({ date: dateItem, value: category[el] });
      return acc;
    }, []);
    return data;
  }

  setColor = (cases) => {
    const blue = '#2493f2';
    const green = '#70a800';
    const red = '#e60000';
    let color = '';
    if (cases === 'recovered') {
      color = green;
    } else if (cases === 'cases') {
      color = blue;
    } else if (cases === 'deaths') {
      color = red;
    }
    return color;
  }

  createChart = (cases) => {
    setTimeout(() => {
      this.isChartOn = true;
      am4core.useTheme(amThem);
      am4core.useTheme(amAnimation);

      this.chart = am4core.create(this.chartBox, am4charts.XYChart);
      this.chart.paddingRight = 20;

      const color = this.setColor(cases);
      this.chart.colors.list = [
        am4core.color(color),
      ];

      let data;
      if (!Array.isArray(this.data)) {
        data = this.createData(cases);
      } else {
        data = this.data;
      }
      this.chart.data = data;

      const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      this.chart.yAxes.push(new am4charts.ValueAxis());
      const series = this.chart.series.push(new am4charts.LineSeries());
      this.chart.cursor = new am4charts.XYCursor();

      // Settings
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.minZoomCount = 5;
      dateAxis.groupData = true;
      dateAxis.groupCount = 500;
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'value';
      series.tooltipText = '{valueY}';
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.background.fillOpacity = 0.5;
      series.strokeWidth = 3;
      series.fillOpacity = 0.5;

      this.chart.cursor.xAxis = dateAxis;

      setTimeout(() => {
        this.isLoading = false;
      }, 0);
    }, 0);
  }

  updateChart = (cases) => {
    if (this.isChartOn) {
      setTimeout(() => {
        this.chart.dispose();
        this.createChart(cases);
      }, 0);
    }
  }

  handleEvent = (event) => {
    const { target } = event;
    const positonActive = _.findIndex(this.tabItems, (el) => el.closest('.active')) || 0;
    const prev = (positonActive > 0)
      ? this.tabItems[positonActive - 1]
      : this.tabItems[this.tabItems.length - 1];
    const next = positonActive < this.tabItems.length - 1
      ? this.tabItems[positonActive + 1]
      : this.tabItems[0];
    if (target === this.resizeButton) {
      this.fold();
    } else if (target?.dataset?.tab) {
      this.tabListener(target);
    } else if (target.dataset.arrow === 'left') {
      this.tabListener(prev);
    } else if (target.dataset.arrow === 'right') {
      this.tabListener(next);
    } else if (target?.dataset?.reset) {
      setTimeout(() => {
        this.model.setState('country', 'global');
      }, 0);
    }
  }

  tabListener = (target) => {
    if (!this.isLoading) {
      this.isLoading = true;
      let element;
      if (typeof target === 'string') {
        element = this.tabItems.find((el) => el.dataset.tab === target);
      } else {
        element = target;
      }
      setTimeout(() => {
        this.updateChart(element.dataset.tab);
        this.model.setState('case', element.dataset.tab);
      }, 0);
      this.tabItems.forEach((el) => {
        el.classList.remove('active');
      });
      element.classList.add('active');
    }
  }

  perTausend = (array) => {
    const { country } = this.state;
    let people = 0;
    if (country === 'global') {
      people = 7800000000;
    } else {
      const allData = this.model.getSummaryData();
      const countryFind = allData.find((el) => el.countryInfo.iso2 === country);
      const { population } = countryFind;
      people = population;
    }
    const data = [];
    const per = 100000;
    array.forEach((item) => {
      const { value } = item;
      const num = Math.floor((value / people) * per);
      data.push({ date: item.date, value: num });
    });
    return data;
  }

  update = (data) => {
    if (!this.isStarted) {
      this.isStarted = true;
      this.init();
    }
    this.data = data;
    this.createChart(this.state.case);
    const cases = this.state.case;
    const { period, abs } = this.state;
    if (period && abs) {
      const daily = this.toDeily(cases);
      const dailyPer100k = this.perTausend(daily);
      this.data = dailyPer100k;
    } else if (period) {
      this.data = this.toDeily(cases);
    } else if (abs) {
      const dataPer100k = this.perTausend(this.createData(cases));
      this.data = dataPer100k;
    }
    this.tabListener(cases);
  }

  init = () => {
    this.isStarted = true;
    const tabs = [
      ['Confirmed', [['tab', 'cases']]],
      ['Recovered', [['tab', 'recovered']]],
      ['Deaths', [['tab', 'deaths']]],
      ['Global data', [['reset', 'global']]],
    ];
    tabs.forEach((el) => {
      const [name, data] = el;
      this.addTab(name, data);
    });
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
    this.loaded();
  }
}
