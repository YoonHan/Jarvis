<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button v-on:click="this.pushTest">Push Test</button>
    a;woeijf;owaj;foawefja;oiwjfajwif
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    pushTest: function() {
      var key =
        "AAAAkpndJK4:APA91bFTmu8aMpzCRa7vJY7aadmPIgqew-5br-JNVAziYTzT2NypR4C-pxj53QqTkvW74OY5m1tJJ9BWtiIanSOFFYlIGXkuixyfzvGgCIfqXri33iJppJXNY5l9bws630Tv9BCT11xS";
      var to = "1:629646632110:web:d29dc6c2c9631b7cebb93f";
      var notification = {
        title: "Portugal vs. Denmark",
        body: "5 to 1",
        icon: "firebase-logo.png",
        click_action: "http://localhost:8081",
      };

      fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: "key=" + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification: notification,
          to: to,
        }),
      })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    },
  },
};
</script>
