
// import { Module, Logger } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PublicationController } from './publication.controller';
// import { PublicationService } from './publication.service';
// import { Publication } from './entities/publication.entity';
// // import { AuthModule } from 'src/auth/auth.module';
// // import { AnyAuthGuard } from 'src/auth/any-auth.guard';
// // import { JwtAdminGuard, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// // import { JwtEtablissementAuthGuard } from 'src/auth/jwt-etablissement.guard';
// // import { JwtExpertGuard } from 'src/user_etablissement_sante/guards/jwt-expert.guard';
// import { SocialCloudinaryModule } from 'src/social_cloudinary/social_cloudinary.module';


// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Publication]),
//     SocialCloudinaryModule
//     // AuthModule,
//     // AnyAuthGuard,
//   ],
//   controllers: [PublicationController],
//   providers: [PublicationService,],
//   exports: [PublicationService,]
// })
// export class PublicationModule {
//   // private readonly logger = new Logger(PublicationModule.name);

//   // constructor() {
//   //   this.logger.log('✅ PublicationModule initialisé');
//   // }
// }



import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/1-Module_reseaux_sociale/commentaire/entities/commentaire.entity'; // ✅ AJOUTÉ
import { Partage } from 'src/1-Module_reseaux_sociale/partage/entities/partage.entity'; // ✅ AJOUTÉ
import { SocialCloudinaryModule } from 'src/social_cloudinary/social_cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Publication, 
      Commentaire, // ✅ AJOUTÉ
      Partage      // ✅ AJOUTÉ
    ]),
    SocialCloudinaryModule
  ],
  controllers: [PublicationController],
  providers: [PublicationService],
  exports: [PublicationService]
})
export class PublicationModule {}