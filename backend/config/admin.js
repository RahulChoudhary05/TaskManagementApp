import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin (optional - for server-side operations)
const initializeFirebaseAdmin = () => {
  try {
    if (admin.apps.length > 0) {
      return admin;
    }

    // Only initialize if complete credentials are provided
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && 
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        process.env.FIREBASE_ADMIN_PROJECT_ID) {
      
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_ADMIN_CERT_URL
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase Admin SDK initialized');
      return admin;
    } else {
      console.log('⚠️  Firebase Admin SDK not configured (optional)');
      console.log('   Backend will work with client-side Firebase auth');
      return null;
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.log('⚠️  Backend will work with limited functionality');
    return null;
  }
};

const firebaseAdmin = initializeFirebaseAdmin();

export const auth = firebaseAdmin ? firebaseAdmin.auth() : null;
export const db = firebaseAdmin ? firebaseAdmin.firestore() : null;
export const isFirebaseAdminReady = firebaseAdmin !== null;
export default firebaseAdmin;
