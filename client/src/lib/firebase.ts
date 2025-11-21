// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if Firebase credentials are configured
export const isFirebaseConfigured = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  );
};

let app: any = null;
let authInstance: any = null;
let dbInstance: any = null;

try {
  // Initialize Firebase only if credentials are available
  if (isFirebaseConfigured()) {
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
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export functions to get instances
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => authInstance;
export const getFirebaseDb = () => dbInstance;

// For backwards compatibility
export const auth = authInstance;
export const db = dbInstance;

// Configure Google Auth Provider (only if auth is available)
export const googleProvider = authInstance ? new GoogleAuthProvider() : null;
