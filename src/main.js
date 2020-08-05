import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDkqVHtZP7B5rA9fSkP85QzZEexA8FKSBA",
  authDomain: "vue-pwa-cc9dd.firebaseapp.com",
  databaseURL: "https://vue-pwa-cc9dd.firebaseio.com",
  projectId: "vue-pwa-cc9dd",
  storageBucket: "vue-pwa-cc9dd.appspot.com",
  messagingSenderId: "629646632110",
  appId: "1:629646632110:web:d29dc6c2c9631b7cebb93f",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.usePublicVapidKey(
  "BNafXdWYKm6ZJ_6ShDne7GpuPUmG5M6vaJicuzsxv6JK4VGEDFdW8l1jyhOe5LntHHErp3Ui92gY7KYXxH-N-0o"
); // 1. Generate a new key pair

// Request Permission of Notifications
messaging
  .requestPermission()
  .then(() => {
    console.log("Notification permission granted.");

    // Get Token
    messaging.getToken().then((token) => {
      console.log(token);
    });
  })
  .catch((err) => {
    console.log("Unable to get permission to notify.", err);
  });

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
