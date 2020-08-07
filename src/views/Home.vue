<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button v-on:click="this.pushTest">Push Test</button>
    <button v-on:click="this.getDeviceToken">Print Token</button>
    <textarea readonly name="test" id="test" cols="30" rows="10"></textarea>
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
      const FCM_SERVER_KEY =
        "AAAAkpndJK4:APA91bGFXlmaGFBOD3xospwsvIegwN8D0hqer1PheZ3w8PUg3hYkdaecivo2sZBsl5yCfda0kfcMxQT1CCLhtlbkTPvRNHr_k-qhC0c7KB-pTdgHIu-m_Vbr4usjco_xb4oOnz4rsIJj";
      const TO = localStorage.getItem("DEVICE_TOKEN");
      let body = {
        to: TO,
        priority: "high",
        notification: {
          body: "Hi! Nice to meet you",
          title: "Hi, HI, HIHIHIHIHIHI",
          click_action: "https://vue-pwa-cc9dd.web.app",
        },
        data: {
          a: "1",
          b: "2",
        },
      };

      fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: "key=" + FCM_SERVER_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDeviceToken: function() {
      let textarea = document.getElementById("test");
      textarea.innerText = localStorage.getItem("DEVICE_TOKEN");
    },
  },
};
</script>
