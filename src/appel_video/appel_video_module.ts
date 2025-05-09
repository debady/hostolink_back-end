import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppelVideoController } from './appel_video.controller';
import { AppelVideoService } from './appel_video.service';
import { AppelVideo } from './entities/appel_video.entity';

import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { DisponibiliteExpert } from './entities/disponibilite_expert.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppelVideo,
      User,
      DisponibiliteExpert,
      ExpertSante,
    ]),
  ],
  controllers: [AppelVideoController],
  providers: [AppelVideoService],
})
export class AppelVideoModule {}
