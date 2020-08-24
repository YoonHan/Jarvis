import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FB_DB_URL,
  projectId: process.env.VUE_APP_FB_PROJ_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MSG_SNDR_ID,
  appId: process.env.VUE_APP_FB_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.usePublicVapidKey(process.env.VUE_APP_FB_PUBLIC_VAPID_KEY); // 1. Generate a new key pair

// Request Permission of Notifications
messaging
  .requestPermission()
  .then(() => {
    console.log("Notification permission granted.");

    // Get Token
    messaging.getToken().then((token) => {
      localStorage.setItem("DEVICE_TOKEN", token);
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
  let title = payload.notification.title;
  let body = payload.notification.body;

  // check environment
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    alert(body);
  } else {
    let notification = new Notification(title, body);
    console.info(notification);
  }
});

// Vue init
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
