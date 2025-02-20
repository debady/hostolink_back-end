import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Servir les fichiers statiques (ex: images de profil)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // ✅ Accès via http://localhost:3000/uploads/nom_du_fichier.jpg
  });

  // ✅ Protection & validation des entrées utilisateur
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Autoriser les requêtes depuis le front Flutter
  app.enableCors({
    origin: '*', // 🚨 Modifier si nécessaire pour plus de sécurité
    methods: ['GET', 'HEAD', 'PATCH','POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  console.log(`📸 Les fichiers uploadés sont accessibles via : http://localhost:${PORT}/uploads/`);
}

bootstrap();
