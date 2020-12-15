import Chart from 'chart.js';
import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class ChartBoard extends BaseComponent {
  constructor(cssClass) {
    super(cssClass);
    this.canvas = create({
      tagName: 'canvas',
      classNames: 'chart',
    });
    this.ctx = this.canvas.getContext('2d');
    this.wrap.append(this.canvas);

    this.isStarted = false;
  }

  settings = () => {
    const data = this.data.map((el) => el.TotalConfirmed);
    const config = {
      type: 'line',
      data: {
        labels: [...data],
        datasets: [this.changeDatasets()],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
    return config;
  }

  changeDatasets = () => {
    this.sort(this.data, 'TotalConfirmed');
    const data = this.data.map((el) => el.TotalConfirmed);
    const dataset = {
      label: 'Confirmed: ',
      data: [...data],
      backgroundColor: [
        // 'rgba(255, 99, 132, 0.2)',
        // 'rgba(54, 162, 235, 0.2)',
        // 'rgba(255, 206, 86, 0.2)',
        // 'rgba(75, 192, 192, 0.2)',
        // 'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        // 'rgba(255, 99, 132, 1)',
        // 'rgba(54, 162, 235, 1)',
        // 'rgba(255, 206, 86, 1)',
        // 'rgba(75, 192, 192, 1)',
        // 'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    };
    return dataset;
  }

  createChart = () => {
    this.chart = new Chart(this.ctx, this.settings());
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
