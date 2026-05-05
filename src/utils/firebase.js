import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIblT0vFP7uQzxeqN-nhrHgn0s4UPCK6w",
  authDomain: "music-tunes-bb3ed.firebaseapp.com",
  projectId: "music-tunes-bb3ed",
  storageBucket: "music-tunes-bb3ed.firebasestorage.app",
  messagingSenderId: "351225554567",
  appId: "1:351225554567:web:358df57b42d5d0077efa22",
  measurementId: "G-7Y845ZRCW9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
