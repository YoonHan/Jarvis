<template>
  <section class="weather-box" v-if="!nowLoading && typeof(weatherData) != 'string'">
    <p class="title">현재 날씨</p>
    <div class="weather-info">
      <div class="now">
        <img v-bind:src="now.iconSrc" alt="weather icon" class="weather-icon" />
        <ul class="info">
          <li class="info-item">
            <p class="name">기온</p>
            <p class="content">현재: {{ now.temp ? now.temp : '-' }}</p>
            <p class="content">체감: {{ now.feelsLike ? now.feelsLike : '-' }}</p>
          </li>
          <li class="info-item">
            <p class="name">습도</p>
            <p class="content">{{ now.humidity ? now.humidity : '-' }}</p>
          </li>
          <li class="info-item">
            <p class="name">풍속</p>
            <p class="content">{{ now.windSpeed ? now.windSpeed : '-' }}</p>
          </li>
          <li class="info-item">
            <p class="name">강수량</p>
            <p class="content">{{ now.rain ? now.rain : '-' }}</p>
          </li>
        </ul>
      </div>
      <div class="forecast">
        <ul class="info">
          <li class="info-item" v-for="(hourlyData, index) in forecast" :key="index">
            <p class="time">{{ hourlyData.dt }}</p>
            <img v-bind:src="hourlyData.weather[0].icon" alt="weather icon" class="weather-icon" />
            <p class="temp">{{ hourlyData.temp }}</p>
          </li>
        </ul>
      </div>
    </div>
    <footer class="source" v-if="weatherData">출처 : OpenWeather</footer>
  </section>
  <section class="weather-box" v-else-if="!nowLoading && typeof(weatherData) == 'string'">
    <p class="title">현재 날씨</p>
    <p class="message">날씨 정보를 불러오지 못했습니다</p>
  </section>
  <section class="weather-box" v-else-if="nowLoading">
    <p class="title">현재 날씨</p>
    <div class="loader-wrapper">
      <Loader />
    </div>
  </section>
</template>

<script>
import moment from "moment";
import Loader from "@/components/Loader.vue";

export default {
  name: "Weather",
  props: {
    weatherData: null
  },
  components: {
    Loader
  },
  data: function() {
    return {
      now: {
        sunrise: "",
        sunset: "",
        temp: "",
        iconSrc: "",
        feelsLike: "",
        humidity: "",
        rain: ""
      },
      forecast: null,
      nowLoading: true
    };
  },
  watch: {
    weatherData: function() {
      // early return
      if (!this.weatherData) {
        this.nowLoading = false;
        return;
      }

      // Set weather information into this component
      // Load completed
      this.nowLoading = false;

      // now
      this.now.sunrise = moment(this.weatherData.current.sunrise * 1000).format(
        "h:mm A"
      );
      this.now.sunset = moment(this.weatherData.current.sunset * 1000).format(
        "h:mm A"
      );
      this.now.temp = Math.round(this.weatherData.current.temp) + "°C";
      this.now.iconSrc = require(`../assets/icon/weather/${this.weatherData.current.weather[0].icon}.svg`);
      this.now.feelsLike =
        Math.round(this.weatherData.current.feels_like) + "°C";
      this.now.humidity = this.weatherData.current.humidity + "%";
      this.now.windSpeed = this.weatherData.current.wind_speed + "m/s";

      if (this.weatherData.hourly[0].rain) {
        this.now.rain = this.weatherData.hourly[0].rain["1h"] + " mm/h";
      }

      // forecast
      this.forecast = this.weatherData.hourly.slice(1, 11);
      for (let hourlyData of this.forecast) {
        hourlyData.dt = moment(hourlyData.dt * 1000).format("H[시]");
        hourlyData.temp = Math.round(hourlyData.temp) + "°C";
        hourlyData.weather[0].icon = require(`../assets/icon/weather/${hourlyData.weather[0].icon}.svg`);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
p {
  margin: 0;
}

.weather-box {
  margin-top: 5px;
  padding: 15px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);

  .title {
    text-align: left;
    margin: 0;
    font-size: 1.3em;
  }

  .message {
    text-align: left;
  }

  .source {
    margin-top: 15px;
    text-align: right;
    font-size: 10px;
  }

  .loader-wrapper {
    display: flex;
    justify-content: center;
  }
}

.weather-info {
  text-align: left;

  .now {
    display: flex;

    .info {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      justify-content: space-around;
      margin: 0 0 0 5px;
      padding: 10px 0;
      list-style-type: none;

      .info-item {
        flex: 1 1 85px;
        border-top: 1px solid #dedede;
        margin-right: 10px;
        padding: 5px 0 15px 0;

        .name {
          text-align: center;
          font-size: 1.2em;
        }

        .content {
          text-align: center;
          background-color: black;
          border: 1px solid #555555;
          border-radius: 10px;
        }
      }
    }
  }

  .forecast {
    overflow: hidden;

    .info {
      display: flex;
      margin: 0;
      padding: 0;
      list-style-type: none;
      overflow: auto;

      .info-item {
        flex: 0 0 50px;
        text-align: center;
      }

      .weather-icon {
        width: 36px;
        height: 36px;
      }
    }
  }
}

.weather-icon {
  width: 64px;
  height: 64px;
}
</style>
