import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf9fthG2Kwv4V_L85ws-e2pGZZ6OiEPJ8",
  authDomain: "watergenic-bd105.firebaseapp.com",
  projectId: "watergenic-bd105",
  storageBucket: "watergenic-bd105.firebasestorage.app",
  messagingSenderId: "521066010338",
  appId: "1:521066010338:web:75af210dec58ee70cdf0bb",
  measurementId: "G-R9ZVCPPEWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
