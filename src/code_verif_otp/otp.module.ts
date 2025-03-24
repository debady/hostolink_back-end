import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpController } from './otp.controller';
import { UserModule } from '../utilisateur/user.module'; 
import { User } from 'src/utilisateur/entities/user.entity';
import { OtpService } from './otp.service';

import { SmsModule } from '../sms/sms.module'; 


@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User]),
    forwardRef(() => SmsModule), 
    forwardRef(() => UserModule),
    forwardRef(() => UserModule),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService, TypeOrmModule],
})
export class OtpModule {}
