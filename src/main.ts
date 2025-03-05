import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

console.log('📌 DATABASE_URL:', process.env.DATABASE_URL);
console.log('📌 JWT_SECRET:', process.env.JWT_SECRET);

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ✅ Activation des validations globales
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    // ✅ Configuration CORS pour autoriser toutes les origines (ajuste si besoin)
    app.enableCors({
      origin: '*',
      methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // ✅ Utilisation du port dynamique de Render
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');

    console.log(`🚀 Server is running on: http://0.0.0.0:${PORT}`);
  } catch (error) {
    console.error('❌ Error starting the application:', error);
    process.exit(1); // ✅ Quitte l'application proprement si erreur critique
  }
}

bootstrap();
