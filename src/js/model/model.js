const model = {
  data: [],
  observers: [],
  setData(data) {
    this.data = data;
    this.notifyObservers();
  },
  requestData() {
    fetch('https://api.covid19api.com')
      .then((res) => res.json())
      .then((data) => model.setData(data));
  },

  listen(observer) {
    this.observers.push(observer);
  },
  notifyObservers() {
    this.observers.forEach((notify) => notify());
  },
  getDataByCountry(country) {
    return model.data.Countries.find(({ Country }) => Country === country);
  },
  getFilteredData(filter) {
    return model.data[filter];
  },
  getViews() {
    return {
      getFilteredData: model.getFilteredData,
    };
  },
};

export default model;
