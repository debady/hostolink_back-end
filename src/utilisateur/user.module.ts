import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ImageService } from 'src/image/image.service'; 
import { Image } from 'src/image/entities/image.entity'; 
import { CompteModule } from 'src/compte/compte.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { Otp } from './entities/otp.entity';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image,Otp]), 
    forwardRef(() => CompteModule),
    forwardRef(() => QrCodeModule),

  ],
  controllers: [UserController],
  providers: [UserService, ImageService,EmailService], 
  exports: [UserService,TypeOrmModule], 
})
export class UserModule {}
