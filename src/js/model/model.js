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
          const per = 100000;
          const perMillion = [
            'casesPerOneMillion',
            'recoveredPerOneMillion',
            'deathsPerOneMillion',
          ];
          const per100k = ['casesPer100k', 'recoveredPer100k', 'deathsPer100k'];
          const perDay = ['todayCases', 'todayRecovered', 'todayDeaths'];
          const perDay100k = [
            'todayCasesPer100k',
            'todayRecoveredPer100k',
            'todayDeathsPer100k',
          ];

          data.forEach((element) => {
            setTimeout(() => {
              perMillion.forEach((field, ind) => {
                const item = element[field];
                const name = per100k[ind];
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
              perDay.forEach((field, ind) => {
                const item = element[field];
                const name = perDay100k[ind];
                if (item) {
                  const sum = (item / element.population) * per;
                  if (!(name in element)) {
                    // eslint-disable-next-line no-param-reassign
                    element[name] = +sum.toFixed(2);
                  }
                } else {
                  // eslint-disable-next-line no-param-reassign
                  element[name] = 0;
                }
              });
            }, 0);
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
  requestTotalStatus() {
    const url = 'https://disease.sh/v3/covid-19/all';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Not Found') {
          throw new Error('Invalid country name!');
        }
        model.setData(data, 'total');
      });
  },

  requestWorldStatus() {
    if (!this.data?.allStatus) {
      const today = new Date();
      const formDate = new Date('2020-01-22T00:00:00.000Z');
      const difference = formDate > today ? formDate - today : today - formDate;
      const diffDays = Math.floor(difference / (1000 * 3600 * 24));
      const url = `https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=${diffDays}`;
      try {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const name = 'allStatus';
            model.setData(data, name);
          });
      } catch (error) {
        throw new Error('Could not get data :(');
      }
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
  getTotalStatus() {
    return model?.data?.total || [];
  },
  getDataByCountry(countryCode) {
    return (
      model?.data?.summary.find(
        (country) => countryCode === country.countryInfo.iso2
          || countryCode === country.countryInfo.name_en,
      ) || []
    );
  },
  getDate() {},
  getStatus() {},
  getWorldStatus() {
    return model?.data?.allStatus || [];
  },
};

export default model;
