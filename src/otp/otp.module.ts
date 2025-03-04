import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { User } from '../user/entities/user.entity'; // ✅ Ajout correct de l'importation de User

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])], // ✅ Ajout de User ici
  providers: [OtpService], 
  exports: [OtpService],   
})
export class OtpModule {}
