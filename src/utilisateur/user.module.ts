import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../code_verif_otp/otp.module';
import { ImageService } from 'src/image/image.service'; 
import { Image } from 'src/image/entities/image.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image]), 
    forwardRef(() => OtpModule), 
  ],
  controllers: [UserController],
  providers: [UserService, ImageService], 
  exports: [UserService], 
})
export class UserModule {}
