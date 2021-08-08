import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize your firebase app
var firebaseConfig = {
  apiKey: 'AIzaSyA1Sq-MbZBovtxcGH9PFtj5wseBrJqFuNA',
  authDomain: 'bestschoolservicefornkust.firebaseapp.com',
  projectId: 'bestschoolservicefornkust',
  storageBucket: 'bestschoolservicefornkust.appspot.com',
  messagingSenderId: '813465852733',
  appId: '1:813465852733:web:9857cc690ffb0755d84354',
  measurementId: 'G-P1RQNTNK4Y'
}
firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({ timestampsInSnapshots: true })
const db = firebase.firestore()

const schoolCollection = db.collection('nkust')
export { db, schoolCollection }
