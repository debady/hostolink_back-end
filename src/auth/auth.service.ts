import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // ✅ Ajout de In pour la recherche
import { Utilisateur } from './entities/utilisateur.entity';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto, RegisterUsersDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private jwtService: JwtService,
  ) {}

  // ✅ Vérifier si un utilisateur existe (email ou téléphone)
  async checkUserExists(checkUserDto: CheckUserDto): Promise<boolean> {
    const { identifier } = checkUserDto;
    
    const user = await this.utilisateurRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    return !!user;
  }

  // ✅ Inscription d'un **seul** utilisateur
  async registerUser(registerUserDto: RegisterUserDto, photo?: Express.Multer.File) {
    const { email, telephone, mdp } = registerUserDto;

    console.log("📝 Tentative d'inscription avec :", { email, telephone });

    const existingUser = await this.utilisateurRepository.findOne({
      where: [{ email }, { telephone }],
    });

    if (existingUser) {
      console.log("❌ Utilisateur déjà existant !");
      throw new BadRequestException('Un utilisateur avec cet email ou téléphone existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(mdp, 10);

    const newUser = this.utilisateurRepository.create({
      ...registerUserDto,
      mdp: hashedPassword,
      photo_profile: photo ? photo.filename : 'image_default.png',
    });

    await this.utilisateurRepository.save(newUser);

    console.log("✅ Utilisateur créé avec succès !");
    return { message: 'Utilisateur créé avec succès !' };
  }

  // ✅ Récupérer tous les utilisateurs
  async getAllUsers(): Promise<Omit<Utilisateur, 'mdp'>[]> {
    return await this.utilisateurRepository.find({
      select: ['id_user', 'nom', 'prenom', 'email', 'telephone', 'pays'],
    });
  }
  
  // ✅ Inscription **de plusieurs utilisateurs en une seule requête**
  async registerMultiple(users: RegisterUserDto[]) {
    console.log(`📥 Tentative d'inscription multiple (${users.length} utilisateurs)`);

    const emails = users.map(user => user.email);
    const telephones = users.map(user => user.telephone);

    // 🔍 Vérifier si certains emails/téléphones existent déjà
    const existingUsers = await this.utilisateurRepository.find({
      where: [
        { email: In(emails) }, 
        { telephone: In(telephones) }
      ]
    });

    if (existingUsers.length > 0) {
      console.log("❌ Certains utilisateurs existent déjà !");
      throw new BadRequestException("Un ou plusieurs utilisateurs existent déjà.");
    }

    const hashedUsers = users.map(user => ({
      ...user,
      mdp: bcrypt.hashSync(user.mdp, 10), 
      photo_profile: 'image_default.png',
    }));

    await this.utilisateurRepository.save(hashedUsers);

    console.log(`✅ ${users.length} utilisateurs créés avec succès !`);
    return { message: `${users.length} utilisateurs créés avec succès !` };
  }

  // ✅ Connexion d'un utilisateur et génération du token JWT
  async loginUser(loginUserDto: LoginUserDto) {
    let { identifier, mdp } = loginUserDto;
    
    identifier = identifier.trim();
    mdp = mdp.trim();

    console.log("📤 Tentative de connexion avec :", identifier);

    const user = await this.utilisateurRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé :", identifier);
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    console.log("✅ Utilisateur trouvé :", user.email);

    const isPasswordValid = await bcrypt.compare(mdp, user.mdp);
    console.log("🔍 Vérification du mot de passe :", isPasswordValid ? "✅ Valide" : "❌ Invalide");

    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour :", identifier);
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const payload = { id: user.id_user, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    console.log("✅ Connexion réussie ! Token généré :", accessToken);

    return { accessToken };
  }

  // ✅ Récupérer les informations du profil de l'utilisateur
  async getUserProfile(userId: number) {
    console.log("📥 Récupération du profil de l'utilisateur avec ID :", userId);

    const user = await this.utilisateurRepository.findOne({
      where: { id_user: userId },
      select: ['id_user', 'nom', 'prenom', 'email', 'telephone', 'pays'],
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé !");
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    console.log("✅ Profil utilisateur récupéré :", user);
    return user;
  }
}
