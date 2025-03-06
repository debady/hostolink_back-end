// // ------------LOCAL -----------------
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   app.useGlobalPipes(new ValidationPipe());

//   app.enableCors({
//     origin: '*', 
//     methods: ['GET', 'HEAD', 'PATCH','POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });

//   const PORT = 3000;
//   await app.listen(PORT, '0.0.0.0');

//   console.log(`🚀 Application is running on: http://localhost:${PORT}`);
// }

// bootstrap();