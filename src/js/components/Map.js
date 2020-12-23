import mapboxgl from 'mapbox-gl';
import * as _ from 'lodash';
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
        const { period, abs, country } = state;

        if (country !== this.state.country) {
          this.setState(state);
          this.flyToCountry(this.state.country);
        } else if (cases !== this.state.case) {
          this.setState(state);
          this.tabListener(cases);
          this.mapListener(country);
        }

        if (period !== this.state.period || abs !== this.state.abs) {
          this.setState(state);
          this.tabListener(cases);
          this.mapListener(country);
        }
      }
    });
  }

  createMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9hY2hidSIsImEiOiJja2lyNGFzOWEwa2JvMzBsM3hhMWR0cndtIn0.oNhrKokZtda7YPWk24DrAw';
    this.map = new mapboxgl.Map({
      container: 'mapBox',
      style: 'mapbox://styles/roachbu/ckir7pnl57ff717qvs68nrrvm',
      center: [53.9015, 27.566],
      zoom: 0,
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
    });
    this.map.getCanvas().style.cursor = 'default';

    this.map.on('load', () => {
      this.map.resize();

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
          resultString = `<div>${feature.casesPer100k || 0} cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${feature.deathsPer100k || 0} deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${
            feature.recoveredPer100k || 0
          } recovered</div>`;
        }
      } else if (this.state.period && this.state.abs) {
        if (this.state.case === 'cases') {
          resultString = `<div>${feature.todayCasesPer100k || 0} cases</div>`;
        }
        if (this.state.case === 'deaths') {
          resultString = `<div>${feature.todayDeathsPer100k || 0} deaths</div>`;
        }
        if (this.state.case === 'recovered') {
          resultString = `<div>${
            feature.todayRecoveredPer100k || 0
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

    this.map.on('click', 'country-boundaries', (e) => {
      const feature = e.features[0].properties.iso_3166_1;
      this.mapListener(feature);
    });
  };

  flyToCountry = (target) => {
    if (target !== 'global') {
      const country = this.data.find((item) => item.countryInfo.iso2 === target);
      this.map.flyTo({
        center: [country.countryInfo.long, country.countryInfo.lat],
        essential: true,
        zoom: 3,
      });
    } else {
      this.map.zoomTo(0, { duration: 2000 });
    }
  };

  createCircleLayer = (target) => {
    let range;
    if (target === 'deaths') {
      range = [
        'step', ['get', 'deaths'], '#fee5d9', 500, '#fcbba1', 1000, '#fc9272', 5000, '#fb6a4a', 10000, '#ef3b2c', 20000, '#cb181d', 50000, '#99000d',
      ];
    }
    if (target === 'cases') {
      range = [
        'step', ['get', 'cases'], '#eff3ff', 10000, '#c6dbef', 50000, '#9ecae1', 100000, '#6baed6', 200000, '#4292c6', 500000, '#2171b5', 1000000, '#084594',
      ];
    }
    if (target === 'recovered') {
      range = [
        'step',
        ['get', 'recovered'],
        '#edf8e9', 5000, '#c7e9c0', 10000, '#a1d99b', 50000, '#74c476', 100000, '#41ab5d', 200000, '#238b45', 500000, '#005a32',
      ];
    }
    if (target === 'todayDeaths') {
      range = [
        'step',
        ['get', 'todayDeaths'],
        '#fee5d9', 100, '#fcbba1', 300, '#fc9272', 500, '#fb6a4a', 800, '#ef3b2c', 1200, '#cb181d', 1500, '#99000d',
      ];
    }
    if (target === 'todayCases') {
      range = [
        'step',
        ['get', 'todayCases'],
        '#eff3ff', 200, '#c6dbef', 500, '#9ecae1', 1000, '#6baed6', 5000, '#4292c6', 10000, '#2171b5', 30000, '#084594',
      ];
    }
    if (target === 'todayRecovered') {
      range = [
        'step',
        ['get', 'todayRecovered'],
        '#edf8e9', 200, '#c7e9c0', 500, '#a1d99b', 1000, '#74c476', 5000, '#41ab5d', 10000, '#238b45', 30000, '#005a32',
      ];
    }
    if (target === 'deathsPer100k') {
      range = [
        'step',
        ['get', 'deathsPer100k'],
        '#fee5d9', 5, '#fcbba1', 10, '#fc9272', 20, '#fb6a4a', 50, '#ef3b2c', 80, '#cb181d', 100, '#99000d',
      ];
    }
    if (target === 'casesPer100k') {
      range = [
        'step',
        ['get', 'casesPer100k'],
        '#eff3ff', 50, '#c6dbef', 200, '#9ecae1', 500, '#6baed6', 1000, '#4292c6', 3000, '#2171b5', 5000, '#084594',
      ];
    }
    if (target === 'recoveredPer100k') {
      range = [
        'step',
        ['get', 'recoveredPer100k'],
        '#edf8e9', 50, '#c7e9c0', 200, '#a1d99b', 500, '#74c476', 1000, '#41ab5d', 3000, '#238b45', 5000, '#005a32',
      ];
    }
    if (target === 'todayDeathsPer100k') {
      range = [
        'step',
        ['get', 'todayDeathsPer100k'],
        '#fee5d9', 0.1, '#fcbba1', 0.3, '#fc9272', 0.6, '#fb6a4a', 1.0, '#ef3b2c', 1.4, '#cb181d', 1.8, '#99000d',
      ];
    }
    if (target === 'todayCasesPer100k') {
      range = [
        'step',
        ['get', 'todayCasesPer100k'],
        '#eff3ff', 2, '#c6dbef', 5, '#9ecae1', 10, '#6baed6', 25, '#4292c6', 50, '#2171b5', 100, '#084594',
      ];
    }
    if (target === 'todayRecoveredPer100k') {
      range = [
        'step',
        ['get', 'todayRecoveredPer100k'],
        '#edf8e9', 2, '#c7e9c0', 5, '#a1d99b', 10, '#74c476', 25, '#41ab5d', 50, '#238b45', 100, '#005a32',
      ];
    }

    if (this.map.getLayer('country-circle')) {
      this.map.removeLayer('country-circle');
    }

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
    if (
      indicator === 'cases'
      || indicator === 'todayCases'
      || indicator === 'casesPer100k'
      || indicator === 'todayCasesPer100k'
    ) {
      colors = [
        '#eff3ff',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#084594',
      ];

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
      }
      if (indicator === 'todayCases') {
        layers = [
          '0-200',
          '200-500',
          '500-1K',
          '1K-5K',
          '5K-10K',
          '10K-30K',
          '30K+',
        ];
      }
      if (indicator === 'casesPer100k') {
        layers = [
          '0-50',
          '50-200',
          '200-500',
          '500-1K',
          '1K-3K',
          '3K-5K',
          '5K+',
        ];
      }
      if (indicator === 'todayCasesPer100k') {
        layers = ['0-2', '2-5', '5-10', '10-25', '25-50', '50-100', '100+'];
      }
    }
    if (
      indicator === 'deaths'
      || indicator === 'todayDeaths'
      || indicator === 'deathsPer100k'
      || indicator === 'todayDeathsPer100k'
    ) {
      colors = [
        '#fee5d9',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#99000d',
      ];
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
      }
      if (indicator === 'todayDeaths') {
        layers = [
          '0-100',
          '100-00',
          '300-500',
          '500-800',
          '800-1.2K',
          '1.2K-1.5K',
          '1.5K+',
        ];
      }
      if (indicator === 'todayDeathsPer100k') {
        layers = [
          '0-0.1',
          '0.1-0.3',
          '0.3-0.6',
          '0.6-1',
          '1-1.4K',
          '1.4-1.8',
          '1.8+',
        ];
      }
      if (indicator === 'deathsPer100k') {
        layers = ['0-5', '5-10', '10-20', '20-50', '50-80', '80-100', '100+'];
      }
    }
    if (
      indicator === 'recovered'
      || indicator === 'todayRecovered'
      || indicator === 'recoveredPer100k'
      || indicator === 'todayRecoveredPer100k'
    ) {
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
    }
    if (indicator === 'todayRecovered') {
      layers = [
        '0-200',
        '200-500',
        '500-1K',
        '1K-5K',
        '5K-10K',
        '10K-30K',
        '30K+',
      ];
    }
    if (indicator === 'recoveredPer100k') {
      layers = ['0-50', '50-200', '200-500', '500-1K', '1K-3K', '3K-5K', '5K+'];
    }
    if (indicator === 'todayRecoveredPer100k') {
      layers = ['0-2', '2-5', '5-10', '10-25', '25-50', '50-100', '100+'];
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
      this.map.resize();
    } else if (target?.dataset?.tab) {
      this.tabListener(target);
    } else if (target?.properties?.iso_3166_1) {
      this.mapListener(target);
    }
  };

  mapListener = (target) => {
    if (target !== 'global') {
      this.flyToCountry(target);
      this.model.setState('country', target);
    } else {
      this.map.zoomTo(0, { duration: 2000 });
    }
  };

  tabListener = (target) => {
    let element;
    if (typeof target === 'string') {
      element = this.tabItems.find((el) => el.dataset.tab === target);
    } else if (!target.closest('.active')) {
      element = target;
    }
    let newCases;
    if (this.state.abs && this.state.period) {
      newCases = `${this.createString('today', this.state.case)}Per100k`;
      this.createCircleLayer(newCases);
      this.createLegend(newCases);
    } else if (this.state.abs) {
      newCases = `${this.state.case}Per100k`;
      this.createCircleLayer(newCases);
      this.createLegend(newCases);
    } else if (this.state.period) {
      newCases = this.createString('today', this.state.case);
      this.createCircleLayer(newCases);
      this.createLegend(newCases);
    } else {
      this.createCircleLayer(this.state.case);
      this.createLegend(this.state.case);
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
    this.map.on('load', () => {
      this.createLegend(this.state.case);
      this.createCircleLayer(this.state.case);
    });
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
