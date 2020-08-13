<template>
  <section class="alarm-box">
    <section class="address-box">
      <div class="source-box">
        <p class="title">출발지 지정</p>
        <p class="source" v-on:click="openSearch">터치하여 출발지 검색</p>
        <div class="modal" v-if="srcModalOpen">
          <div class="header">
            <input
              type="text"
              name="source"
              id="source"
              placeholder="주소를 입력해 주세요"
              autocomplete="off"
            />
            <button class="close-btn" v-on:click="closeSearch"></button>
          </div>
          <div class="loader-wrapper" v-if="srcLoading">
            <Loader />
          </div>
          <div class="content" v-else>gd</div>
        </div>
      </div>
      <div class="destination-box">
        <p class="title">도착지 지정</p>
        <p class="destination" v-on:click="openSearch">터치하여 도착지 검색</p>
        <div class="modal" v-if="dstModalOpen">
          <div class="header">
            <input
              type="text"
              name="destination"
              id="destination"
              placeholder="주소를 입력해 주세요"
              autocomplete="off"
            />
            <button class="close-btn" v-on:click="closeSearch"></button>
          </div>
          <div class="loader-wrapper" v-if="dstLoading">
            <Loader />
          </div>
          <div class="content" v-else>gd</div>
        </div>
      </div>
    </section>
    <section class="time-box">
      <p class="title">알람 시각</p>
    </section>
  </section>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "Alarm",
  components: { Loader },
  data: function() {
    return {
      srcModalOpen: false,
      dstModalOpen: false,
      srcLoading: false,
      dstLoading: false
    };
  },
  methods: {
    openSearch: function(e) {
      const className = e.target.className;
      if (className == "source") {
        this.srcModalOpen = true;
      } else if (className == "destination") {
        this.dstModalOpen = true;
      }
    },
    closeSearch: function() {
      this.srcModalOpen = false;
      this.dstModalOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-box {
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

    .modal {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.9);
      box-sizing: border-box;
      padding: 20px;

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

      .loader-wrapper {
        display: flex;
        justify-content: center;
        padding-top: 100px;
      }
    }
  }

  .time-box {
    margin-top: 5px;
    padding: 5px;
  }
}
</style>