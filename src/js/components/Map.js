/* eslint-disable new-cap */
/* eslint-disable no-undef */
import model from '../model/model';
import create from '../utils/create';
import BaseComponent from './BaseComponent';
import polygones from '../utils/polygones.json';

export default class WorldMap extends BaseComponent {
  constructor(className) {
    super(className);
    this.mapBox = create({ tagName: 'div', classNames: `${className}__inner`, dataAttr: ['id', 'mapBox'] });
    this.model = model;
  }

  createMap = () => {
    const map = new L.map('mapBox').setView([53.9015, 27.566], 3);

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
        maxZoom: 18,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, '
          + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
      },
    ).addTo(map);

    function getColor(number) {
      let color;

      if (number > 1000000) color = '#800026';
      else if (number > 500000) color = '#BD0026';
      else if (number > 200000) color = '#E31A1C';
      else if (number > 100000) color = '#FC4E2A';
      else if (number > 50000) color = '#FD8D3C';
      else if (number > 20000) color = '#FEB24C';
      else if (number > 10000) color = '#FED976';
      else color = '#FFEDA0';

      return color;
    }

    const styles = (feature) => {
      const num = (country) => this.model.getDataByCountry(country).TotalConfirmed;
      return {
        fillColor: getColor(num(feature?.properties?.name)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    };

    L.geoJson(polygones, {
      style: styles,
    }).addTo(map);
  };

  update = (data) => {
    this.dataList = [...data];
    this.createMap();
    this.loaded();
  };

  // init = () => {
  // };
}
