// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB-di9krg0eYJW-9SuiESRd_o6sQpfrqBA",
  authDomain: "esp-project-39328.firebaseapp.com",
  databaseURL: "https://esp-project-39328-default-rtdb.firebaseio.com",
  projectId: "esp-project-39328",
  storageBucket: "esp-project-39328.firebasestorage.app",
  messagingSenderId: "992659410472",
  appId: "1:992659410472:web:1251f0afbf859936c26f1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export db (Realtime Database) so it can be used in other files
export { db };
