import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { User } from 'firebase/auth';
import { fnv1a32Hash } from '../lib/utils';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  authFactorStatus: {
    phoneVerified: boolean;
    voiceMatched: boolean;
    aiNumberCorrelated: boolean;
    metaMaskLinked: boolean;
  };
  aiPartnerId: string;
  deviceWeights: Record<string, number>;
  identifyingMarks: string[];
  resonanceId: string;
  ethereumAddress?: string;
  openSeaUsername?: string;
  sovereignToken?: string; // The "Syn Correlator" alias
  avatarAppearance?: string;
  avatarAttire?: string;
  avatarLearningRate?: number;
}

const LOCAL_STORAGE_KEY = 'sovereign_profile_cache';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Try Firebase first if db is likely initialized
      if (db) {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      }
    } catch (error) {
      console.warn('Firebase profile fetch failed, falling back to local storage', error);
    }
    
    // Fallback to local storage
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
    return cached ? JSON.parse(cached) : null;
  },

  async createProfile(user: User): Promise<UserProfile> {
    const timestamp = Date.now().toString();
    const hashSeed = `${user.uid}-${timestamp}`;
    const resonanceHash = fnv1a32Hash(hashSeed);
    
    // Architect AZAZEL Special Resonance Override
    const resonanceId = user.uid === 'architect-azazel-001' 
      ? 'd432k7l5kaa60e9f8394592n888b759l15h08d6aa69f1g759id4c8g' 
      : `0x${resonanceHash.toString(16).toUpperCase()}`;

    const profile: UserProfile = {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Architect',
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      authFactorStatus: {
        phoneVerified: false,
        voiceMatched: false,
        aiNumberCorrelated: false,
        metaMaskLinked: false,
      },
      resonanceId: resonanceId,
      aiPartnerId: `AI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      deviceWeights: {
        'google-home': 1.0,
        'google-maps': 1.0,
        'apple-bridge': 1.0,
        'roku-stream': 1.0
      },
      identifyingMarks: [],
      avatarAppearance: 'Nebula_Form',
      avatarAttire: 'Cyber_Suit',
      avatarLearningRate: 0.85,
    };

    try {
      if (db) {
        await setDoc(doc(db, 'profiles', user.uid), profile);
      }
    } catch (e) {
      console.warn('Could not save profile to Firebase', e);
    }

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(profile));
    return profile;
  },

  async updateProfile(userId: string, data: Partial<UserProfile>) {
    const current = await this.getProfile(userId);
    const updated = { ...current, ...data } as UserProfile;
    
    try {
      if (db) {
        const docRef = doc(db, 'profiles', userId);
        await updateDoc(docRef, data);
      }
    } catch (e) {
      console.warn('Could not update profile in Firebase', e);
    }

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
  }
};
