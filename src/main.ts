// ------------LOCAL -----------------

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';  
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();



async function bootstrap() {
  try {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  
      forbidNonWhitelisted: true,  
      transform: true,  
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',  
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.SERVE_STATIC === 'true') {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }

  app.use(json());  
  app.use(urlencoded({ extended: true })); 

  app.enableCors({
    origin: '*', 
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`le server tourne bien sur le porte 🚀: http://localhost:${PORT}`);
  console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DATABASE_NAME);

}catch (error) {
    console.error('❌ erreur lors du demarrage de l application', error);
    process.exit(1);
  }
}
bootstrap();



//  ----- config en ligne -------
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);

//     app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
//     app.enableCors({
//       origin: '*',
//       methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type', 'Authorization'],
//       credentials: true,
//     });

//     const PORT = process.env.PORT || 10000;
//     await app.listen(PORT, '0.0.0.0');

//     console.log(`🚀 le Server Tourne sur le port : http://localhost:${PORT}`);
//   } catch (error) {
//     console.error('❌ erreur lors du demarrage de l application', error);
//     process.exit(1);
//   }
// }
// bootstrap();