// import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../user/entities/user.entity';
// import { Otp } from '../otp/entities/otp.entity'; 


// @Injectable()
// export class OtpService {
//   constructor(
//     @InjectRepository(Otp)
//     private readonly otpRepository: Repository<Otp>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // ✅ Générer un OTP
//   async generateOtp(identifier: string): Promise<{ success: boolean; otp: string }> {
//     try {
//       identifier = identifier.trim();

//       // Vérifie si l'utilisateur existe
//       const user = await this.userRepository.findOne({
//         where: [{ email: identifier }, { telephone: identifier }],
//       });

//       if (!user) {
//         throw new BadRequestException("Utilisateur non trouvé");
//       }

//       // Générer un OTP (4 à 6 chiffres)
//       const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//       // Définir l'expiration à 5 minutes
//       const expirationDate = new Date();
//       expirationDate.setMinutes(expirationDate.getMinutes() + 5);

//       // Supprimer les anciens OTPs pour cet utilisateur
//       await this.otpRepository.delete({ userId: user.id_user });

//       // Enregistrer le nouvel OTP
//       const otp = this.otpRepository.create({
//         userId: user.id_user, // ✅ Clé étrangère correcte
//         otp_code: otpCode,
//         expires_at: expirationDate,
//         is_valid: true,
//       });

//       await this.otpRepository.save(otp);

//       console.log(`📩 OTP généré pour ${identifier} : ${otpCode}`);

//       return { success: true, otp: otpCode };
//     } catch (error) {
//       console.error("❌ Erreur lors de la génération de l'OTP :", error);
//       throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
//     }
//   }

//   // ✅ Vérifier un OTP
//   async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
//     try {
//       identifier = identifier.trim();
//       otpCode = otpCode.trim();

//       // Vérifie si l'utilisateur existe
//       const user = await this.userRepository.findOne({
//         where: [{ email: identifier }, { telephone: identifier }],
//       });

//       if (!user) {
//         throw new BadRequestException("Utilisateur non trouvé");
//       }

//       // Récupérer l'OTP valide et non expiré
//       const otp = await this.otpRepository.findOne({
//         where: { userId: user.id_user, otp_code: otpCode, is_valid: true },
//       });

//       if (!otp) {
//         return { success: false, message: "Code OTP incorrect ou expiré" };
//       }

//       // Vérifier si l'OTP est expiré
//       if (new Date() > otp.expires_at) {
//         await this.otpRepository.delete(otp.id);
//         return { success: false, message: "Code OTP expiré" };
//       }

//       // Marquer l'OTP comme utilisé (désactivation)
//       otp.is_valid = false;
//       await this.otpRepository.save(otp);

//       return { success: true, message: "Code OTP valide" };
//     } catch (error) {
//       console.error("❌ Erreur lors de la vérification de l'OTP :", error);
//       throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
//     }
//   }
// }
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Otp } from '../otp/entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Générer un OTP
  async generateOtp(identifier: string): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();

      // Vérifie si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      if (!user) {
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // Générer un OTP (4 à 6 chiffres)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);

      // Supprimer les anciens OTPs de cet utilisateur
      await this.otpRepository.delete({ userId: user.id_user  });

      // Enregistrer le nouvel OTP
      const otp = this.otpRepository.create({
        userId: user.id_user,  // ✅ Utilisation correcte de la clé étrangère
        otp_code: otpCode,
        expires_at: expirationDate,
        is_valid: true,
      });

      await this.otpRepository.save(otp);

      console.log(`📩 OTP généré pour ${identifier} : ${otpCode}`);

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

      // Vérifie si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      if (!user) {
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // Récupérer l'OTP valide et non expiré
      const otp = await this.otpRepository.findOne({
        where: { userId: user.id_user, otp_code: otpCode, is_valid: true },
      });

      if (!otp) {
        return { success: false, message: "Code OTP incorrect ou expiré" };
      }

      // Vérifier si l'OTP est expiré
      if (new Date() > otp.expires_at) {
        otp.is_valid = false;
        await this.otpRepository.save(otp);
        return { success: false, message: "Code OTP expiré" };
      }

      // Marquer l'OTP comme utilisé (désactivation)
      otp.is_valid = false;
      await this.otpRepository.save(otp);

      return { success: true, message: "Code OTP valide" };
    } catch (error) {
      console.error("❌ Erreur lors de la vérification de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
    }
  }
}
