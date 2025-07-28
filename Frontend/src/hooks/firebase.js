import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjE7jfHZkXaoRMkhOg_3wHWl7QZu1NVvc",
  authDomain: "pharagraph-3862d.firebaseapp.com",
  projectId: "pharagraph-3862d",
  storageBucket: "pharagraph-3862d.firebasestorage.app",
  messagingSenderId: "409836048680",
  appId: "1:409836048680:web:712d03543d08eb6205801d",
  measurementId: "G-7BV8NS8826"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };