import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Utilisateur } from './entities/utilisateur.entity';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private jwtService: JwtService, 
  ) {}

  // ✅ Vérifier si un utilisateur existe
  async checkUserExists(checkUserDto: CheckUserDto): Promise<boolean> {
    const { identifier } = checkUserDto;

    console.log("🔍 Vérification de l'existence de l'utilisateur :", identifier);

    const user = await this.utilisateurRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    console.log("✅ Utilisateur trouvé :", user ? user.email : "Aucun utilisateur trouvé");

    return !!user;
  }

  // ✅ Récupérer tous les utilisateurs sans afficher le mot de passe
  async getAllUsers(): Promise<Omit<Utilisateur, 'mdp'>[]> {
    console.log("📥 Récupération de tous les utilisateurs");
    const users = await this.utilisateurRepository.find();
    console.log("✅ Nombre d'utilisateurs trouvés :", users.length);
    return users.map(({ mdp, ...user }) => user as Omit<Utilisateur, 'mdp'>);
  }

  // ✅ Inscription d'un nouvel utilisateur
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, telephone, mdp } = registerUserDto;

    console.log("📝 Tentative d'inscription avec :", { email, telephone });

    // 🔍 Vérifier si l'utilisateur existe déjà
    const existingUser = await this.utilisateurRepository.findOne({
      where: [{ email }, { telephone }],
    });

    if (existingUser) {
      console.log("❌ Utilisateur déjà existant !");
      throw new BadRequestException('Un utilisateur avec cet email ou téléphone existe déjà.');
    }

    // 🔐 Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mdp.trim(), 10);

    // 📝 Créer un nouvel utilisateur
    const newUser = this.utilisateurRepository.create({
      ...registerUserDto,
      mdp: hashedPassword, // ✅ Sauvegarde du mot de passe hashé
    });

    // 📥 Sauvegarder l'utilisateur dans la base de données
    await this.utilisateurRepository.save(newUser);

    console.log("✅ Utilisateur créé avec succès !");
    return { message: 'Utilisateur créé avec succès !' };
  }

  // ✅ Connexion d'un utilisateur
  async loginUser(loginUserDto: LoginUserDto) {
    let { identifier, mdp } = loginUserDto;
    
    // ✅ Supprimer les espaces invisibles
    identifier = identifier.trim();
    mdp = mdp.trim();

    console.log("📤 Tentative de connexion avec :", identifier);

    // 🔍 Vérifier si l'utilisateur existe (email ou téléphone)
    const user = await this.utilisateurRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé :", identifier);
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    console.log("✅ Utilisateur trouvé :", user.email);
    console.log("🔐 Mot de passe stocké :", user.mdp);
    console.log("🔑 Mot de passe reçu :", mdp);

    // 🔐 Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(mdp, user.mdp);
    console.log("🔍 Vérification du mot de passe :", isPasswordValid ? "✅ Valide" : "❌ Invalide");

    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour :", identifier);
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    // ✅ Générer le token JWT
    const payload = { id: user.id_user, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    console.log("✅ Connexion réussie ! Token généré :", accessToken);

    return { accessToken };
  }
}
