import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ✅ Activation des validations globales pour sécuriser les requêtes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    // ✅ Activation de CORS (avec sécurité améliorée)
    app.enableCors({
      origin: '*',  // ⚠️ À restreindre en production
      methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // ✅ Utilisation du PORT depuis Railway ou 3000 en local
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');

    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error starting the application:', error);
    process.exit(1); // Quitte l'application en cas d'erreur critique
  }
}

bootstrap();
