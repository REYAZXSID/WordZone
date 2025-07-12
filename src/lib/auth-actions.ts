
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signUp({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: any;
}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update Firebase auth profile
    await updateProfile(user, {
      displayName: username,
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: user.email,
        avatar: `https://i.pravatar.cc/150?u=${user.uid}`, // Use a placeholder avatar service
    });


    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    // Provide more specific error messages
    if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already in use.');
    }
    throw new Error(error.message);
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: any;
}) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return JSON.parse(JSON.stringify(userCredential.user));
  } catch (error: any) {
     if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
    }
    throw new Error(error.message);
  }
}
