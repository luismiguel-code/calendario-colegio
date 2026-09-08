import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAozH0jIrWqKnW8n0UuEL_kLYzJROLhj9E",
  authDomain: "calendario-sanmiguel-1b.firebaseapp.com",
  projectId: "calendario-sanmiguel-1b",
  storageBucket: "calendario-sanmiguel-1b.firebasestorage.app",
  messagingSenderId: "291561969192",
  appId: "1:291561969192:web:083ce897bd91733b0d471d",
  measurementId: "G-XJ19X71NL4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
