'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'torelli-e-anchar-agendamentos',
  appId: '1:487123448810:web:3f32ac7683b24d287db893',
  storageBucket: 'torelli-e-anchar-agendamentos.firebasestorage.app',
  apiKey: 'AIzaSyAs53Sr98GT8ba8ltCM5gbqYfckSoQyQ0k',
  authDomain: 'torelli-e-anchar-agendamentos.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '487123448810',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
