import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ9xdbJ-QxJpxwRNr9aEzey12YrvhG0DM",
  authDomain: "prim-paint-inventory.firebaseapp.com",
  projectId: "prim-paint-inventory",
  storageBucket: "prim-paint-inventory.appspot.com",
  messagingSenderId: "51627667028",
  appId: "1:51627667028:web:8fdfccea0fec950d4387c1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);