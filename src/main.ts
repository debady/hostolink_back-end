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

// // ------------LOCAL -----------------
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', 
    methods: ['GET', 'HEAD', 'PATCH','POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
}
bootstrap();

