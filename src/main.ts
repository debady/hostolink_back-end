import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';  // Ajout pour gérer le JSON et les données encodées
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Active la validation globale et filtre les champs non définis dans les DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // Supprime les champs non définis dans les DTOs
      forbidNonWhitelisted: true,  // Rejette les champs non autorisés
      transform: true,  // Convertit automatiquement les types (ex: string -> number)
    }),
  );

  // Middleware pour s'assurer que les requêtes JSON sont bien traitées
  app.use(json());  // Active le parsing du JSON
  app.use(urlencoded({ extended: true }));  // Active le parsing des URL encodées

  // Configuration CORS
  app.enableCors({
    origin: '*',  // Autorise toutes les origines
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],  // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'],  // En-têtes autorisés
  });

  // Option : Servir des fichiers statiques si nécessaire
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
