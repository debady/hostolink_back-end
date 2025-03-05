import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';  // Ajout de NestExpressApplication
import { join } from 'path';  // Si tu veux ajouter une fonctionnalité comme gérer des fichiers statiques

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);  // Utilisation de NestExpressApplication

  // Active la validation globale dans toute l'application
  app.useGlobalPipes(new ValidationPipe());

  // Configuration CORS pour autoriser les requêtes provenant de n'importe quelle origine
  app.enableCors({
    origin: '*',  // Permet toutes les origines
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],  // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'],  // En-têtes autorisés
  });

  // Si tu veux servir des fichiers statiques, tu peux ajouter une ligne comme celle-ci
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');  // Écoute sur toutes les adresses (0.0.0.0) et sur le port 3000

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
