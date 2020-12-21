const model = {
  data: {},
  observers: [],
  setData(data, key) {
    this.data[key] = data;
    this.notifyObservers();
  },
  listen(observer) {
    this.observers.push(observer);
  },
  notifyObservers() {
    this.observers.forEach((notify) => notify());
  },
  requestSummaryData() {
    fetch('https://disease.sh/v3/covid-19/countries')
      .then((res) => res.json())
      .then((data) => {
        model.setData(data, 'summary');
      });
  },
  // @param country{country name || iso2 || iso3 || country ID code}
  // requestStatusPerCountry(country) {
  //   const url = `https://disease.sh/v3/covid-19/countries/${country}?strict=true`;
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.message === 'Not Found') {
  //         throw new Error('Invalid country name!');
  //       }

  //       const name = country;
  //       model.setData(data, name);
  //     });
  // },
  requestWorldStatus({ daysBeforeNow }) {
    const url = `https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=${daysBeforeNow}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const name = 'allStatus';
        model.setData(data, name);
      });
  },
  appendNull(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },
  getSummaryData() {
    return model?.data?.summary || [];
  },
  // eslint-disable-next-line no-unused-vars
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
