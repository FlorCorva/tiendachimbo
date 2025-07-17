// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBepQaknrGAwcCGZnEeNPeLKjooyAtOTAk",

  authDomain: "tienda-chimbo.firebaseapp.com",

  projectId: "tienda-chimbo",

  storageBucket: "tienda-chimbo.firebasestorage.app",

  messagingSenderId: "200575444537",

  appId: "1:200575444537:web:d9c34cb9a6add275f74fe8",

  measurementId: "G-DKERMHKXJS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
