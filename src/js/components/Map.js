import mapboxgl from 'mapbox-gl';
import * as _ from 'lodash';
// import model from '../model/model';
import create from '../utils/create';
import BaseComponent from './BaseComponent';

export default class WorldMap extends BaseComponent {
  constructor(className) {
    super(className);
    this.mapBox = create({
      tagName: 'div',
      classNames: `${className}__inner`,
      dataAttr: [['id', 'mapBox']],
    });
    this.wrap.append(this.mapBox);
    this.isStarted = false;
    this.model.listen(() => {
      const countriesData = this.model.getSummaryData();
      if (!this.isStarted) {
        if (countriesData?.length > 0) {
          this.update(countriesData);
        }
      }
      const state = this.model.getState();
      if (!_.isEqual(this.state, state)) {
        const cases = state.case;

        this.setState(state);
        this.tabListener(cases);
      }
    });
  }

  createMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9hY2hidSIsImEiOiJja2lyNGFzOWEwa2JvMzBsM3hhMWR0cndtIn0.oNhrKokZtda7YPWk24DrAw';
    this.map = new mapboxgl.Map({
      container: 'mapBox',
      style: 'mapbox://styles/roachbu/ckir7pnl57ff717qvs68nrrvm',
      center: [53.9015, 27.566],
      zoom: 2,
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
    });
    this.map.getCanvas().style.cursor = 'default';

    this.map.on('load', () => {
      const geoJson = {
        type: 'FeatureCollection',
        features: this.data.map((country = {}) => {
          const { countryInfo } = country;
          const { lat, long: lng } = countryInfo;
          return {
            type: 'Feature',
            properties: {
              ...country,
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          };
        }),
      };

      this.map.addSource('countries', {
        type: 'geojson',
        data: geoJson,
      });

      this.createLegend(this.state.case);
      this.createCircleLayer(this.state.case);
    });

    this.map.on('mousemove', 'country-boundaries', (e) => {
      let resultString;
      const feature = this.model.getDataByCountry(
        e.features[0].properties.iso_3166_1,
      );
      if (!this.state.period && !this.state.abs) {
        if (this.state.case === 'cases') {
          resultString = `<div>${feature.cases || 0} cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${feature.deaths || 0} deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${feature.recovered || 0} recovered</div>`;
        }
      } else if (this.state.period && !this.state.abs) {
        if (this.state.case === 'cases') {
          resultString = `<div>${feature.todayCases || 0} cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${feature.todayDeaths || 0} deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${feature.todayRecovered || 0} recovered</div>`;
        }
      } else if (!this.state.period && this.state.abs) {
        if (this.state.case === 'cases') {
          resultString = `<div>${
            Math.trunc(feature.casesPerOneMillion / 10) || 0
          } cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${
            Math.trunc(feature.deathsPerOneMillion / 10) || 0
          } deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${
            Math.trunc(feature.recoveredPerOneMillion / 10) || 0
          } recovered</div>`;
        }
      } else if (this.state.period && this.state.abs) {
        if (this.state.case === 'cases') {
          resultString = `<div>${
            Math.trunc((feature.todayCases / feature.population) * 10000) || 0
          } cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${
            Math.trunc((feature.todayDeaths / feature.population) * 10000) || 0
          } deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${
            Math.trunc((feature.todayRecovered / feature.population) * 10000) || 0
          } recovered</div>`;
        }
      }

      const popupInner = `<div><strong>${e.features[0].properties.name_en}</strong></div>
          ${resultString}`;

      popup.setLngLat(e.lngLat).setHTML(popupInner).addTo(this.map);
      if (!e.features.length) {
        popup.remove();
      }
    });
  };

  createCircleLayer = (target) => {
    let range;
    if (target === 'deaths') {
      range = [
        'step',
        ['get', 'deaths'],
        '#fee5d9',
        500,
        '#fcbba1',
        1000,
        '#fc9272',
        5000,
        '#fb6a4a',
        10000,
        '#ef3b2c',
        20000,
        '#cb181d',
        50000,
        '#99000d',
      ];
    }
    if (target === 'cases') {
      range = [
        'step',
        ['get', 'cases'],
        '#eff3ff',
        10000,
        '#c6dbef',
        50000,
        '#9ecae1',
        100000,
        '#6baed6',
        200000,
        '#4292c6',
        500000,
        '#2171b5',
        1000000,
        '#084594',
      ];
    }
    if (target === 'recovered') {
      range = [
        'step',
        ['get', 'recovered'],
        '#edf8e9',
        5000,
        '#c7e9c0',
        10000,
        '#a1d99b',
        50000,
        '#74c476',
        100000,
        '#41ab5d',
        200000,
        '#238b45',
        500000,
        '#005a32',
      ];
    }

    this.map.removeLayer('country-circle');
    this.map.addLayer({
      id: 'country-circle',
      type: 'circle',
      source: 'countries',
      paint: {
        'circle-color': range,

        'circle-radius': 10,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#159',
      },
    });
  };

  createLegend = (indicator) => {
    let layers = [];
    let colors = [];
    if (indicator === 'cases') {
      layers = [
        '0-10K',
        '10K-50K',
        '50K-100K',
        '100K-200K',
        '200K-500K',
        '500K-1M',
        '1M+',
      ];
      colors = [
        '#eff3ff',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#084594',
      ];
    }
    if (indicator === 'deaths') {
      layers = [
        '0-500',
        '500-1K',
        '1K-5K',
        '5K-10K',
        '10K-20K',
        '20K-50K',
        '50K+',
      ];
      colors = [
        '#fee5d9',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#99000d',
      ];
    }
    if (indicator === 'recovered') {
      layers = [
        '0-5K',
        '5K-10K',
        '10K-50K',
        '50K-100K',
        '100K-200K',
        '200K-500K',
        '500K+',
      ];
      colors = [
        '#edf8e9',
        '#c7e9c0',
        '#a1d99b',
        '#74c476',
        '#41ab5d',
        '#238b45',
        '#005a32',
      ];
    }

    document.getElementById('legend').innerHTML = '';
    for (let i = 0; i < layers.length; i += 1) {
      const layer = layers[i];
      const color = colors[i];
      const item = document.createElement('div');
      const key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      const value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      document.getElementById('legend').appendChild(item);
    }
  };

  createString = (start, end) => {
    const capitalize = `${end.charAt(0).toUpperCase()}${end.slice(1)}`;
    return start + capitalize;
  };

  handleEvent = (event) => {
    const { target } = event;

    if (target === this.resizeButton) {
      this.fold();
    } else if (target?.dataset?.tab) {
      this.tabListener(target);
    } else if (target?.dataset?.country) {
      this.listListener(target);
    }
  };

  tabListener = (target) => {
    let element;
    if (typeof target === 'string') {
      element = this.tabItems.find((el) => el.dataset.tab === target);
    } else if (!target.closest('.active')) {
      element = target;
    }
    let cases;
    if (this.state.abs) {
      cases = `${element.dataset.tab}Per100k`;
      this.createCircleLayer(cases);
      this.createLegend(cases);
    } else if (this.state.period) {
      cases = this.createString('today', element.dataset.tab);
      this.createCircleLayer(cases);
      this.createLegend(cases);
    } else if (this.state.period && this.state.abs) {
      // Тут для обоих показателей сразу
      this.createCircleLayer(element.dataset.tab);
      this.createLegend(element.dataset.tab);
    } else {
      this.createCircleLayer(element.dataset.tab);
      this.createLegend(element.dataset.tab);
    }
    this.model.setState('case', element.dataset.tab);
    this.tabItems.forEach((el) => {
      el.classList.remove('active');
    });
    element.classList.add('active');
  };

  update = (data) => {
    this.data = [...data];
    if (!this.isStarted) {
      this.init();
      this.createMap();
      this.loaded();
    }
  };

  init = () => {
    this.isStarted = true;
    const tabs = [
      ['Confirmed', [['tab', 'cases']]],
      ['Recovered', [['tab', 'recovered']]],
      ['Deaths', [['tab', 'deaths']]],
    ];
    tabs.forEach((el) => {
      const [name, data] = el;
      this.addTab(name, data);
    });
    this.tabItems = [...this.tabs.children];
    const confirmed = this.tabItems[0];
    confirmed.classList.add('active');

    this.wrap.addEventListener('click', this.handleEvent);
  };
}
