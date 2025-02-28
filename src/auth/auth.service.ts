import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<{ access_token: string } | null> {
    const user = await this.userService.findUserByIdentifier(identifier);
  
    if (!user || !user.mdp) {
        console.log('⚠️ Utilisateur introuvable ou mot de passe non défini.');
        throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }

    console.log('Utilisateur trouvé:', user);
    console.log('Mot de passe en base:', user.mdp);
    console.log('Mot de passe fourni:', password);
  
    const isMatch = await bcrypt.compare(password, user.mdp);
    if (!isMatch) {
        console.log('❌ Mot de passe incorrect');
        throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }
  
    const payload = { id_user: user.id_user };
    const access_token = this.jwtService.sign(payload);

    console.log('✅ Connexion réussie, Token généré:', access_token);
    return { access_token };

  }
  
}
