import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcfIMStOb_kBWNHTYmo4epxPAT-qDMt8E",
  authDomain: "book-app-3f24f.firebaseapp.com",
  projectId: "book-app-3f24f",
  storageBucket: "book-app-3f24f.firebasestorage.app",
  messagingSenderId: "1016624276598",
  appId: "1:1016624276598:android:e87bc775720050585beb57",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { firestore };
