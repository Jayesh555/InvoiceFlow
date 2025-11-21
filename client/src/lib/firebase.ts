// Firebase configuration and initialization
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Check if Firebase credentials are configured
export const isFirebaseConfigured = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  );
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

const initializeFirebase = () => {
  if (app) return; // Already initialized
  if (!isFirebaseConfigured()) return;

  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    googleProviderInstance = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

// Initialize on module load
initializeFirebase();

// Export functions to get instances dynamically
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!app && isFirebaseConfigured()) {
    initializeFirebase();
  }
  return app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (!authInstance && isFirebaseConfigured()) {
    initializeFirebase();
  }
  return authInstance;
};

export const getFirebaseDb = (): Firestore | null => {
  if (!dbInstance && isFirebaseConfigured()) {
    initializeFirebase();
  }
  return dbInstance;
};

export const getGoogleProvider = (): GoogleAuthProvider | null => {
  if (!googleProviderInstance && isFirebaseConfigured()) {
    initializeFirebase();
  }
  return googleProviderInstance;
};

// For backwards compatibility
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();
export const googleProvider = getGoogleProvider();
