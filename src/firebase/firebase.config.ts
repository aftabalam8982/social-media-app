import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Message, UserAuthProps } from "../types/types";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGooglePopup = () => {
    return signInWithPopup(auth, provider)
}

export const db = getFirestore(app);


export const createUserDocumentFromAuth = async (userAuth: UserAuthProps, additionalInfo?: { displayName?: string | null }) => {
    if (!userAuth) return;
    const userDocRef = doc(db, 'users', userAuth.uid);    // checking if the user is document is available in db .
    // console.log(userDocRef)
    const userSnapshot = await getDoc(userDocRef);    // getting user Document from firebase db.
    // console.log(userSnapshot.exists())   // return if exit userDoc return true otherwise return false
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        const message: Message[] = []
        try {
            await setDoc(userDocRef, { displayName, email, message, createdAt, ...additionalInfo });
        } catch (error: any) {
            console.log('Error creating User', error.message)
        }
    }
    return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthWithEmailAndPassword = async (email: string, password: string) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = async () => {
    return auth.signOut()
}

export const storage = getStorage(app);
