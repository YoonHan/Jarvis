<template>
  <div class="weather-box">
    <p class="title">오늘의 날씨</p>
    <div class="weather-info" v-if="weatherData">Loaded~</div>
    <div class="weather-info" v-else>날씨 정보 로드중...</div>
  </div>
</template>

<script>
export default {
  name: "Weather",
  props: {
    weatherData: undefined
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.weather-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
}

.title {
  text-align: left;
  margin: 0;
  font-size: 1.2em;
}

.weather-info {
  text-align: left;
  margin-top: 15px;
}
</style>
