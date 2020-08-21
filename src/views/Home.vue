<template>
  <main class="home">
    <nav id="top">
      <p class="date">{{ nowDate ? nowDate : "불러오는 중..." }}</p>
      <p class="location">
        <i class="fas fa-location-arrow"></i>
        {{ nowLocation ? nowLocation : "불러오는 중..." }}
      </p>
    </nav>
    <Alarm />
    <Weather v-bind:weatherData="weatherData" />
    <Transport v-bind:transportData="transportData" />
    <!-- This is for testing -->
    <!-- <button v-on:click="this.pushTest">Push Test</button> -->
    <!-- <button v-on:click="this.getDeviceToken">Print Token</button> -->
    <!-- <textarea readonly name="test" id="test" cols="30" rows="10"></textarea> -->
  </main>
</template>

<script>
// @ is an alias to /src
import Alarm from "@/components/Alarm.vue";
import Weather from "@/components/Weather.vue";
import Transport from "@/components/Transport.vue";
import moment from "moment";
import { paramsToQuery } from "@/components/util";

const init = function(component) {
  // Time update every 1 second
  setInterval(() => {
    component.nowDate = moment().format("M[월] D[일][(]ddd[)] h:mm:ss A");
  }, 1000);

  // Get device location
  // and administration address
  const URL = process.env.VUE_APP_API_SERVER;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      // if succeed,
      position => {
        component.longitude = position.coords.longitude;
        component.latitude = position.coords.latitude;

        // Get location information
        let params = {
          longitude: component.longitude,
          latitude: component.latitude
        };
        let query = paramsToQuery(params);
        fetch(URL + "users/location" + query, {
          method: "GET"
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            const results = JSON.parse(data).results;
            const city = results[1].region.area2.name;
            const neighbor = results[1].region.area3.name;
            component.nowLocation = `${city} ${neighbor}`;
          })
          .catch(err => {
            console.error(err);
            component.nowLocation = "위치를 불러올 수 없습니다";
          });

        // Get weather information
        fetch(URL + "users/weather" + query, { method: "GET" })
          .then(response => {
            return response.json();
          })
          .then(data => {
            component.weatherData = data;
          })
          .catch(err => {
            console.error(err);
            component.weatherData = "Error in connection";
          });

        // Get Transport information
        const TRANS_API_URL = process.env.VUE_APP_TRANS_API_URL;
        const PATH = "/pointBusStation";
        params = {
          lang: 0,
          x: component.longitude,
          y: component.latitude,
          apiKey: process.env.VUE_APP_TRANS_API_KEY,
          radius: 300
        };
        query = paramsToQuery(params);
        fetch(TRANS_API_URL + PATH + query, {
          method: "GET"
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            if (!data.result) {
              component.transportData = {};
              return Promise.reject(data);
            }
            component.transportData = data;
          })
          .catch(err => {
            console.error(err);
          });
      },
      err => {
        console.error(err);
        component.nowLocation = "위치를 불러올 수 없습니다";
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  } else {
    component.nowLocation = "지원하지 않는 브라우저 입니다";
  }
};

const getDeviceToken = function() {
  let textarea = document.getElementById("test");
  textarea.innerText = localStorage.getItem("DEVICE_TOKEN");
};

export default {
  name: "Home",
  components: {
    Alarm,
    Weather,
    Transport
  },
  data: function() {
    return {
      nowDate: "",
      nowLocation: "",
      latitude: "",
      longitude: "",
      weatherData: null,
      transportData: null
    };
  },
  created: function() {
    init(this);
  },
  methods: {
    getDeviceToken: getDeviceToken
  }
};
</script>

<style scoped lang="scss">
.home {
  color: white;
}

#top {
  p.date {
    font-size: 1.2em;
    text-align: left;
    margin: 0;
  }
}

.location {
  margin-top: 15px;
  margin-bottom: 0;
  text-align: left;
  font-size: 1.6em;
}
</style>
