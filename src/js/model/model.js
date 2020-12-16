const model = {
  data: {},
  observers: [],
  setData(data, key) {
    this.data[key] = data;
    this.notifyObservers();
  },
  requestData() {
    const urls = ['https://api.covid19api.com/summary'];
    urls.forEach((url) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.Message === 'Caching in progress') {
            throw new Error('Cannot get data!');
          }
          const name = url.split('/').pop();
          model.setData(data, name);
        });
    });
  },
  requestStatus({
    country, cases, monthFrom, monthTo,
  }) {
    if (!cases.match(/confirmed|recovered|deaths/)) {
      throw new Error('Cases must be one of: confirmed, recovered, deaths!');
    }
    const dateFrom = `2020-${this.appendNull(monthFrom)}-11T00:00:00Z`;
    const dateTo = `2020-${this.appendNull(monthTo)}-11T00:00:00Z`;
    const url = `https://api.covid19api.com/country/${country}/status/${cases}?from=${dateFrom}&to=${dateTo}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Not Found') {
          throw new Error('Invalid country name!');
        }

        const name = 'period';
        model.setData(data, name);
      });
  },
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
  },
  appendNull(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },
  getDate() {
    const date = new Date(model.data.summary.Date);
    const day = this.appendNull(date.getDate());
    const month = this.appendNull(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  getStatus() {
    return model.data.period;
  },
};

export default model;
