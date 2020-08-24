import { paramsToQuery } from "@/components/util";

export function setAddressInfo(component) {
  // Get location address information
  const URL = process.env.VUE_APP_API_SERVER;
  let params = {
    longitude: component.longitude,
    latitude: component.latitude,
  };
  let query = paramsToQuery(params);
  fetch(URL + "users/location" + query, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const results = JSON.parse(data).results;
      const city = results[1].region.area2.name;
      const neighbor = results[1].region.area3.name;
      component.nowLocation = `${city} ${neighbor}`; // set address information
    })
    .catch((err) => {
      console.error(err);
      component.nowLocation = "위치를 불러올 수 없습니다";
    });
}

export function setWeatherInfo(component) {
  const URL = process.env.VUE_APP_API_SERVER;
  let params = {
    longitude: component.longitude,
    latitude: component.latitude,
  };
  let query = paramsToQuery(params);

  // get weather information
  fetch(URL + "users/weather" + query, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      component.weatherData = data; // set weather information
    })
    .catch((err) => {
      console.error(err);
      component.weatherData = "네트워크 연결 오류";
    });
}

export function setTransportInfo(component) {
  const TRANS_API_URL = process.env.VUE_APP_TRANS_API_URL;
  const PATH = "/pointBusStation";
  let params = {
    lang: 0,
    x: component.longitude,
    y: component.latitude,
    apiKey: process.env.VUE_APP_TRANS_API_KEY,
    radius: 300,
  };
  let query = paramsToQuery(params);

  // get transport infromation nearby
  fetch(TRANS_API_URL + PATH + query, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.result) {
        component.transportData = {};
        return Promise.reject(data);
      }
      component.transportData = data; // set transport information
    })
    .catch((err) => {
      console.error(err);
    });
}
