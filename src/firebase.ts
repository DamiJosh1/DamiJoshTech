import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  initializeAuth, 
  getAuth, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  indexedDBLocalPersistence,
  browserPopupRedirectResolver 
} from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  memoryLocalCache,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence verbose transient offline/reconnect logs in development and iframe environments
try {
  setLogLevel('error');
} catch (e) {
  // Ignored if unsupported
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configure robust auth instance with fallback persistence.
// Prefer browserLocalPersistence (localStorage) first, falling back to indexedDB / browserSessionPersistence.
// This prevents 'Database is closing/hidden' errors when the browser tab or iframe changes visibility or triggers a popup.
let authInstance: any;
try {
  authInstance = initializeAuth(app, {
    persistence: [browserLocalPersistence, indexedDBLocalPersistence, browserSessionPersistence],
    popupRedirectResolver: browserPopupRedirectResolver
  });
} catch (e) {
  // If already initialized, retrieve current instance
  authInstance = getAuth(app);
}

// In sandboxed iframes or environments where IndexedDB can close on tab switch/hidden state,
// initialize Firestore with memoryLocalCache or get standard firestore instance safely.
let dbInstance: any;
try {
  const databaseId = (firebaseConfig as any).firestoreDatabaseId;
  dbInstance = initializeFirestore(app, {
    localCache: memoryLocalCache(),
  }, databaseId);
} catch (e) {
  dbInstance = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
}

export const auth = authInstance;
export const db = dbInstance;
