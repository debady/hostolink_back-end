// src/firebase/firebase.service.ts

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { config } from 'dotenv';

config(); // ⬅️ Active le fichier .env

@Injectable()
export class FirebaseService {
  constructor() {
    const firebaseKeyPath = process.env.FIREBASE_CREDENTIAL_PATH;

    if (!firebaseKeyPath) {
      throw new Error('❌ La variable FIREBASE_CREDENTIAL_PATH est absente dans le fichier .env');
    }

    const serviceAccountPath = path.resolve(process.cwd(), firebaseKeyPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });

    console.log('✅ Firebase initialisé depuis :', serviceAccountPath);
  }

  async sendNotification(fcmToken: string, title: string, body: string) {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
  }
}
