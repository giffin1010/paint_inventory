import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ9xdbJ-QxJpxwNR9aEzey12YrvhGODM",
  authDomain: "prim-paint-inventory.firebaseapp.com",
  projectId: "prim-paint-inventory",
  storageBucket: "prim-paint-inventory.firebasestorage.app",
  messagingSenderId: "51627667028",
  appId: "1:51627667028:web:8fdfccea0fec950d4387c1",
  measurementId: "G-ZK987J8NRW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);