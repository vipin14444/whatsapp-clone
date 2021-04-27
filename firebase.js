import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyB9EerQrAH5bbox20lh-dXEoJjU-n-B864",
    authDomain: "whatsapp-clone-bf429.firebaseapp.com",
    projectId: "whatsapp-clone-bf429",
    storageBucket: "whatsapp-clone-bf429.appspot.com",
    messagingSenderId: "1027317790096",
    appId: "1:1027317790096:web:dd10014717aa928133af15"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = app.auth();

const db = app.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider }