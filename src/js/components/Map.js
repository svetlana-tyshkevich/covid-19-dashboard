/* eslint-disable no-undef */
import model from '../model/model';
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

    this.model = model;
    this.state = 'deaths';
  }

  createMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9hY2hidSIsImEiOiJja2lyNGFzOWEwa2JvMzBsM3hhMWR0cndtIn0.oNhrKokZtda7YPWk24DrAw';
    const map = new mapboxgl.Map({
      container: 'mapBox',
      style: 'mapbox://styles/roachbu/ckir7pnl57ff717qvs68nrrvm',
      center: [53.9015, 27.566],
      zoom: 2,
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
    });
    map.getCanvas().style.cursor = 'default';

    map.on('load', () => {
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

      console.log(geoJson);

      map.addSource('countries', {
        type: 'geojson',
        data: geoJson,
      });

      let range;
      if (this.state === 'deaths') {
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
      if (this.state === 'cases') {
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
      if (this.state === 'recovered') {
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

      map.addLayer({
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
      const getLegend = (indicator) => {
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
      getLegend(this.state);
    });

    map.on('mousemove', 'country-boundaries', (e) => {
      let popupInner;
      if (this.state === 'cases') {
        popupInner = `<div><strong>${
          e.features[0].properties.name_en
        }</strong></div>
          <div>${
            this.model.getDataByCountry(e.features[0].properties.iso_3166_1)
              .cases || 0
          } cases</div>`;
      }
      if (this.state === 'deaths') {
        popupInner = `<div><strong>${
          e.features[0].properties.name_en
        }</strong></div>
          <div>${
            this.model.getDataByCountry(e.features[0].properties.iso_3166_1)
              .deaths || 0
          } deaths</div>`;
      }
      if (this.state === 'recovered') {
        popupInner = `<div><strong>${
          e.features[0].properties.name_en
        }</strong></div>
          <div>${
            this.model.getDataByCountry(e.features[0].properties.iso_3166_1)
              .recovered || 0
          } recovered</div>`;
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          popupInner,
        )
        .addTo(map);
      if (!e.features.length) {
        popup.remove();
      }
    });
  }

  handleEvent = (event) => {
    const { target } = event;

    if (target === this.resizeButton) {
      this.fold();
    }
  };

  update = (data) => {
    this.data = [...data];
    this.init();
    this.createMap();
    this.loaded();
  };

  init = () => {
    this.wrap.addEventListener('click', this.handleEvent);
  };
}
