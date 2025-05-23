// import { Module, Logger } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CommentaireController } from './commentaire.controller';
// import { CommentaireService } from './commentaire.service';
// import { Commentaire } from './entities/commentaire.entity';
// import { Publication } from 'src/publication/entities/publication.entity'; // ✅ AJOUTÉ

// @Module({
//   imports: [TypeOrmModule.forFeature([
//     Commentaire,
//     Publication // ✅ AJOUTÉ
//   ])],
//   controllers: [CommentaireController],
//   providers: [CommentaireService],
//   exports: [CommentaireService]
// })
// export class CommentaireModule {
//   private readonly logger = new Logger(CommentaireModule.name);

//   constructor() {
//     this.logger.log('✅ CommentaireModule initialisé');
//   }
// }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CommentaireService } from './commentaire.service';
import { CommentaireController } from './commentaire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commentaire])],
  controllers: [CommentaireController],
  providers: [CommentaireService],
  exports: [CommentaireService],
})
export class CommentaireModule {}
