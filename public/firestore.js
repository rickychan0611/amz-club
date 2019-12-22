import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAuoMKxIsHpznkkIMQVt_Htpvbfa5p6CXg',
  authDomain: 'solielki-app.firebaseapp.com',
  databaseURL: 'https://solielki-app.firebaseio.com',
  projectId: 'solielki-app',
  storageBucket: 'solielki-app.appspot.com',
  messagingSenderId: '13511495791'
}

const firebaseapp = firebase.initializeApp(config)

const db = firebaseapp.firestore()
const storage = firebaseapp.storage()

export { db, storage }
