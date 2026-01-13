// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKCDSw8KYRb6SOrd0liRKswC5TrW1gF2Q",
  authDomain: "site-ricardo-lins-futurista.firebaseapp.com",
  projectId: "site-ricardo-lins-futurista",
  storageBucket: "site-ricardo-lins-futurista.firebasestorage.app",
  messagingSenderId: "721581510068",
  appId: "1:721581510068:web:8610c2e6a6d4b7603936e1",
  measurementId: "G-NBXGYLSJ22",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export let analytics = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});
