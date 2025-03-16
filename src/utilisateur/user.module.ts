import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../code_verif_otp/otp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    forwardRef(() => OtpModule),
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService],
})
export class UserModule {}