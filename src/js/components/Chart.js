import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import amThem from '@amcharts/amcharts4/themes/dark';
// import amThem from '@amcharts/amcharts4/themes/amchartsdark';
import amAnimation from '@amcharts/amcharts4/themes/animated';
import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class ChartBoard extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.chartBox = create({ tagName: 'div', classNames: 'chart__box', parent: this.wrap });
    this.isStarted = false;
    this.isChartOn = false;
  }

  createDate = (cases) => {
    const category = this.data[cases];
    const arrayFromCases = Object.keys(category);
    const data = arrayFromCases.reduce((acc, el) => {
      const strToDate = el.split('/');
      const [mounth, day, year] = strToDate;
      const dateItem = new Date(+`20${year}`, mounth, day);
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
    this.isChartOn = true;
    am4core.useTheme(amThem);
    am4core.useTheme(amAnimation);

    this.chart = am4core.create(this.chartBox, am4charts.XYChart);
    this.chart.paddingRight = 20;

    const color = this.setColor(cases);
    this.chart.colors.list = [
      am4core.color(color),
    ];

    const data = this.createDate(cases);
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
  }

  updateChart = (cases) => {
    if (this.isChartOn) {
      this.chart.dispose();
      this.createChart(cases);
    }
  }

  handleEvent = (event) => {
    const { target } = event;
    const [confirmed, recovered, deaths] = this.tabItems;

    if (target === this.resizeButton) {
      this.fold();
    } else if (target === recovered) {
      this.tabListener(target);
    } else if (target === confirmed) {
      this.tabListener(target);
    } else if (target === deaths) {
      this.tabListener(target);
    }
  }

  tabListener = (target) => {
    if (!target.closest('.active')) {
      this.updateChart(target.dataset.tab);
    }
    this.tabItems.forEach((el) => {
      el.classList.remove('active');
    });
    target.classList.add('active');
  }

  update = ({ data, state }) => {
    this.data = data;
    if (!this.isStarted) {
      this.init();
      this.createChart('cases');
      this.loaded();
      return;
    }
    if (this.state.case !== 'global' && this.model.state.country) {
      const { timeline } = this.model.getCountryDaily();
      this.data = timeline;
      this.updateChart(this.state.case);
      this.model.requestCountryStatus(state.country);
    }
    this.state = state;
  }

  listen = () => {
    // Если нужно будет менять состояние табов
    //  else if (newState?.case !== this.state.case) {
    //   const tab = this.tabItems.find((el) => el.dataset.tab === newState.case);
    //   this.tabItems.forEach((el) => {
    //     el.classList.remove('active');
    //   });
    //   tab.classList.add('active');
    //   this.updateChart(newState.case);
    // }
  }

  init = () => {
    this.isStarted = true;
    this.addTab('Confirmed', 'cases');
    this.addTab('Recovered', 'recovered');
    this.addTab('Deaths', 'deaths');
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
  }
}
