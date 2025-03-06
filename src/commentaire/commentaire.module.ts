import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentaireController } from './commentaire.controller';
import { CommentaireService } from './commentaire.service';
import { Commentaire } from './entities/commentaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commentaire])],
  controllers: [CommentaireController],
  providers: [CommentaireService],
  exports: [CommentaireService]
})
export class CommentaireModule {}