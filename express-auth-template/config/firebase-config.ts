//firebase-config.js
// Description: Imports the Firebase configurations and uses it to initialize the Firebase SDK.
// Exports auth to be used in other files.

import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin/app';

dotenv.config();

const serviceAccount: ServiceAccount = 
{
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp({ 
    credential: cert(serviceAccount as ServiceAccount),
});

const auth = getAuth(app);

export { auth };