import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5-lLcRylJM5p15migLO8IinW7mHsPsZk",
  authDomain: "dentalsystem-c49de.firebaseapp.com",
  projectId: "dentalsystem-c49de",
  storageBucket: "dentalsystem-c49de.appspot.com",
  messagingSenderId: "557474895497",
  appId: "1:557474895497:web:b6e83b96fcfb864c565858"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);