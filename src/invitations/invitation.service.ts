
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { randomBytes } from 'crypto';
import { User } from 'src/utilisateur/entities/user.entity';
import { InvitationTracking } from './entities/invitation_traking.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(InvitationTracking)
    private readonly trackingRepository: Repository<InvitationTracking>,
    
  ) {}

  async getOrCreateInvitation(id_user: string): Promise<{ code: string; lien: string }> {
    // Vérifie si une invitation existe déjà pour cet utilisateur
    const existing = await this.invitationRepository.findOne({ where: { id_user } });

    if (existing) {
      return {
        code: existing.code_invitation,
        lien: `https://hostolink.app/invite/${existing.code_invitation}`,
      };
    }

    // Génère un nouveau code unique
    const randomCode = 'inv_' + randomBytes(4).toString('hex');

    const nouvelleInvitation = this.invitationRepository.create({
      id_user,
      code_invitation: randomCode,
    });

    await this.invitationRepository.save(nouvelleInvitation);

    return {
      code: nouvelleInvitation.code_invitation,
      lien: `https://hostolink.app/invite/${nouvelleInvitation.code_invitation}`,
    };
  }

  async enregistrerClic(code_invitation: string, ip: string, userAgent: string): Promise<void> {
    const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
    if (!invitation) {
      throw new NotFoundException("Code d'invitation introuvable");
    }

    const tracking = this.trackingRepository.create({
      code_invitation,
      ip_visiteur: ip,
      user_agent: userAgent,
    });

    await this.trackingRepository.save(tracking);

    invitation.nombre_clicks += 1;
    await this.invitationRepository.save(invitation);
  }
}
