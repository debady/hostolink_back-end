import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UserModule } from '../utilisateur/user.module'; 
import { User } from 'src/utilisateur/entities/user.entity';
import { FirebaseNotificationsModule } from 'src/firebase_notifications/firebase_notifications.module';
import { SmsService } from 'src/firebase_notifications/sms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User]),
    forwardRef(() => UserModule),
    FirebaseNotificationsModule, 
  ],
  controllers: [OtpController],
  providers: [OtpService,SmsService],
  exports: [OtpService],
})
export class OtpModule {}
