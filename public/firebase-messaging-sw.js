// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
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

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
  // ...
});
