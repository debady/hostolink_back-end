import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UserModule } from '../utilisateur/user.module'; 
import { User } from 'src/utilisateur/entities/user.entity';
import { SmsModule } from '../sms/sms.module'; 


@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User]),
    SmsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [OtpController],
  providers: [OtpService], 
  exports: [OtpService, TypeOrmModule], // ✅ Ajouter TypeOrmModule à exports
})
export class OtpModule {}
