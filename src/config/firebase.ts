import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Placeholder config - User should replace with their actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyDq3dlIwGxzK3Aav3A3U4rqSi9HeQnC2D8",
  authDomain: "diabetes-1da67.firebaseapp.com",
  projectId: "diabetes-1da67",
  storageBucket: "diabetes-1da67.firebasestorage.app",
  messagingSenderId: "37911801403",
  appId: "1:379118014031:web:4732cd7b1ba4a898dda43a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
