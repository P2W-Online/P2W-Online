import { firebase_auth } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth"


export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(firebase_auth, email, password)
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(firebase_auth, email, password)
}

export const doSignOut = () => {
    return firebase_auth.signOut()
}