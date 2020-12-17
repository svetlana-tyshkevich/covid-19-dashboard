import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import amThem from '@amcharts/amcharts4/themes/kelly';
import amAnimation from '@amcharts/amcharts4/themes/animated';
import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class ChartBoard extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.chart = create({ tagName: 'div', classNames: 'chart__box' });
    this.isStarted = false;
  }

  createChart = () => {
    am4core.useTheme(amThem);
    am4core.useTheme(amAnimation);

    this.sortedDate = this.sort(this.data, 'TotalConfirmed');

    const chart = am4core.create(this.chart, am4charts.XYChart);
    chart.paddingRight = 20;

    const data = [];
    // console.log(this.sortedDate.map((el) => el.TotalConfirmed));
    let visits = 10;
    for (let i = 1; i < 50000; i += 1) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), value: visits });
    }

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    chart.yAxes.push(new am4charts.ValueAxis());

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '{valueY}';
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.fillOpacity = 0.5;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    const scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    this.wrap.append(this.chart);
  }

  handleEvent = (event) => {
    const { target } = event;

    if (target === this.resizeButton) {
      this.fold();
    }
  }

  update = (data) => {
    this.data = Array.from(data);
    if (!this.isStarted) {
      this.init();
      this.createChart();
      this.loaded();
    }
  }

  init = () => {
    this.isStarted = true;
    this.wrap.addEventListener('click', this.handleEvent);
  }
}
