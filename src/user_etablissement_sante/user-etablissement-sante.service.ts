import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';
import { CodeVerifOtp } from './entities/code-verif-otp.entity';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';

@Injectable()
export class UserEtablissementSanteService {
  constructor(
    @InjectRepository(UserEtablissementSante)
    private readonly userRepo: Repository<UserEtablissementSante>,
    @InjectRepository(CodeVerifOtp)
    private readonly otpRepo: Repository<CodeVerifOtp>,
  ) {}

  async register(data: CreateUserEtablissementDto) {
    const exist = await this.userRepo.findOne({ where: { email: data.email } });
    if (exist) throw new BadRequestException('Email déjà utilisé');

    const hash = await bcrypt.hash(data.mot_de_passe, 10);

    const newUser = this.userRepo.create({
      ...data,
      mot_de_passe: hash,
    });

    const savedUser = await this.userRepo.save(newUser);

    await this.generateOtp(savedUser);

    return {
      message: 'Inscription réussie. Un code OTP a été envoyé.',
    };
  }

  async generateOtp(user: UserEtablissementSante) {
    const now = new Date();

    // 1. Vérifier dernière demande OTP
    const recent = await this.otpRepo.find({
      where: { userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante } },
      order: { expires_at: 'DESC' },
      take: 5,
    });

    if (recent.length > 0) {
      const last = recent[0];
      const diff = (now.getTime() - last.expires_at.getTime()) / 1000;

      if (diff < 60) throw new BadRequestException("Veuillez attendre 1 minute avant de redemander un code.");

      const within10min = recent.filter((otp) => (now.getTime() - otp.expires_at.getTime()) / 60_000 < 10);
      if (within10min.length >= 5) throw new BadRequestException("Trop de tentatives. Veuillez réessayer dans 10 minutes.");
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const otp = this.otpRepo.create({
      otp_code: otpCode,
      expires_at: new Date(now.getTime() + 5 * 60 * 1000),
      userEtablissementSante: user,
      is_valid: true,
    });

    await this.otpRepo.save(otp);
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    const otp = await this.otpRepo.findOne({
      where: {
        userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante },
        otp_code: code,
        is_valid: true,
      },
    });

    if (!otp) throw new BadRequestException('Code invalide');

    const now = new Date();
    if (otp.expires_at.getTime() < now.getTime()) {
      throw new BadRequestException('Code expiré');
    }

    otp.is_valid = false;
    await this.otpRepo.save(otp);

    return {
      message: 'Code OTP vérifié avec succès',
      user: {
        id: user.id_user_etablissement_sante,
        nom: user.nom,
        email: user.email,
        categorie: user.categorie,
      },
    };
  }
}
 