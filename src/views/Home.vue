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

const init = function(component) {
  // Time update every 1 second
  setInterval(() => {
    component.nowDate = moment().format("M[월] D[일][(]ddd[)] h:mm:ss A");
  }, 1000);

  // Get device location
  // and administration address
  const URL = process.env.VUE_APP_API_SERVER;
  if (navigator.geolocation) {
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
        let query =
          "?" +
          Object.keys(params)
            .map(k => k + "=" + params[k])
            .join("&");

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
            console.log(err);
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
            console.log(err);
          });

        // Get Transport information
        const TRANS_API_URL = "https://api.odsay.com/v1/api";
        const PATH = "/pointBusStation";
        params = {
          lang: 0,
          x: component.longitude,
          y: component.latitude,
          apiKey: process.env.VUE_APP_TRANS_API_KEY,
          radius: 250
        };
        query =
          "?" +
          Object.keys(params)
            .map(k => k + "=" + params[k])
            .join("&");

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
        console.log(err);
        component.nowLocation = "위치를 불러올 수 없습니다";
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  } else {
    component.nowLocation = "지원하지 않는 브라우저 입니다";
  }
};

const pushTest = function() {
  const FCM_SERVER_KEY =
    "AAAAkpndJK4:APA91bGFXlmaGFBOD3xospwsvIegwN8D0hqer1PheZ3w8PUg3hYkdaecivo2sZBsl5yCfda0kfcMxQT1CCLhtlbkTPvRNHr_k-qhC0c7KB-pTdgHIu-m_Vbr4usjco_xb4oOnz4rsIJj";
  const TO = localStorage.getItem("DEVICE_TOKEN");
  let body = {
    to: TO,
    priority: "high",
    notification: {
      body: "Hi! Nice to meet you",
      title: "Hi, HI, HIHIHIHIHIHI",
      click_action: "https://vue-pwa-cc9dd.web.app"
    },
    data: {
      a: "1",
      b: "2"
    }
  };

  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Authorization: "key=" + FCM_SERVER_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
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
    pushTest: pushTest,
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
