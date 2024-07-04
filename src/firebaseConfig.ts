import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAjQWfdf8fQO1_4-s8AKIBv23PoZITVrd8",
    authDomain: "monbraz-c7168.firebaseapp.com",
    projectId: "monbraz-c7168",
    storageBucket: "monbraz-c7168.appspot.com",
    messagingSenderId: "412811689984",
    appId: "1:412811689984:web:c17126a08625ef8f7ad8e5",
    measurementId: "G-WH7TZMFHJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;
