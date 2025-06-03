// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { Utilisateur } from './entities/utilisateur.entity';
// import { JwtService } from '@nestjs/jwt';
// import { ChangeIdentifiantDto } from './dto/change-identifiant.dto';
// import { ConfirmIdentifiantDto } from './dto/confirm-identifiant.dto';

// @Injectable()
// export class UtilisateurService {
//   constructor(
//     @InjectRepository(Utilisateur)
//     private readonly userRepo: Repository<Utilisateur>,
//     private readonly jwtService: JwtService,
//   ) {}

//   async register(dto: CreateUtilisateurDto) {
//     const identifiant = dto.identifiant.trim();
//     const isEmail = identifiant.includes('@') && identifiant.includes('.');
  
//     let user = await this.userRepo.findOneBy([
//       { email: identifiant },
//       { telephone: identifiant },
//     ]);
  
//     // ✅ Si l'utilisateur existe déjà → régénère un OTP et retourne un message
//     if (user) {
//       const now = new Date();
//       const code = Math.floor(1000 + Math.random() * 9000).toString();
  
//       user.otp_code = code;
//       user.otp_expires_at = new Date(now.getTime() + 5 * 60 * 1000);
//       user.otp_last_sent_at = now;
  
//       await this.userRepo.save(user);
  
//       return {
//         message: 'Utilisateur déjà inscrit. Un nouveau code OTP vous a été envoyé.',
//         id: user.id,
//         identifiant,
//         code, // simulation
//       };
//     }
  
//     // ✅ Création dynamique si nouveau
//     user = this.userRepo.create({
//       pseudo: 'Belle personne',
//       email: isEmail ? identifiant : undefined,
//       telephone: !isEmail ? identifiant : undefined,
//       methode_connexion: isEmail ? 'email' : 'telephone',
//     });
  
//     return this.userRepo.save(user);
//   }
  
  
  

//   async generateOtp(identifiant: string) {
//     const user = await this.findByIdentifiant(identifiant);
  
//     const now = new Date();
  
//     // 1. Vérifie si l’utilisateur est bloqué
//     if (user.otp_blocked_until && user.otp_blocked_until > now) {
//       const minutes = Math.ceil((user.otp_blocked_until.getTime() - now.getTime()) / 60000);
//       throw new BadRequestException(`Trop de tentatives. Réessayez dans ${minutes} minutes.`);
//     }
  
//     // 2. Vérifie si l’envoi précédent date de moins de 10 secondes
//     if (user.otp_last_sent_at && now.getTime() - user.otp_last_sent_at.getTime() < 10000) {
//       throw new BadRequestException(`Veuillez attendre quelques secondes avant de redemander un code.`);
//     }
  
//     // 3. Incrémente le compteur
//     user.otp_attempt_count = (user.otp_attempt_count || 0) + 1;
//     user.otp_last_sent_at = now;
  
//     // 4. S’il a dépassé 3 tentatives → bloquer pendant 20 min
//     if (user.otp_attempt_count >= 3) {
//       user.otp_blocked_until = new Date(now.getTime() + 20 * 60 * 1000);
//       user.otp_attempt_count = 0; // reset
//     }
  
//     // 5. Génère le code OTP
//     const code = Math.floor(1000 + Math.random() * 900).toString();
//     user.otp_code = code;
//     user.otp_expires_at = new Date(now.getTime() + 5 * 60 * 1000); 
  
//     await this.userRepo.save(user);
  
//     return { message: 'Code OTP généré (simulation)', code };
//   }
  

//   async verifyOtp(dto: VerifyOtpDto) {
//     const user = await this.findByIdentifiant(dto.identifiant);
  
//     // Cas : OTP déjà utilisé
//     if (!user.otp_code || !user.otp_expires_at) {
//       throw new BadRequestException('Aucun OTP actif. Veuillez en redemander un.');
//     }
  
//     // Cas : expiré
//     const now = new Date();
//     if (user.otp_expires_at.getTime() < now.getTime()) {
//       throw new BadRequestException('Le code OTP est expiré.');
//     }
  
//     // Cas : mauvais code
//     if (user.otp_code !== dto.code) {
//       throw new BadRequestException('Code OTP incorrect.');
//     }
  
//     // Valide
//     user.is_verified = true;
//     user.otp_code = undefined;
//     user.otp_expires_at = undefined;
//     await this.userRepo.save(user);
  
//     // Génère le token JWT
//     const token = this.jwtService.sign({ sub: user.id });
  
//     return {
//       message: 'Vérification réussie ✅',
//       token,
//     };
//   }
//   async getProfile(id: string) {
//     const user = await this.userRepo.findOneBy({ id });
//     if (!user) throw new NotFoundException('Utilisateur introuvable');
//     return user;
//   }

//   async updateProfile(id: string, dto: UpdateProfileDto) {
//     const user = await this.getProfile(id);
  
//     // ⚠️ Vérifie si le pseudo a changé
//     if (dto.pseudo && dto.pseudo !== user.pseudo) {
//       const existingPseudo = await this.userRepo.findOneBy({ pseudo: dto.pseudo });
//       if (existingPseudo && existingPseudo.id !== id) {
//         throw new BadRequestException('Ce pseudo est déjà utilisé par un autre utilisateur.');
//       }
//       user.pseudo = dto.pseudo;
//     }
  
//     // ✅ Image de profil (on l’update toujours)
//     user.image_profil = dto.image_profil;
  
//     return this.userRepo.save(user);
//   }
  
  

//   private async findByIdentifiant(identifiant: string): Promise<Utilisateur> {
//     const user = await this.userRepo.findOneBy([
//       { email: identifiant },
//       { telephone: identifiant },
//     ]);
//     if (!user) throw new NotFoundException('Identifiant introuvable');
//     return user;
//   }

//   async checkIdentifiant(identifiant: string): Promise<boolean> {
//     const user = await this.userRepo.findOneBy([
//       { email: identifiant },
//       { telephone: identifiant },
//     ]);
//     return !!user;
//   }

//   async deleteUser(id: string): Promise<{ message: string }> {
//     await this.userRepo.delete(id);
//     return { message: 'Compte supprimé avec succès.' };
//   }

//   async getAllUsers() {
//     const [users, count] = await this.userRepo.findAndCount();
//     return {
//       total: count,
//       utilisateurs: users,
//     };
//   }
  
  
//   async getAllPseudos() {
//     const users = await this.userRepo.find({ select: ['pseudo'] });
//     return users.map(u => u.pseudo);
//   }


//   async sendOtpForIdentifiantChange(id: string, dto: ChangeIdentifiantDto) {
//     const user = await this.getProfile(id);
  
//     const current = user.email || user.telephone;
//     if (dto.ancien_identifiant !== current) {
//       throw new BadRequestException("L'identifiant ne correspond pas.");
//     }
  
//     const code = Math.floor(1000 + Math.random() * 9000).toString();
//     const now = new Date();
  
//     user.otp_code = code;
//     user.otp_expires_at = new Date(now.getTime() + 5 * 60 * 1000);
  
//     await this.userRepo.save(user);
  
//     return {
//       message: "Code OTP envoyé sur l'ancien identifiant.",
//       code
//     };
//   }
  
//   async confirmIdentifiantChange(id: string, dto: ConfirmIdentifiantDto) {
//     const user = await this.getProfile(id);
//     const now = new Date();
  
//     if (!user.otp_code || !user.otp_expires_at || user.otp_code !== dto.otp_code) {
//       throw new BadRequestException('Code invalide.');
//     }
  
//     if (user.otp_expires_at.getTime() < now.getTime()) {
//       throw new BadRequestException('Code expiré.');
//     }
  
//     const isEmail = dto.nouvel_identifiant.includes('@') && dto.nouvel_identifiant.includes('.');
  
//     // Vérifie s'il existe déjà
//     const existing = await this.userRepo.findOneBy([
//       { email: dto.nouvel_identifiant },
//       { telephone: dto.nouvel_identifiant },
//     ]);
//     if (existing) {
//       throw new BadRequestException('Cet identifiant est déjà utilisé.');
//     }
  
//     // Met à jour
//     if (isEmail) {
//       user.email = dto.nouvel_identifiant;
//       user.telephone = undefined;
//       user.methode_connexion = 'email';
//     } else {
//       user.telephone = dto.nouvel_identifiant;
//       user.email = undefined;
//       user.methode_connexion = 'telephone';
//     }
  
//     // Reset OTP
//     user.otp_code = undefined;
//     user.otp_expires_at = undefined;
  
//     await this.userRepo.save(user);
//     return { message: 'Identifiant mis à jour avec succès.' };
//   }
  

// }
