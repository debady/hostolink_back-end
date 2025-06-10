
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
