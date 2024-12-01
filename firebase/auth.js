import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@firebase/auth';
import { firebase_auth, firebase_db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const doCreateUserWithEmailAndPassword = async (name, email, username, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebase_auth, email, password);
    const { user } = userCredential;

    // Luo user documentin firestoressa
    await setDoc(doc(firebase_db, 'users', user.uid), {
      name,
      email,
      username,
      score: 0, 
      coins:0, 
      inventory: {
        commonBox: 0, 
        rareBox: 0,
        legendaryBox: 0,
    },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const doSignOut = async () => {
  try {
    await signOut(firebase_auth);
  } catch (error) {
    throw error;
  }
};