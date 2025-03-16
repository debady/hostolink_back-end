import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Générer un OTP
  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      console.log(`📩 Tentative de génération d'OTP pour : ${identifier} via ${moyen_envoyer}`);
  
      // ✅ Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
  
      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }
  
      // ✅ Générer un OTP (4 à 6 chiffres)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      // ✅ Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);
  
      console.log(`🔄 Suppression des anciens OTPs pour l'utilisateur ${user.id_user}`);
  
      // ✅ Supprimer uniquement les OTPs valides et expirés
      await this.otpRepository.createQueryBuilder()
        .delete()
        .from(Otp)
        .where("id_user = :id_user AND is_valid = true", { id_user: user.id_user })
        .execute();
  
      console.log(`✅ Ancien(s) OTP supprimé(s). Enregistrement du nouvel OTP...`);
  
      // ✅ Enregistrer le nouvel OTP
      const otp = this.otpRepository.create({
        user: user,  // ✅ Assure la bonne relation
        otp_code: otpCode,
        expires_at: expirationDate,
        is_valid: true,
        moyen_envoyer: moyen_envoyer, // ✅ Suppression du `.toLowerCase()`
      });
  
      await this.otpRepository.save(otp);
  
      console.log(`✅ OTP généré avec succès pour ${identifier} : ${otpCode}`);
  
      return { success: true, otp: otpCode };
    } catch (error) {
      console.error("❌ Erreur lors de la génération de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }
  

  // ✅ Vérifier un OTP
  async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
    try {
      identifier = identifier.trim();
      otpCode = otpCode.trim();

      console.log(`📩 Vérification OTP pour ${identifier}, code saisi : ${otpCode}`);

      // Vérifie si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }

      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        
        // Ajoutez un log pour voir la liste des utilisateurs
        const allUsers = await this.userRepository.find();
        console.log("📌 Liste des utilisateurs enregistrés :", allUsers);
      
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // ✅ Récupérer l'OTP valide et non expiré
      const otp = await this.otpRepository.findOne({
        where: { user: user, otp_code: otpCode, is_valid: true }, // ✅ Correction relation
        relations: ['user'], // ✅ Ajout relation
      });

      if (!otp) {
        console.warn(`❌ Code OTP invalide ou expiré pour ${identifier}`);
        return { success: false, message: "Code OTP incorrect ou expiré" };
      }

      // ✅ Vérifier si l'OTP est expiré
      if (new Date() > otp.expires_at) {
        otp.is_valid = false;
        await this.otpRepository.save(otp);
        console.warn(`❌ Code OTP expiré pour ${identifier}`);
        return { success: false, message: "Code OTP expiré" };
      }

      // ✅ Marquer l'OTP comme utilisé (désactivation)
      otp.is_valid = false;
      await this.otpRepository.save(otp);

      console.log(`✅ Code OTP validé avec succès pour ${identifier}`);

      return { success: true, message: "Code OTP valide" };
    } catch (error) {
      console.error("❌ Erreur lors de la vérification de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
    }
  }
}
