// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQl0RGBwKzOCsgn1eGc3aBsToNdUBvDfU",
  authDomain: "techaddaa.firebaseapp.com",
  projectId: "techaddaa",
  storageBucket: "techaddaa.firebasestorage.app",
  messagingSenderId: "442706545119",
  appId: "1:442706545119:web:d4354dbe69c858785c1c6a",
  measurementId: "G-6TPTG1888G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services for use in other parts of the app
export { app, analytics, auth, db, storage };
export default app;