/* eslint-disable new-cap */
/* eslint-disable no-undef */
import model from '../model/model';
import create from '../utils/create';
import BaseComponent from './BaseComponent';
// import polygones from '../utils/polygones.json';

export default class WorldMap extends BaseComponent {
  constructor(className) {
    super(className);
    this.mapBox = create({
      tagName: 'div',
      classNames: `${className}__inner`,
      dataAttr: ['id', 'mapBox'],
    });
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

    map.on('load', () => {
      const layers = [
        '0-10K',
        '10K-50K',
        '50K-100K',
        '100K-200K',
        '200K-500K',
        '500K+',
      ];
      const colors = [
        '#FFEDA0',
        '#FEB24C',
        '#FD8D3C',
        '#FC4E2A',
        '#E31A1C',
        '#bd0505',
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
    });

    map.on('mousemove', (e) => {
      const boundaries = map.queryRenderedFeatures(e.point, {
        layers: ['country-boundaries'],
      });

      if (boundaries.length > 0) {
        document.getElementById('pd').innerHTML = `<h3><strong>${
          boundaries[0].properties.name_en
        }</strong></h3><p><strong><em>${
          this.model.getDataByCountryCode(boundaries[0].properties.iso_3166_1)
            .TotalConfirmed
        }</strong> cases</em></p>`;
      } else {
        document.getElementById('pd').innerHTML = '<p>Hover over a country!</p>';
      }
    });

    // const map = new L.map('mapBox').setView([53.9015, 27.566], 3);

    // L.tileLayer(
    //   'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    //   {
    //     maxZoom: 18,
    //     attribution:
    //       'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, '
    //       + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     id: 'mapbox/light-v9',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //   },
    // ).addTo(map);

    // function getColor(number) {
    //   let color;

    //   if (number > 1000000) color = '#800026';
    //   else if (number > 500000) color = '#BD0026';
    //   else if (number > 200000) color = '#E31A1C';
    //   else if (number > 100000) color = '#FC4E2A';
    //   else if (number > 50000) color = '#FD8D3C';
    //   else if (number > 20000) color = '#FEB24C';
    //   else if (number > 10000) color = '#FED976';
    //   else color = '#FFEDA0';

    //   return color;
    // }

    // const styles = (feature) => {
    //   const num = (country) => this.model.getDataByCountry(country).TotalConfirmed;
    //   return {
    //     fillColor: getColor(num(feature?.properties?.name)),
    //     weight: 2,
    //     opacity: 1,
    //     color: 'white',
    //     dashArray: '3',
    //     fillOpacity: 0.7,
    //   };
    // };

    // L.geoJson(polygones, {
    //   style: styles,
    // }).addTo(map);
  };

  update = (data) => {
    this.dataList = [...data];
    this.createMap();
    this.loaded();
  };

  // init = () => {
  // };
}
