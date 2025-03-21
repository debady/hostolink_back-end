import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThematiqueDiscussionController } from './thematique_discussion.controller';
import { Thematique } from './entities/thematique.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { MessageThematique } from './entities/message_thematique.entity';
import { ThematiqueDiscussionService } from './thematique_message.service';
import { FirebaseModule } from './firebase/firebase.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Thematique,
      MessageThematique,
      User,
      Administrateur,
    ]),
    FirebaseModule,
  ],
  controllers: [ThematiqueDiscussionController],
  providers: [ThematiqueDiscussionService],
})
export class ThematiqueDiscussionModule {}
