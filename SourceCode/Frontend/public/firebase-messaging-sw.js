importScripts("https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCSr39M8NeVafMwhWMfLkTo0pK-kSMYaWA",
  authDomain: "crisisguard-86c28.firebaseapp.com",
  projectId: "crisisguard-86c28",
  storageBucket: "crisisguard-86c28.firebasestorage.app",
  messagingSenderId: "476853403526",
  appId: "1:476853403526:web:e03694e91d2db5f2c83607",
  measurementId: "G-G1Y4QSVKGF"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: ''
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});