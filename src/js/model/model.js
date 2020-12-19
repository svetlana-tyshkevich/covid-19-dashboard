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
<<<<<<< HEAD
  listen(observer) {
    this.observers.push(observer);
  },
  notifyObservers() {
    this.observers.forEach((notify) => notify());
  },
  getCountryList() {
    const { Countries } = model.data.summary;
    return Countries.map((element) => element.Country);
  },
  getSlugList() {
    const { Countries } = model.data.summary;
    return Countries.map((element) => element.Slug);
  },
  getDataByCountry(country) {
    if (typeof country !== 'string') {
      throw new TypeError('Type of argument must be string!');
    }
    const { Countries } = model.data.summary;
    const requiredElement = Countries.find(
      ({ Country }) => country === Country,
    );
    if (requiredElement) {
      return requiredElement;
    }
    throw new Error('Invalide data!');
  },
  getDataByCountryCode(countryCode) {
    if (typeof countryCode !== 'string') {
      throw new TypeError('Type of argument must be string!');
    }
    const { Countries } = model.data.summary;
    const requiredElement = Countries.find(
      ({ CountryCode }) => countryCode === CountryCode,
    );
    if (requiredElement) {
      return requiredElement;
    }
    throw new Error('Invalide data!');
  },
  getCountriesStatus() {
    return model.data.summary.Countries;
  },
  getAllSummaryData() {
    return model.data.summary;
=======
  requestWorldStatus({ daysBeforeNow }) {
    const url = `https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=${daysBeforeNow}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const name = 'allStatus';
        model.setData(data, name);
      });
>>>>>>> develop
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
