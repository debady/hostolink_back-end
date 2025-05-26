import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { In, Repository } from 'typeorm';
  import { CreateAppelDto } from './dto/create-appel.dto';
  import { AppelVideo } from './entities/appel_video.entity';

  import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
  import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/utilisateur/entities/user.entity';

import { TerminerAppelDto } from './dto/terminer-appel.dto';
import { DisponibiliteExpert } from './entities/disponibilite_expert.entity';
import { UpdateAppelStatusDto } from './dto/update-appel-video.dto';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { MajDisponibiliteDto } from './dto/disponibilite-expert.dto';
  
  @Injectable()
  export class AppelVideoService {
    constructor(
      @InjectRepository(AppelVideo)
      private readonly appelRepo: Repository<AppelVideo>,
  
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
  
      @InjectRepository(DisponibiliteExpert)
      private readonly dispoRepo: Repository<DisponibiliteExpert>,
  
      @InjectRepository(ExpertSante)
      private readonly expertRepo: Repository<ExpertSante>,
    ) {}

    private async genererTokenAgora(canal: string, uid: number): Promise<string> {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
    throw new Error('❌ Variables AGORA_APP_ID ou AGORA_APP_CERTIFICATE non définies');
   }

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      canal,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
    );
  }
  
    async lancerAppel(dto: CreateAppelDto): Promise<AppelVideo> {
      const user = await this.userRepo.findOne({ where: { id_user: dto.id_user } });
      if (!user) {
        throw new NotFoundException('Utilisateur introuvable');
      }
  
      const dispo = await this.dispoRepo.findOne({ where: { est_connecte: true } });
      if (!dispo) {
        throw new BadRequestException('Aucun expert disponible actuellement');
      }
  
      const expert = await this.expertRepo.findOne({ where: { id_expert: dispo.id_expert } });
      if (!expert) {
        throw new NotFoundException('Expert introuvable');
      }
  
      const canal = `hostolink-${uuidv4()}`;
      const token = `token-${uuidv4()}`;
  
      const nouvelAppel = this.appelRepo.create({
        utilisateur: user,
        expert: expert,
        canal_agora: canal,
        token_agora: token,
        status_appel: 'en_attente',
        latitude: dto.latitude,
        longitude: dto.longitude,
      });
  
      return await this.appelRepo.save(nouvelAppel);
    }

    async terminerAppel(id_appel: string, dto: TerminerAppelDto) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
      
        if (!appel) {
          throw new NotFoundException('Appel introuvable');
        }
      
        appel.status_appel = 'termine';
        appel.date_fin = new Date();
        appel.compte_rendu = dto.compte_rendu ?? null;
      
        await this.appelRepo.save(appel);
      
        return {
          message: '✅ Appel terminé avec succès',
          appel,
        };
    }

    async verifierAppelActif(id_user: string) {
        const appel = await this.appelRepo.findOne({
          where: {
            utilisateur: { id_user },
            status_appel: In(['en_attente', 'en_cours']),
          },
          relations: ['expert'],
          order: { date_debut: 'DESC' },
        });
      
        if (!appel) {
          return { actif: false, message: 'Aucun appel actif pour cet utilisateur.' };
        }
      
        return {
          actif: true,
          appel,
        };
    }

    async historiqueAppels(id_user: string) {
  const appels = await this.appelRepo.find({
    where: {
      utilisateur: { id_user },
      status_appel: 'termine',
    },
    relations: ['expert'],
    order: { date_debut: 'DESC' },
  });

  return {
    total: appels.length,
    appels,
  };
}

async changerStatusAppel(id_appel: string, dto: UpdateAppelStatusDto) {
  const appel = await this.appelRepo.findOne({ where: { id_appel } });

  if (!appel) {
    throw new NotFoundException('Appel non trouvé');
  }

  appel.status_appel = dto.status_appel;
  return await this.appelRepo.save(appel);
}     

async annulerAppel(id_appel: string): Promise<{ message: string }> {
  // Vérifier que l'appel existe
  const result = await this.appelRepo.delete({ id_appel });
  if (result.affected === 0) {
    throw new NotFoundException('Appel introuvable');
  }
  return { message: '✅ Appel annulé avec succès' };
}

  async mettreAJourDisponibilite(id_expert: number, dto: MajDisponibiliteDto) {
  const dispo = await this.dispoRepo.findOne({ where: { id_expert } });

  if (!dispo) {
    throw new NotFoundException('Expert non inscrit dans disponibilite_expert');
  }

  dispo.est_connecte = dto.est_connecte;
  dispo.derniere_connexion = new Date();

  if (dto.zone_couverte) {
    dispo.zone_couverte = dto.zone_couverte;
  }

  return await this.dispoRepo.save(dispo);
}

async listerExpertsDisponibles() {
  return this.dispoRepo.find({
    where: { est_connecte: true },
    order: { derniere_connexion: 'DESC' },
    relations: ['expert'], // pour inclure les infos de expert_sante
  });
}

async appelsEnAttentePourExpert(id_expert: number) {
  const appels = await this.appelRepo.find({
    where: {
      expert: { id_expert },
      status_appel: 'en_attente',
    },
    relations: ['utilisateur'], // pour avoir les infos du patient
    order: { date_debut: 'DESC' },
  });

  return appels;
}


}
  