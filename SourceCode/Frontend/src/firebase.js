import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSr39M8NeVafMwhWMfLkTo0pK-kSMYaWA",
  authDomain: "crisisguard-86c28.firebaseapp.com",
  projectId: "crisisguard-86c28",
  storageBucket: "crisisguard-86c28.firebasestorage.app",
  messagingSenderId: "476853403526",
  appId: "1:476853403526:web:e03694e91d2db5f2c83607",
  measurementId: "G-G1Y4QSVKGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);



export { messaging, getToken, onMessage };