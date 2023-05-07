import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDgKbsC-8fjY-WzlmPrL-C0wNWvNXuJu5w",
    authDomain: "walkie-talkie-dcfee.firebaseapp.com",
    projectId: "walkie-talkie-dcfee",
    storageBucket: "walkie-talkie-dcfee.appspot.com",
    messagingSenderId: "829120246881",
    appId: "1:829120246881:web:6c9bf19d2b0e63dd326620"
  };

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app);