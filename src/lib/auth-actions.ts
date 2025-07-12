
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: any;
}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return JSON.parse(JSON.stringify(userCredential.user));
  } catch (error: any) {
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
    throw new Error(error.message);
  }
}
