import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: This file will be populated with real config when set_up_firebase tool is run.
// For now, it provides the bridge for the profileService.

import firebaseConfig from '../../firebase-applet-config.json';

const hasConfig = (config: any) => config && config.apiKey && config.apiKey.length > 0;

const app = hasConfig(firebaseConfig) ? initializeApp(firebaseConfig as any) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
