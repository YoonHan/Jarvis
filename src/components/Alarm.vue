<template>
  <section class="alarm-box">
    <section class="address-box">
      <div class="source-box">
        <p class="title">출발지 지정</p>
        <p class="source" v-on:click="openSearchModal" role="source">
          터치하여 출발지 검색
        </p>
      </div>
      <div class="destination-box">
        <p class="title">도착지 지정</p>
        <p class="destination" v-on:click="openSearchModal" role="destination">
          터치하여 도착지 검색
        </p>
      </div>
    </section>
    <section class="time-box">
      <p class="title">알람 시각</p>
      <div class="time-info">
        <div class="hour-select" v-on:click="toggleHourList">
          {{ alarmInfo.hour != null ? `${alarmInfo.hour} 시` : "시" }}
          <ul id="hour-list" v-if="hourListOpen">
            <li
              v-for="(hour, index) in hours"
              :key="index"
              v-on:click="selectHour"
              :value="hour"
            >
              {{ hour }}
            </li>
          </ul>
        </div>
        <div class="sep">:</div>
        <div class="minute-select" v-on:click="toggleMinuteList">
          {{ alarmInfo.minute != null ? `${alarmInfo.minute} 분` : "분" }}
          <ul id="minute-list" v-if="minuteListOpen">
            <li
              v-for="(minute, index) in minutes"
              :key="index"
              v-on:click="selectMinute"
              :value="minute"
            >
              {{ minute }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <button class="set-alarm-btn" v-on:click="registerAlarm">
      알람 등록
    </button>
    <!-- Modal -->
    <div class="modal" v-if="searchModalOpen">
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
      <div class="loader-wrapper" v-if="searchLoading">
        <Loader />
      </div>
      <div class="content" v-else>
        <ul
          class="address-list"
          v-if="searchList != null && searchList.length != 0"
        >
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
  </section>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { checkSearchedWord } from "./checkSearchWords";
import { hours, minutes } from "./util";

export default {
  name: "Alarm",
  components: { Loader },
  data: function() {
    return {
      searchModalOpen: false,
      searchModalSelected: "",
      searchLoading: false,
      searchList: null,
      locationInfo: {
        source: {
          address: null,
          x: null,
          y: null,
        },
        destination: {
          address: null,
          x: null,
          y: null,
        },
      },
      alarmInfo: {
        hour: null,
        minute: null,
      },
      hourListOpen: false,
      minuteListOpen: false,
      hours: hours,
      minutes: minutes,
      keyUpTimer: null,
    };
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
        console.log("api calling..."); // delete
        const URL = process.env.VUE_APP_API_SERVER;
        const params = {
          keyword: searchWords,
        };
        const query =
          "?" +
          Object.keys(params)
            .map((k) => k + "=" + params[k])
            .join("&");
        fetch(URL + "users/address" + query, { method: "GET" })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.results.juso); // delete
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
        address: encodeURI(encodeURIComponent(address)),
      };
      let query =
        "?" +
        Object.keys(params)
          .map((k) => k + "=" + params[k])
          .join("&");

      fetch(URL + PATH + query, { method: "GET" })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const result = JSON.parse(data).addresses;
          // early return
          if (result.length == 0)
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
        .catch((err) => {
          console.log(err);
          alert("주소 등록에 실패했습니다");
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
    registerAlarm: function(e) {
      console.log(e.currentTarget);
    },
  },
};
</script>

<style lang="scss" scoped>
.alarm-box {
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

  .address-box {
    display: flex;
    justify-content: space-between;

    .source-box,
    .destination-box {
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
