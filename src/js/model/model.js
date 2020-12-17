const model = {
  data: {},
  state: {
    case: '',
    country: '',
  },
  observers: [],
  setData(data, key) {
    this.data[key] = data;
    this.notifyObservers();
  },
  setState(field, value) {
    this.state[field] = value;
  },
  getState() {
    return this.state;
  },
  listen(observer) {
    this.observers.push(observer);
  },
  notifyObservers() {
    this.observers.forEach((notify) => notify());
  },
  requestSummaryData() {
    if (!this.data?.summary) {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          model.setData(data, 'summary');
        });
    }
  },
  // @param country{country name || iso2 || iso3 || country ID code}
  requestStatusPerCountry(country) {
    const url = `https://disease.sh/v3/covid-19/countries/${country}?strict=true`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Not Found') {
          throw new Error('Invalid country name!');
        }

        const name = country;
        model.setData(data, name);
      });
  },
  requestWorldStatus() {
    if (!this.data?.allStatus) {
      const today = new Date();
      const formDate = new Date('2020-01-22T00:00:00.000Z');
      const difference = formDate > today ? formDate - today : today - formDate;
      const diffDays = Math.floor(difference / (1000 * 3600 * 24));
      const url = `https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=${diffDays}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const name = 'allStatus';
          model.setData(data, name);
        });
    }
  },
  appendNull(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },
  getSummaryData() {
    return model?.data?.summary || [];
  },
  getDate() {

  },
  getStatus() {

  },
  getWorldStatus() {
    return model?.data?.allStatus || [];
  },
};

export default model;
