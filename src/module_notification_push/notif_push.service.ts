import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';

// // Charge le fichier JSON avec un chemin robuste
// const serviceAccount = require(join(process.cwd(), 'firebase', 'firebase-service-account.json'));


let serviceAccount: any;

if (process.env.FIREBASE_CONFIG_BASE64) {
  // Cas Render (production)
  serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('utf8')
  );
} else {
  // Cas développement local
serviceAccount = require(join(process.cwd(), 'firebase', 'firebase-service-account.json'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.logger.log('✅ Firebase Admin SDK initialisé');
    }
  }

  async sendToToken(token: string, title: string, body: string): Promise<string> {
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      android: { priority: 'high' },
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Notification envoyée au token: ${token} — messageId: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Erreur d’envoi de la notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}
