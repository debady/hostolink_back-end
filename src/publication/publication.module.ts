// import { Module } from '@nestjs/common';
// import { PublicationService } from './publication.service';
// import { PublicationController } from './publication.controller';
// import { Publication } from './entities/publication.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Publication]), // Ajoutez l'entité ici
//   ],
//   controllers: [PublicationController],
//   providers: [PublicationService],
//   // exports: [PublicationService],
// })
// export class PublicationModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Commentaire])],
  controllers: [PublicationController],
  providers: [PublicationService],
  exports: [PublicationService]
})
export class PublicationModule {}