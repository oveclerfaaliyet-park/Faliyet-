// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAodTcCuVxoLrViiUBCJ3Q96PcJT7ZmvsU",
  authDomain: "sahauygulamasi.firebaseapp.com",
  projectId: "sahauygulamasi",
  storageBucket: "sahauygulamasi.firebasestorage.app",
  messagingSenderId: "1020490427750",
  appId: "1:1020490427750:web:5418f60118c968b395aca7",
  measurementId: "G-8NL327PFZZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
