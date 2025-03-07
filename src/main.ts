import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Active la validation globale et filtre les champs non définis dans les DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // Supprime les champs non définis dans les DTOs
      forbidNonWhitelisted: true,  // Rejette les champs non autorisés
      transform: true,  // Convertit automatiquement les types (ex: string -> number)
    }),
  );

  // ✅ Configuration CORS (différenciation dev/prod)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',  // En production, définir `CORS_ORIGIN` dans `.env`
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Optionnel : Servir des fichiers statiques (ex: images, PDF, etc.)
  if (process.env.SERVE_STATIC === 'true') {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }

  // ✅ Démarrage du serveur
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
