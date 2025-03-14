import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { User } from '../utilisateur/entities/user.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])], 
  providers: [OtpService], 
  exports: [OtpService],   
})
export class OtpModule {}
