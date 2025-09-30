// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-1892957051-7a969",
  "appId": "1:678016294873:web:5529a606f66611a13fc3c8",
  "apiKey": "AIzaSyBDQd1emn7bgyaR7YCm-JhwJF0W5bjtfTU",
  "authDomain": "studio-1892957051-7a969.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "678016294873"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
