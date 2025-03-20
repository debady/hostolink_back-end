import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UserModule } from '../utilisateur/user.module'; 
import { User } from 'src/utilisateur/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
// import { UserEtablissementSante } from 'src/user-etablissement/entities/user_etablissement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp,User]),
    forwardRef(() => UserModule),
    NotificationsModule
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
