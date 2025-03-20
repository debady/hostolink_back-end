import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../code_verif_otp/otp.module';
import { ImageService } from 'src/image/image.service';  // ✅ Import de ImageService
import { Image } from 'src/image/entities/image.entity';  // ✅ Import de Image

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image]),  // ✅ Ajout de Image dans forFeature
    forwardRef(() => OtpModule),  // ✅ Utilisation de forwardRef pour éviter la dépendance circulaire
  ],
  controllers: [UserController],
  providers: [UserService, ImageService],  // ✅ Ajout de ImageService dans providers
  exports: [UserService],  // ✅ Exporte UserService pour d'autres modules
})
export class UserModule {}
