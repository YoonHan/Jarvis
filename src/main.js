import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import firebase from "firebase/app";
import "firebase/messaging";

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
      localStorage.setItem("DEVICE_TOKEN", token);
      console.log(token);
    });
  })
  .catch((err) => {
    console.log("Unable to get permission to notify.", err);
  });

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
  // ...
  let title = payload.notification.title;
  let body = payload.notification.content;

  // check environment
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    alert(navigator.userAgent);
  } else {
    let notification = new Notification(title, body);
    console.log(`${notification.title} ${notification.body}`);
  }
});

// Vue init
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
