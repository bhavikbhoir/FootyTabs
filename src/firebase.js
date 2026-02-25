import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase only if config is provided
let app = null;
let analytics = null;

if (firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
}

export { app, analytics };
