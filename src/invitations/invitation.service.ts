
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { randomBytes } from 'crypto';
import { User } from 'src/utilisateur/entities/user.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
