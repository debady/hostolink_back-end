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
import { RefusAppelDto } from './dto/refuse-appel_video.dto';
  
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
  //console.log('📥 Requête reçue pour lancer un appel avec ID utilisateur :', dto.id_user);

  const user = await this.userRepo.findOne({ where: { id_user: dto.id_user } });
  if (!user) {
    console.error('❌ Utilisateur introuvable avec l’ID :', dto.id_user);
    throw new NotFoundException('Utilisateur introuvable');
  }
  //console.log('✅ Utilisateur trouvé :', user.nom || user.email || user.id_user);

  const dispos = await this.dispoRepo.find({
    where: { est_connecte: true },
    order: { derniere_connexion: 'DESC' },
  });

  //console.log('📋 Experts disponibles trouvés :', dispos.length);

  let expert: ExpertSante | null = null;
  let dispoValide: DisponibiliteExpert | null = null;

  for (const dispo of dispos) {
    //console.log('🔍 Vérification de disponibilité pour id_expert =', dispo.id_expert);

    const e = await this.expertRepo.findOne({ where: { id_expert: dispo.id_expert } });

    if (e) {
      //console.log('✅ Expert trouvé :', e.nom, e.prenom, '(id:', e.id_expert, ')');
      expert = e;
      dispoValide = dispo;
      break;
    } else {
      console.warn('⚠️ Expert introuvable pour id_expert =', dispo.id_expert);
    }
  }

  if (!expert) {
    console.error('❌ Aucun expert valide disponible actuellement');
    throw new BadRequestException('Aucun expert disponible actuellement');
  }

  const canal = `hostolink-${uuidv4()}`;
  const token = `token-${uuidv4()}`;

  //console.log('📡 Canal Agora généré :', canal);
  //console.log('🔐 Token Agora généré :', token);

  const nouvelAppel = this.appelRepo.create({
    utilisateur: user,
    expert: expert,
    canal_agora: canal,
    token_agora: token,
    status_appel: 'en_attente',
    latitude: dto.latitude,
    longitude: dto.longitude,
  });

  const appelSauvegarde = await this.appelRepo.save(nouvelAppel);

  //console.log('✅ Appel vidéo enregistré avec succès. ID appel :', appelSauvegarde.id_appel);

  return appelSauvegarde;
}


  
    // async lancerAppel(dto: CreateAppelDto): Promise<AppelVideo> {
    //   const user = await this.userRepo.findOne({ where: { id_user: dto.id_user } });
    //   if (!user) {
    //     throw new NotFoundException('Utilisateur introuvable');
    //   }
  
    //   const dispo = await this.dispoRepo.findOne({ where: { est_connecte: true } });
    //   if (!dispo) {
    //     throw new BadRequestException('Aucun expert disponible actuellement');
    //   }
  
    //   const expert = await this.expertRepo.findOne({ where: { id_expert: dispo.id_expert } });
    //   if (!expert) {
    //     throw new NotFoundException('Expert introuvable');
    //   }
  
    //   const canal = `hostolink-${uuidv4()}`;
    //   const token = `token-${uuidv4()}`;
  
    //   const nouvelAppel = this.appelRepo.create({
    //     utilisateur: user,
    //     expert: expert,
    //     canal_agora: canal,
    //     token_agora: token,
    //     status_appel: 'en_attente',
    //     latitude: dto.latitude,
    //     longitude: dto.longitude,
    //   });
  
    //   return await this.appelRepo.save(nouvelAppel);
    // }

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

async accepterAppel(id_appel: string) {
  const appel = await this.appelRepo.findOne({ where: { id_appel } });

  if (!appel) {
    throw new NotFoundException('Appel introuvable');
  }

  if (appel.status_appel !== 'en_attente') {
    throw new BadRequestException('Cet appel ne peut pas être accepté (déjà en cours ou terminé)');
  }

  appel.status_appel = 'en_cours';
  await this.appelRepo.save(appel);

  return {
    message: '✅ Appel accepté avec succès',
    appel,
  };
}

async terminerAppelParExpert(id_appel: string, dto: TerminerAppelDto) {
  const appel = await this.appelRepo.findOne({ where: { id_appel } });

  if (!appel) {
    throw new NotFoundException('Appel introuvable');
  }

  appel.status_appel = 'termine';
  appel.date_fin = new Date();
  appel.compte_rendu = dto.compte_rendu ?? null;

  await this.appelRepo.save(appel);

  return {
    message: '✅ Appel terminé par l\'expert avec succès',
    appel,
  };
}


async historiqueAppelsExpert(id_expert: number) {
  const appels = await this.appelRepo.find({
    where: {
      expert: { id_expert },
      status_appel: 'termine',
    },
    relations: ['utilisateur'],
    order: { date_debut: 'DESC' },
  });

  return {
    total: appels.length,
    appels,
  };
}


async refuserAppel(id_appel: string, dto: RefusAppelDto) {
  const appel = await this.appelRepo.findOne({ where: { id_appel } });

  if (!appel) {
    throw new NotFoundException('Appel introuvable');
  }

  if (appel.status_appel !== 'en_attente') {
    throw new BadRequestException('Seuls les appels en attente peuvent être refusés');
  }

  appel.status_appel = 'refuse';
  if (dto.motif) {
    appel.compte_rendu = dto.motif; // facultatif, pour archivage
  }

  await this.appelRepo.save(appel);

  return {
    message: '🚫 Appel refusé par l\'expert',
    appel,
  };
}


async verifierAppelEnCoursPourExpert(id_expert: number) {
  const appel = await this.appelRepo.findOne({
    where: {
      expert: { id_expert },
      status_appel: 'en_cours',
    },
    relations: ['utilisateur'], // pour donner le nom du patient à l’expert
    order: { date_debut: 'DESC' },
  });

  if (!appel) {
    return {
      en_cours: false,
      message: 'Aucun appel en cours',
    };
  }

  return {
    en_cours: true,
    appel: {
      id_appel: appel.id_appel,
      canal_agora: appel.canal_agora,
      token_agora: appel.token_agora,
      date_debut: appel.date_debut,
      utilisateur: {
        id_user: appel.utilisateur?.id_user,
        nom: appel.utilisateur?.nom,
        prenom: appel.utilisateur?.prenom,
      }
    },
  };
}


}
  