import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UserModule } from '../utilisateur/user.module'; 
import { User } from 'src/utilisateur/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User]),
    forwardRef(() => UserModule),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
