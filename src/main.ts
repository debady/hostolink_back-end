import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';  
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  
      forbidNonWhitelisted: true,  
      transform: true,  
    }),
  );

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
}

bootstrap();
