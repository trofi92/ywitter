import { initializeApp } from "firebase/app";
import { User, getAuth, updateProfile } from "firebase/auth";
import {
 getStorage,
 ref,
 uploadString,
 getDownloadURL,
 deleteObject,
} from "firebase/storage";
import {
 addDoc,
 collection,
 onSnapshot,
 orderBy,
 query,
 where,
 getDoc,
 getDocs,
 getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
 apiKey: import.meta.env.VITE_APP_API_KEY,
 authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
 projectId: import.meta.env.VITE_APP_PROJECT_ID,
 storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
 messagingSenderId: import.meta.env.VITE_APP_SENDER_ID,
 appId: import.meta.env.VITE_APP_APP_ID,
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);
export {
 addDoc,
 collection,
 onSnapshot,
 orderBy,
 query,
 where,
 getDoc,
 getDocs,
 updateProfile,
 ref,
 uploadString,
 getDownloadURL,
 deleteObject,
};

export type { User };
