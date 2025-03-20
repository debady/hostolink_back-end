import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../utilisateur/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../utilisateur/entities/user.entity';

@Injectable()
export class AuthService {
  generateJwt(_arg0: { id: number; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<{ user: User; access_token: string }> {
    console.log(`🔐 Tentative de connexion avec l'identifiant : ${identifier}`);

    // Recherche utilisateur par identifiant
    const user = await this.userService.findUserByIdentifier(identifier);

    if (!user || !user.mdp) {
      console.warn(`❌ Utilisateur introuvable ou mot de passe non défini pour : ${identifier}`);
      throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }

    console.log(`✅ Utilisateur trouvé : ${user.id_user} (${user.email || user.telephone})`);

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.mdp);
    if (!isMatch) {
      console.warn(`❌ Mot de passe incorrect pour l'utilisateur : ${identifier}`);
      throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }

    // Préparation du payload JWT
    const payload = { id_user: user.id_user, email: user.email };

    // Génération du token JWT
    const access_token = this.jwtService.sign(payload);
    console.log(`✅ Connexion réussie pour : ${user.id_user}, Token généré : ${access_token}`);

    return { user, access_token }; 
  }
}
