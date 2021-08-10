import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize your firebase app
var firebaseConfig = {}
firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({ timestampsInSnapshots: true })
const db = firebase.firestore()

const schoolCollection = db.collection('')
export { db, schoolCollection }
