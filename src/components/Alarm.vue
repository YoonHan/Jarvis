<template>
  <section class="alarm-box">
    <!-- 출발지 도착지 지정 부분 -->
    <section class="address-box">
      <div class="source-box">
        <p class="title">출발지 지정</p>
        <p class="source" v-on:click="openSearchModal" role="source">터치하여 출발지 검색</p>
      </div>
      <div class="destination-box">
        <p class="title">도착지 지정</p>
        <p class="destination" v-on:click="openSearchModal" role="destination">터치하여 도착지 검색</p>
      </div>
    </section>
    <!-- 교통 정보 경로 표시 부분 -->
    <section class="path-box">
      <p class="title">경로 정보</p>
      <!-- 경로 검색이 완료 되었을 때 -->
      <div class="path-info" v-if="pathInfo != null && !pathSearching">
        <ul class="path-info-list">
          <li v-for="(path, index) in pathInfo" :key="index">
            <p>
              <span class="time-estimated">{{ path.info.totalTime }}분 소요</span>
              {{ path.info.guideMessage }}
            </p>
          </li>
        </ul>
      </div>
      <!-- 경로 정보 검색에 실패했거나 출발지, 도착지 설정이 안되었을 때 -->
      <div class="path-info" v-else-if="pathInfo === null && !pathSearching">
        <p v-if="showPathError">{{ pathErrorMessage }}</p>
        <p v-else>출발지와 도착지를 설정해주세요</p>
      </div>
      <!-- 경로 검색 중일 때 -->
      <div class="path-info" v-else-if="pathSearching">
        <Loader class="loader-wrapper" />
      </div>
    </section>

    <!-- 알람 설정 부분 -->
    <section class="time-box">
      <p class="title">알람 시각</p>
      <div class="time-info">
        <!-- 시간 선택 -->
        <div class="hour-select" v-on:click="toggleHourList">
          {{ alarmInfo.hour !== null ? `${alarmInfo.hour} 시` : "시" }}
          <ul id="hour-list" v-if="hourListOpen">
            <li
              v-for="(hour, index) in hours"
              :key="index"
              v-on:click="selectHour"
              :value="hour"
            >{{ hour }}</li>
          </ul>
        </div>
        <!-- separator -->
        <div class="sep">:</div>
        <!-- 분 선택 -->
        <div class="minute-select" v-on:click="toggleMinuteList">
          {{ alarmInfo.minute !== null ? `${alarmInfo.minute} 분` : "분" }}
          <ul id="minute-list" v-if="minuteListOpen">
            <li
              v-for="(minute, index) in minutes"
              :key="index"
              v-on:click="selectMinute"
              :value="minute"
            >{{ minute }}</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- 알람 등록 버튼 -->
    <button class="set-alarm-btn" v-on:click="registerAlarm">알람 등록</button>
    <!-- Modal -->
    <div class="modal" v-if="searchModalOpen">
      <!-- 검색 창 -->
      <div class="header">
        <input
          type="text"
          name="source"
          id="source"
          placeholder="주소를 입력해 주세요"
          autocomplete="off"
          v-on:keyup="searchAddress"
        />
        <button class="close-btn" v-on:click="closeSearchModal"></button>
      </div>
      <!-- 검색 결과 부분 -->
      <Loader class="loader-wrapper" v-if="searchLoading" />
      <div class="content" v-else>
        <ul class="address-list" v-if="searchList != null && searchList.length != 0">
          <li
            class="address-item"
            v-for="(addrObj, index) in searchList"
            :key="index"
            v-on:click="selectAddress"
            :index="index"
          >
            <div class="address">
              <p class="jibun-addr">{{ addrObj.jibunAddr }}</p>
              <p class="road-addr">{{ addrObj.roadAddr }}</p>
              <p class="eng-addr">{{ addrObj.engAddr }}</p>
            </div>
            <div class="zipcode">
              <p>{{ addrObj.zipNo }}</p>
            </div>
          </li>
        </ul>
        <ul class="address-list" v-else>
          <p class="no-results">표시할 항목이 없습니다.</p>
        </ul>
      </div>
    </div>
    <!-- Snack Bar -->
    <SnackBar v-if="snackBarOpen" :isSuccess="isSnackBarSuccess">{{ snackBarMessage }}</SnackBar>
  </section>
</template>

<script>
import Loader from "@/components/Loader.vue";
import SnackBar from "@/components/SnackBar.vue";
import { checkSearchedWord } from "./checkSearchWords";
import { hours, minutes, paramsToQuery } from "./util";

export default {
  name: "Alarm",
  components: { Loader, SnackBar },
  data: function() {
    return {
      test: true,
      searchModalOpen: false,
      searchModalSelected: "",
      searchLoading: false,
      searchList: null,
      locationInfo: {
        source: {
          address: null,
          x: null,
          y: null
        },
        destination: {
          address: null,
          x: null,
          y: null
        }
      },
      alarmInfo: {
        hour: null,
        minute: null
      },
      pathInfo: null,
      pathSearching: false,
      hourListOpen: false,
      minuteListOpen: false,
      hours: hours,
      minutes: minutes,
      snackBarOpen: false,
      snackBarMessage: "",
      isSnackBarSuccess: true,
      pathErrorMessage: "",
      showPathError: false,
      keyUpTimer: null
    };
  },
  watch: {
    locationInfo: {
      deep: true,

      handler: async function(info) {
        if (
          info.source.address &&
          info.source.x &&
          info.source.y &&
          info.destination.address &&
          info.destination.x &&
          info.destination.y
        ) {
          this.pathSearching = true; // start Loader
          const URL = process.env.VUE_APP_TRANS_API_URL;
          const PATH = "/searchPubTransPath";
          let params = {
            SX: info.source.x,
            SY: info.source.y,
            EX: info.destination.x,
            EY: info.destination.y,
            apiKey: process.env.VUE_APP_TRANS_API_KEY
          };
          let query = paramsToQuery(params);
          await fetch(URL + PATH + query, {
            method: "GET"
          })
            .then(response => response.json())
            .then(data => {
              // 출발지, 도착지 에러 발생 시
              if ("error" in data) {
                return Promise.reject(data);
              }

              this.showPathError = false;
              data = data.result.path;
              this.pathInfo = data.splice(0, 4);
              this.pathInfo = this.pathInfo.map(path => {
                // subPath 중에서 걷는 구간 제외
                path.subPath = path.subPath.filter(
                  subPath => subPath.trafficType != 3
                );
                // pathInfo 안에 경로 안내 메시지 추가
                path.info.guideMessage = path.subPath
                  .map(subPath => {
                    let guideMessage = "";
                    if (subPath.trafficType === 1) {
                      // 지하철인 경우
                      guideMessage = `지하철로 [${subPath.startName}역]에서 [${subPath.endName}역]으로`;
                    } else if (subPath.trafficType === 2) {
                      // 버스인 경우
                      let bus = subPath.lane
                        .map(lane => `[${lane.busNo}번]`)
                        .join(" ");
                      guideMessage = `${bus} 버스로 ${subPath.startName}정류장에서 ${subPath.endName}정류장으로`;
                    }
                    return guideMessage;
                  })
                  .join(" -> ");
                return path;
              });
            })
            .catch(err => {
              console.error(err);
              if ("error" in err && "msg" in err.error)
                this.pathErrorMessage = err.error.msg;
              else this.pathErrorMessage = "경로 탐색에 실패하였습니다";
              this.pathInfo = null;
              this.showPathError = true;
            });

          this.pathSearching = false; // end Loader
        } else {
          return;
        }
      }
    }
  },
  methods: {
    openSearchModal: function(e) {
      const role = e.target.getAttribute("role");
      this.searchModalOpen = true;
      this.searchModalSelected = role;
    },
    closeSearchModal: function() {
      this.searchModalOpen = false;
      this.searchList = null;
      this.searchModalSelected = "";
    },
    searchAddress: function(e) {
      clearTimeout(this.keyUpTimer);
      this.keyUpTimer = setTimeout(() => {
        const searchWords = e.target.value;
        this.searchLoading = true;

        // early return
        if (!checkSearchedWord(searchWords)) {
          e.target.value = "";
          this.searchLoading = false;
          return;
        }
        const URL = process.env.VUE_APP_API_SERVER;
        const params = {
          keyword: searchWords
        };
        const query = paramsToQuery(params);
        fetch(URL + "users/address" + query, { method: "GET" })
          .then(response => response.json())
          .then(data => {
            this.searchList = data.results.juso;
            this.searchLoading = false;
          });
      }, 250);
    },
    selectAddress: function(e) {
      const address = this.searchList[e.currentTarget.getAttribute("index")]
        .roadAddr;

      // Call Naver geocoding api
      const URL = process.env.VUE_APP_API_SERVER;
      const PATH = "users/geocoding";
      let params = {
        address: encodeURI(encodeURIComponent(address))
      };
      let query = paramsToQuery(params);
      fetch(URL + PATH + query, { method: "GET" })
        .then(response => {
          return response.json();
        })
        .then(data => {
          const result = JSON.parse(data).addresses;
          // early return
          if (result.length === 0)
            return Promise.reject("No geocoding search results");

          const sourceElement = document.getElementsByClassName(
            this.searchModalSelected
          )[0];
          const locationInfo = this.locationInfo[this.searchModalSelected];
          sourceElement.innerText = address;
          locationInfo.address = address;
          locationInfo.x = result[0].x;
          locationInfo.y = result[0].y;
          this.searchModalOpen = false;
          this.searchList = null;
        })
        .catch(err => {
          console.error(err);
          this.snackBarMessage = "알람에 필요한 정보가 누락되었습니다";
          this.isSnackBarSuccess = false;
          this.snackBarOpen = true;
          setTimeout(() => {
            this.snackBarOpen = false;
          }, 5000);
        });
    },
    toggleHourList: function() {
      this.hourListOpen = !this.hourListOpen;
    },
    toggleMinuteList: function() {
      this.minuteListOpen = !this.minuteListOpen;
    },
    selectHour: function(e) {
      e.stopPropagation();
      const hourElem = e.currentTarget;
      this.alarmInfo.hour = hourElem.getAttribute("value");
      hourElem.innerText = hourElem.getAttribute("value");
      this.hourListOpen = false;
    },
    selectMinute: function(e) {
      e.stopPropagation();
      const minuteElem = e.currentTarget;
      this.alarmInfo.minute = minuteElem.getAttribute("value");
      minuteElem.innerText = minuteElem.getAttribute("value");
      this.minuteListOpen = false;
    },
    registerAlarm: function() {
      // check if necessary info is ready
      if (
        !this.locationInfo.source.address ||
        !this.locationInfo.source.x ||
        !this.locationInfo.source.y ||
        !this.locationInfo.destination.address ||
        !this.locationInfo.destination.x ||
        !this.locationInfo.destination.y ||
        !this.alarmInfo.hour ||
        !this.alarmInfo.minute
      ) {
        this.snackBarMessage = "알람 등록에 실패하였습니다";
        this.isSnackBarSuccess = false;
        this.snackBarOpen = true;
        setTimeout(() => {
          this.snackBarMissingFailOpen = false;
        }, 5000);
        return;
      }
      const URL = process.env.VUE_APP_API_SERVER;
      const PATH = "users/alarm";
      const DATA = {
        locationInfo: this.locationInfo,
        alarmInfo: this.alarmInfo,
        deviceToken: localStorage.getItem("DEVICE_TOKEN")
      };
      fetch(URL + PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(DATA)
      })
        .then(response => {
          if (response.status === 200) {
            this.snackBarMessage = "알람 등록에 성공하였습니다";
            this.isSnackBarSuccess = true;
            this.snackBarOpen = true;
            setTimeout(() => (this.snackBarOpen = false), 5000);
          } else {
            this.snackBarMessage = "알람 등록에 실패하였습니다";
            this.isSnackBarSuccess = false;
            this.snackBarOpen = true;
            setTimeout(() => (this.snackBarOpen = false), 5000);
          }
        })
        .catch(err => {
          console.error(err);
          this.snackBarMessage = "알람 등록에 실패하였습니다";
          this.isSnackBarSuccess = false;
          this.snackBarOpen = true;
          setTimeout(() => (this.snackBarOpen = false), 5000);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
section.alarm-box {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-top: 5px;
  padding: 10px;

  .title {
    font-size: 1.3em;
    margin: 0;
    text-align: left;
  }

  section.address-box {
    display: flex;
    justify-content: space-between;

    div.source-box,
    div.destination-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 5px;

      .source,
      .destination {
        margin: 0;
        max-width: 100%;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 5px;
        color: #ababab;
      }
    }
  }

  section.path-box {
    margin-top: 5px;
    padding: 5px;

    div.path-info {
      max-height: 150px;
      overflow: auto;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      padding: 5px 10px;
      color: #ababab;

      p {
        margin: 0;
        text-align: left;
      }

      .path-info-list {
        list-style-type: none;
        margin: 0;
        padding: 0;

        li {
          margin-bottom: 5px;
        }

        span.time-estimated {
          background: white;
          display: inline-block;
          padding: 0px 4px;
          color: black;
          border-radius: 10px;
        }
      }
    }

    div.loader-wrapper {
      display: flex;
      justify-content: center;
      padding: 10px 0px;
    }
  }

  section.time-box {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    padding: 5px;

    div.time-info {
      display: flex;
      justify-content: space-between;
      list-style-type: none;
      margin: 0;
      background: rgba(0, 0, 0, 0.5);
      color: #ababab;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;

      div.hour-select,
      div.minute-select {
        flex-grow: 1;
        position: relative;
        width: 50px;
      }

      ul#hour-list,
      ul#minute-list {
        position: absolute;
        list-style-type: none;
        margin: 5px 0 0 0;
        padding: 0;
        height: 150px;
        overflow: auto;
        width: 100%;
        border-top: 1px solid #eeaeca;
        background-color: rgba(0, 0, 0, 0.8);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        li {
          padding: 5px 0;
        }
      }
    }
  }

  button.set-alarm-btn {
    border: none;
    border-radius: 5px;
    background-color: #eeaeca;
    font-family: "Do Hyeon", sans-serif;
    font-size: 1.2em;
    color: white;
    margin: 5px;

    &:focus {
      outline: none;
    }
  }

  .modal {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;

    .header {
      display: flex;
      justify-content: space-between;

      #source,
      #destination {
        flex-grow: 1;
        height: 1.5em;
        margin: 0;
        padding: 5px;
        background: transparent;
        border: 0;
        border-bottom: 1px solid #ababab;
        font-size: 1.3em;
        color: white;

        &:focus {
          outline: none;
        }
      }

      .close-btn {
        width: 3em;
        height: 3em;
        background: transparent;
        border: none;
        padding: 0;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          top: 1em;
          width: 3px;
          height: 1.5em;
          background-color: #ababab;
          transform: rotate(45deg);
          -o-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
        }

        &::after {
          content: "";
          position: absolute;
          top: 1em;
          width: 3px;
          height: 1.5em;
          background-color: #ababab;
          transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -webkit-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
        }
      }
    }

    .content {
      padding-top: 20px;
      overflow: auto;

      ul.address-list {
        margin: 0;
        padding: 0;
        list-style-type: none;

        li.address-item {
          display: flex;
          justify-content: space-between;
          border: 1px solid #333333;
          border-radius: 10px;
          padding: 5px;
          margin-bottom: 5px;

          div.address {
            text-align: left;

            p.jibun-addr {
              margin: 0;
              font-size: 0.8em;
            }

            p.road-addr {
              margin: 0;
              font-size: 0.7em;
            }

            p.eng-addr {
              margin: 0;
              font-size: 0.7em;
              color: #ababab;
            }
          }

          div.zipcode {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 3px;

            p {
              background-color: white;
              color: black;
              padding: 1px 2px;
              border-radius: 5px;
              font-size: 0.8em;
              min-width: 40px;
            }
          }
        }
      }
    }

    .loader-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 100px;
    }
  }
}
</style>
