import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
<<<<<<< HEAD
=======
import { json, urlencoded } from 'express';  
>>>>>>> 901cc4c397c4d8b3438d646f31114b58f6255dca
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
<<<<<<< HEAD

  // ✅ Active la validation globale et filtre les champs non définis dans les DTOs
=======
>>>>>>> 901cc4c397c4d8b3438d646f31114b58f6255dca
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  
      forbidNonWhitelisted: true,  
      transform: true,  
    }),
  );

<<<<<<< HEAD
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
=======
  app.use(json());  
  app.use(urlencoded({ extended: true })); 

  app.enableCors({
    origin: '*', 
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  });

>>>>>>> 901cc4c397c4d8b3438d646f31114b58f6255dca
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`le server tourne bien sur le porte 🚀: http://localhost:${PORT}`);
}

bootstrap();
