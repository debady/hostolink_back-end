import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as express from 'express';

// ✅ Charge les variables d'environnement
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { 
      cors: true 
    });

    // 🔥 CRITIQUE: Middleware webhook AVANT tous les autres middlewares
    // Wave envoie du JSON brut qui ne doit PAS être parsé par le middleware JSON global
    app.use(
      '/wave-checkout/webhook',
      express.raw({ type: 'application/json' })
    );

    // ✅ Validation globale des DTOs (APRÈS le middleware webhook)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // ✅ Middleware express globaux (APRÈS le middleware webhook)
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // ✅ CORS config (modifiable en prod dans .env)
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-wave-signature', 'wave-signature'],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    });

    // ✅ Servir des fichiers statiques si activé
    if (process.env.SERVE_STATIC === 'true') {
      app.useStaticAssets(join(__dirname, '..', 'public'));
    }

    const PORT = process.env.PORT || 3000;

    await app.listen(PORT, '0.0.0.0');

    //console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
    //console.log('📦 Connexion à PostgreSQL :', process.env.DATABASE_NAME);
    //console.log('🌊 Webhook Wave configuré sur :', `http://localhost:${PORT}/wave-checkout/webhook`);
    //console.log('🔑 Variables Wave chargées:');
    //console.log('  - WAVE_API_TOKEN:', !!process.env.WAVE_API_TOKEN);
    //console.log('  - WAVE_WEBHOOK_SECRET:', !!process.env.WAVE_WEBHOOK_SECRET);
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l\'application :', error);
    process.exit(1);
  }
}

bootstrap();