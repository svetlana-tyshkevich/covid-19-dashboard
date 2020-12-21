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

      map.addLayer({
        id: 'country-circle',
        type: 'circle',
        source: 'countries',
        paint: {
          'circle-color': [
            'step',
            ['get', 'cases'],
            '#fee5d9',
            5000,
            '#fcbba1',
            10000,
            '#fc9272',
            50000,
            '#fb6a4a',
            100000,
            '#ef3b2c',
            200000,
            '#cb181d',
            500000,
            '#99000d',
          ],

          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#159',
        },
      });
      const layers = [
        '0-5K',
        '5K-10K',
        '10K-50K',
        '50K-100K',
        '100K-200K',
        '200K-500K',
        '500K+',
      ];
      const colors = [
        '#fee5d9',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#99000d',
      ];

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

      const boundaries = map.queryRenderedFeatures({
        layers: ['country-boundaries'],
      });
      console.log(boundaries);
    });

    map.on('mousemove', 'country-boundaries', (e) => {
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div><strong>${e.features[0].properties.name_en}</strong></div>
          <div>${
            this.model.getDataByCountry(e.features[0].properties.iso_3166_1)
              .cases || 0
          } cases</div>`,
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
