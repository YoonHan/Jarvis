<template>
  <main class="home">
    <!-- Top navigation -->
    <nav id="top">
      <p class="date">{{ nowDate ? nowDate : "불러오는 중..." }}</p>
      <p class="location">
        <i class="fas fa-location-arrow"></i>
        {{ nowLocation ? nowLocation : "불러오는 중..." }}
      </p>
    </nav>
    <!-- Components -->
    <Alarm />
    <Weather v-bind:weatherData="weatherData" />
    <Transport v-bind:transportData="transportData" />
  </main>
</template>

<script>
// @ is an alias to /src
import Alarm from "@/components/Alarm.vue";
import Weather from "@/components/Weather.vue";
import Transport from "@/components/Transport.vue";
import moment from "moment";

import { setAddressInfo, setWeatherInfo, setTransportInfo } from "./apis";

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
    this.init(this);
  },
  methods: {
    init: function(component) {
      // Time update every 1 second
      setInterval(() => {
        component.nowDate = moment().format("M[월] D[일][(]ddd[)] h:mm:ss A");
      }, 1000);

      // Get device location
      // and set administration address
      // and get weather information
      // and get transport information nearby
      // const URL = process.env.VUE_APP_API_SERVER;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          // if succeed,
          position => {
            component.longitude = position.coords.longitude;
            component.latitude = position.coords.latitude;
            // Set Administration Address
            setAddressInfo(component);
            // set weather information
            setWeatherInfo(component);
            // set Transport information
            setTransportInfo(component);
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
    }
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
