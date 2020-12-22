const model = {
  data: {},
  state: {
    case: 'cases',
    country: 'global',
    period: false,
    abs: false,
  },
  components: [],
  observers: [],
  states: [],
  setData(data, key) {
    this.data[key] = data;
    this.notifyObservers();
  },
  setState(key, data) {
    if (this.state[key] !== data) {
      this.state[key] = data;
      this.notifyObservers();
    }
  },
  getState() {
    return this.state;
  },
  listen(observer) {
    this.observers.push(observer);
  },
  notifyStates() {
    this.states.forEach((notify) => notify());
  },
  notifyObservers() {
    this.observers.forEach((notify) => notify());
  },
  requestSummaryData() {
    if (!this.data?.summary) {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const items = [
            'casesPerOneMillion',
            'recoveredPerOneMillion',
            'deathsPerOneMillion',
          ];
          const names = [
            'casesPer100k',
            'recoveredPer100k',
            'deathsPer100k',
          ];

          data.forEach((element) => {
            items.forEach((field, ind) => {
              const item = element[field];
              const name = names[ind];
              if (item) {
                const sum = item / 10;
                if (!(name in element)) {
                  // eslint-disable-next-line no-param-reassign
                  element[name] = Math.trunc(sum);
                }
              } else {
                // eslint-disable-next-line no-param-reassign
                element[name] = 0;
              }
            });
          });

          model.setData(data, 'summary');
        });
    }
  },
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
  requestCountryStatus(countryId) {
    const today = new Date();
    const formDate = new Date('2020-01-22T00:00:00.000Z');
    const difference = formDate > today ? formDate - today : today - formDate;
    const diffDays = Math.floor(difference / (1000 * 3600 * 24));
    const url = `https://disease.sh/v3/covid-19/historical/${countryId}?lastdays=${diffDays}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const name = 'country';
        model.setData(data, name);
      });
  },
  getCountryDaily() {
    return this.data.country;
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
