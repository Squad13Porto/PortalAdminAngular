// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { deleteObject, getStorage, ref, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, browserSessionPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import {setDoc, arrayUnion, getDocs, addDoc, collection, getDoc, updateDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAwRZlaqSIgCTvyjfdf7aDaSZJBFiKJNzA",
    authDomain: "squad13-7ae1e.firebaseapp.com",
    projectId: "squad13-7ae1e",
    storageBucket: "squad13-7ae1e.appspot.com",
    messagingSenderId: "47491240685",
    appId: "1:47491240685:web:c1af953387f6f51ec432e4",
    measurementId: "G-L2TCT9J5R3",
    storageBucket: 'gs://squad13-7ae1e.appspot.com/'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export {setDoc, getDocs, arrayUnion, db, addDoc, collection, getDoc, updateDoc, doc, getFirestore, deleteObject, auth, signInWithEmailAndPassword, onAuthStateChanged, browserSessionPersistence, setPersistence, getStorage, ref, uploadBytes, storage, listAll, getDownloadURL };




