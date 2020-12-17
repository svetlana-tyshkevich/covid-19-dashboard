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
  requestWorldStatus({ daysBeforeNow }) {
    const url = `https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=${daysBeforeNow}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const name = 'allStatus';
        model.setData(data, name);
      });
  },
  getDataByCountry(country) {
    if (typeof country !== 'string') {
      throw new TypeError('Type of argument must be string!');
    }
    const { Countries } = model.data.summary;
    const requiredElement = Countries.find(({ Country }) => country === Country);
    if (requiredElement) {
      return requiredElement;
    }
    throw new Error('Invalide data!');
  },
  appendNull(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },
  getSummaryData() {
    return model?.data?.summary || [];
  },
  getDate() {
    const date = new Date(model.data.summary.Date);
    const day = this.appendNull(date.getDate());
    const month = this.appendNull(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  getStatus() {
    return model?.data?.period;
  },
  getWorldStatus() {
    return model?.data?.allStatus || [];
  },
};

export default model;
