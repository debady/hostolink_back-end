import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // Pour la sacurité des transaction
    private configService: ConfigService,
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
  
  // Méthode pour signer les JWT des QR codes statiques (longue durée)
  generateStaticQrCodeToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_STATIC_QR_SECRET'),
      expiresIn: '365d', // Validité d'un an
    });
  }

  // Méthode pour signer les JWT des QR codes dynamiques (courte durée)
  generateDynamicQrCodeToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_DYNAMIC_QR_SECRET'),
      expiresIn: '1m', // Validité d'une minute
    });
  }

  // Méthode pour vérifier les QR codes
  verifyQrCodeToken(token: string, isDynamic: boolean = false) {
    try {
      const secret = isDynamic 
        ? this.configService.get('QR_DYNAMIC_SECRET')
        : this.configService.get('QR_STATIC_SECRET');
      
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('QR code invalide ou expiré');
    }
  }
}