import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../utilisateur/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../utilisateur/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // Pour la sacurité des transaction
    private configService: ConfigService,
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

    console.log('✅ Connexion réussie, Token généré:', access_token);
    return { user, access_token }; // <- Important : retourne l'utilisateur complet avec le token
    }


    // console.log('✅ Connexion réussie, Token généré:', access_token);
    // return { access_token };
  
  
  // // Méthode pour signer les JWT des QR codes statiques (longue durée)
  // generateStaticQrCodeToken(payload: any) {
  //   return this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_STATIC_QR_SECRET'),
  //     expiresIn: '365d', // Validité d'un an
  //   });
  // }

  // // Méthode pour signer les JWT des QR codes dynamiques (courte durée)
  // generateStaticQrCodeToken(payload: any) {
  //   return this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_DYNAMIC_QR_SECRET'),
  //     expiresIn: '1m', // Validité d'une minute
  //   });
  // }

  // // Méthode pour vérifier les QR codes
  // verifyQrCodeToken(token: string, isDynamic: boolean = false) {
  //   try {
  //     const secret = isDynamic 
  //       ? this.configService.get('QR_DYNAMIC_SECRET')
  //       : this.configService.get('QR_STATIC_SECRET');
      
  //     return this.jwtService.verify(token, { secret });
  //   } catch (error) {
  //     throw new UnauthorizedException('QR code invalide ou expiré');
  //   }
  // }


  // function generateStaticQrCodeToken(payload: any, any: any) {
  //   throw new Error('Function not implemented.');
  // }
  // function verifyQrCodeToken(token: any, string: any, isDynamic: any, arg3: boolean) {
  //   throw new Error('Function not implemented.');
  // }

}