// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {initializeFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA932M2fjMR7_kALIkOrkp0CD5u4wayRhI',
  authDomain: 'qrproject-93b61.firebaseapp.com',
  projectId: 'qrproject-93b61',
  storageBucket: 'qrproject-93b61.appspot.com',
  messagingSenderId: '815259171115',
  appId: '1:815259171115:web:92fe2e7d3800411d2eed6e',
  measurementId: 'G-CM3SWTD04Z',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export {auth, db};
