import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../otp/otp.module'; // ✅ Import du module OTP

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Charge l'entité `User`
    OtpModule, // ✅ Permet d'utiliser `OtpService` dans `UserService`
  ],
  controllers: [UserController],
  providers: [UserService], // ❌ Supprimé `OtpService` car déjà fourni par `OtpModule`
  exports: [UserService], // ✅ On exporte `UserService` pour d'autres modules si besoin
})
export class UserModule {}
