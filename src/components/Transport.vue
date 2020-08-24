<template>
  <!-- 로딩 중이 아닐 때 -->
  <section class="transport-box" v-if="!nowLoading">
    <p class="title">주변 교통정보</p>
    <div class="transport-info">
      <!-- 버스 정보 -->
      <div class="bus-info">
        <div class="header">
          <img src="../assets/icon/transport/bus.png" alt="icon" class="icon" />
          <p class="sub">버스정보</p>
        </div>
        <div class="content" v-if="busList.length != 0">
          <p class="bus-no" v-for="(busNo, index) in busList" :key="index">
            {{ busNo }}
          </p>
        </div>
        <div class="content" v-else>없음</div>
      </div>
      <!-- 지하철 정보 -->
      <div class="subway-info">
        <div class="header">
          <img src="../assets/icon/transport/bus.png" alt="icon" class="icon" />
          <p class="sub">지하철정보</p>
        </div>
        <div class="content" v-if="subwayList.length != 0">
          <p class="subway" v-for="(subway, index) in subwayList" :key="index">
            <span :class="`line line-${subway.line}`">{{ subway.line }}</span>
            <span class="name">{{ subway.name }}</span>
          </p>
        </div>
        <div class="content" v-else>없음</div>
      </div>
    </div>
  </section>
  <!-- 로딩 중일 때 -->
  <section class="transport-box" v-else>
    <p class="title">주변 교통정보</p>
    <Loader class="loader-wrapper" />
  </section>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "Transport",
  props: {
    transportData: null,
  },
  components: {
    Loader,
  },
  data: function() {
    return {
      busList: [],
      subwayList: [],
      nowLoading: true,
    };
  },
  watch: {
    transportData: function() {
      // early return. props 데이터 유효성 체크
      if (!this.transportData.result) {
        this.nowLoading = false;
        return;
      }

      // load complete
      this.nowLoading = false;

      // extract bus number list
      this.busInfo = this.transportData.result.lane.filter(
        (stn) => stn.stationClass === 1
      );
      for (const busInfo of this.busInfo) {
        for (const bus of busInfo.busList) {
          if (!this.busList.includes(bus.busNo)) this.busList.push(bus.busNo);
        }
      }
      this.busList.sort((a, b) => a.length - b.length); // 추가설명

      // extract subway line list
      this.subwayInfo = this.transportData.result.lane.filter(
        (stn) => stn.stationClass === 2
      );
      for (const subwayInfo of this.subwayInfo) {
        this.subwayList.push({
          line: subwayInfo.subwayLaneType,
          name: subwayInfo.stationName,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../common/common.scss";

.transport-box {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-top: 5px;
  padding: 15px;

  .title {
    font-size: 1.3em;
    margin: 0;
    text-align: left;
  }

  .loader-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}

.transport-info {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  max-width: 100%;

  .icon {
    width: 20px;
    height: 20px;
    float: left;
    margin-right: 5px;
  }

  .bus-info {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    max-width: 50%;

    .header {
      text-align: left;

      .sub {
        margin: 0;
        font-size: 1.2em;
      }
    }

    .content {
      margin-top: 10px;
      text-align: left;

      .bus-no {
        display: inline-block;
        margin: 0 2px 0 0;
        padding: 0 5px;
        background-color: black;
        border: 1px solid #555555;
        border-radius: 10px;
      }
    }
  }

  .subway-info {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    margin-left: 5px;

    .header {
      text-align: left;

      .sub {
        margin: 0;
        font-size: 1.2em;
      }
    }

    .content {
      margin-top: 10px;
      text-align: left;

      .subway {
        margin: 0;

        .line {
          background-color: black;
          border-radius: 1em;
          width: 1.2em;
          height: 1.2em;
          display: inline-block;
          text-align: center;
          line-height: 1.2em;
        }

        @for $i from 1 through 21 {
          .line-#{nth($lines, $i)} {
            background-color: #{nth($colors, $i)};
          }
        }

        .name {
          margin-left: 4px;
          line-height: 1.2em;
        }
      }
    }
  }
}
</style>
