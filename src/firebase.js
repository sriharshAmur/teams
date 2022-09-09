import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "teams-clone-react.firebaseapp.com",
  projectId: "teams-clone-react",
  storageBucket: "teams-clone-react.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const signOutUser = async () => {
  await signOut(auth)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log("Some error happened");
      console.log(error);
    });
};

export { auth, db, signOutUser };
