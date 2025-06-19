import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class NotifPushService {
  constructor() {
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(
        process.cwd(),
        'hostolink-notification-firebase-adminsdk-fbsvc-832dc603f9.json'
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
  }

  async sendPushNotification(token: string, title: string, body: string) {
    return admin.messaging().send({
      token,
      notification: { title, body },
    });
  }
}