import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../code_verif_otp/otp.module';
import { ImageService } from 'src/image/image.service';  // ✅ Import de ImageService
import { Image } from 'src/image/entities/image.entity';  // ✅ Import de Image
import { CompteModule } from 'src/compte/compte.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image]),  // ✅ Ajout de Image dans forFeature
    forwardRef(() => OtpModule),  // ✅ Utilisation de forwardRef pour éviter la dépendance circulaire
    forwardRef(() => CompteModule), // Pour éviter l'injection circulaire
    forwardRef(() => QrCodeModule), // Ajoutez cette ligne pour résoudre l'erreur
  ],
  controllers: [UserController],
  providers: [UserService, ImageService],  // ✅ Ajout de ImageService dans providers
  exports: [UserService],  // ✅ Exporte UserService pour d'autres modules
})
export class UserModule {}
