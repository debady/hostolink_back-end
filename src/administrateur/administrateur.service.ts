import { Injectable, ConflictException, BadRequestException, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrateur } from './entities/administrateur.entity';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtService } from '@nestjs/jwt';
import { Image, ImageMotifEnum } from '../image/entities/image.entity';
import { v2 as cloudinary } from 'cloudinary';
import { DataSource } from 'typeorm';


@Injectable()
export class AdministrateurService {
  constructor(

    @InjectRepository(Administrateur)
    private readonly adminRepository: Repository<Administrateur>,

    private readonly jwtService: JwtService,
    @Inject('CLOUDINARY') private cloudinaryProvider: typeof cloudinary,

    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    private readonly dataSource: DataSource

    
  ) {}

  async inscrireAdministrateur(dto: CreateAdministrateurDto) {
    const existant = await this.adminRepository.findOne({
      where: [{ email: dto.email }, { telephone: dto.telephone }],
    });
    if (existant) throw new ConflictException('Email ou téléphone déjà utilisé.');

    if (!dto.mot_de_passe || dto.mot_de_passe.length < 4) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 4caractères.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.mot_de_passe, salt);

    const role = dto.role || 'admin';

    const administrateur = this.adminRepository.create({
      ...dto,
      mot_de_passe: hash,
      role,
    });

    try {
      const nouvelAdmin = await this.adminRepository.save(administrateur);
      return {
        message: 'Administrateur inscrit avec succès',
        administrateur: {
          id: nouvelAdmin.id_admin_gestionnaire,
          email: nouvelAdmin.email,
          telephone: nouvelAdmin.telephone,
          role: nouvelAdmin.role,
        },
      };
    } catch (error) {
      throw new Error('Une erreur est survenue lors de l’inscription.');
    }
  }

  async connexionAdministrateur(dto: LoginAdministrateurDto) {
    if (!dto.email && !dto.telephone) {
      throw new BadRequestException('Vous devez fournir soit un email, soit un numéro de téléphone.');
    }

    let admin;
    if (dto.email) {
      admin = await this.adminRepository.findOneBy({ email: dto.email });
    } else if (dto.telephone) {
      admin = await this.adminRepository.findOneBy({ telephone: dto.telephone });
    }

    if (!admin) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await bcrypt.compare(dto.mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { id: admin.id_admin_gestionnaire, role: admin.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie',
      administrateur: {
        id: admin.id_admin_gestionnaire,
        email: admin.email,
        telephone: admin.telephone,
        role: admin.role,
      },
      access_token: token,
    };
  }

  async getAdminById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id_admin_gestionnaire: id },
      select: [
        'id_admin_gestionnaire',
        'email',
        'telephone',
        'role',
        'permissions',
        'statut',
        'dernier_connexion',
        'date_creation',
        'date_modification',
      ],
    });

    if (!admin) {
      throw new NotFoundException('Administrateur non trouvé.');
    }

    const avatar = await this.imageRepository.findOne({
      where: { id_admin_gestionnaire: id, motif: ImageMotifEnum.AVATAR_ADMIN },
    });

    return {
      ...admin,
      avatar_url: avatar ? avatar.url_image : null,
    };

  }

  // ✅ Ajout méthode uploadAvatarAdmin
  async uploadAvatarAdmin(id: number, avatar: Express.Multer.File) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
    if (!admin) throw new NotFoundException('Administrateur non trouvé.');
  
    const uploadResult = await this.cloudinaryProvider.uploader.upload(avatar.path, {
      folder: 'dossier_hostolink_preset/avatars_admin',
      public_id: `admin_${id}_${Date.now()}`,
      overwrite: true,
    });
  
    const ancienneImage = await this.imageRepository.findOne({
      where: { id_admin_gestionnaire: id, motif: ImageMotifEnum.AVATAR_ADMIN },
    });
  
    if (ancienneImage) {
      const ancienneUrl = ancienneImage.url_image;
      const publicId = ancienneUrl?.split('/').pop()?.split('.')[0];
      if (publicId) {
        await this.cloudinaryProvider.uploader.destroy(`avatars_admin/${publicId}`);
      }
      ancienneImage.url_image = uploadResult.secure_url;
      await this.imageRepository.save(ancienneImage);
    } else {
      const nouvelleImage = this.imageRepository.create({
        url_image: uploadResult.secure_url,
        motif: ImageMotifEnum.AVATAR_ADMIN,
        id_admin_gestionnaire: id,
      });
  
      await this.imageRepository.save(nouvelleImage);
    }
  
    return {
      message: 'Avatar administrateur uploadé avec succès',
      url_image: uploadResult.secure_url,
    };
  }

  async supprimerAdministrateur(id: number) {
    const resultat = await this.adminRepository.delete(id);
  
    if (resultat.affected === 0) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    return { message: 'Administrateur supprimé avec succès.' };
  }

  async modifierStatutAdministrateur(id: number, statut: string) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    admin.statut = statut;
    await this.adminRepository.save(admin);
  
    return { message: `Statut modifié avec succès en "${statut}".` };
  }
  

  async modifierAdministrateur(id: number, dto: Partial<CreateAdministrateurDto>) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    Object.assign(admin, dto, { date_modification: new Date() });
  
    await this.adminRepository.save(admin);
  
    return { message: 'Informations administrateur modifiées avec succès.', admin };
  }
  
  async recupererTousLesAdmins() {
    const [admins, nombre] = await this.adminRepository.findAndCount();
  
    const adminsAvecAvatar = await Promise.all(admins.map(async admin => {
      const avatar = await this.imageRepository.findOne({
        where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: ImageMotifEnum.AVATAR_ADMIN },
      });
  
      return {
        ...admin,
        avatar_url: avatar ? avatar.url_image : null,
      };
    }));
  
    return {
      nombre_admins: nombre,
      administrateurs: adminsAvecAvatar,
    };
  }

  async modifierMotDePasseAdmin(id: number, nouveauMotDePasse: string) {
    if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères.');
    }
  
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    const hash = await bcrypt.hash(nouveauMotDePasse, await bcrypt.genSalt());
  
    admin.mot_de_passe = hash;
    admin.date_modification = new Date();
  
    await this.adminRepository.save(admin);
  
    return { message: 'Mot de passe modifié avec succès.' };
  }


  async modifierPermissionsAdmin(id: number, permissions: Record<string, any>) {
    const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
  
    if (!admin) {
      throw new NotFoundException("Administrateur non trouvé.");
    }
  
    admin.permissions = permissions;
    admin.date_modification = new Date();
  
    await this.adminRepository.save(admin);
  
    return { message: 'Permissions mises à jour avec succès.', permissions };
  }


  async rechercherParRole(role: string) {
    const admins = await this.adminRepository.find({ where: { role } });
  
    const adminsAvecAvatar = await Promise.all(admins.map(async admin => {
      const avatar = await this.imageRepository.findOne({
        where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: ImageMotifEnum.AVATAR_ADMIN },
      });
  
      return {
        ...admin,
        avatar_url: avatar ? avatar.url_image : null,
      };
    }));
  
    return {
      nombre_resultats: admins.length,
      administrateurs: adminsAvecAvatar,
    };
  }
  
   
  async crediterUtilisateur(id_user: string, montant: number) {
    if (!id_user || !montant || montant <= 0) {
      throw new BadRequestException('ID utilisateur et montant requis');
    }
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
      [id_user],
    );
  
    if (!compte) {
      throw new NotFoundException('Compte utilisateur introuvable');
    }
  
    await this.dataSource.query(
      `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
      [montant, compte.id_compte],
    );
  
    return {
      message: '✅ Solde crédité avec succès',
      utilisateur: id_user,
      montant_crédité: montant,
    };
  }

  async crediterEtablissement(idEtab: number, montant: number) {
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte 
       WHERE id_user_etablissement_sante = $1 
       AND statut = 'actif' LIMIT 1`,
      [idEtab],
    );
  
    if (!compte) {
      throw new NotFoundException("Compte établissement introuvable");
    }
  
    await this.dataSource.query(
      `UPDATE compte SET solde_compte = solde_compte + $1 
       WHERE id_compte = $2`,
      [montant, compte.id_compte],
    );
  
    return { message: `✅ Crédit de ${montant} XOF effectué avec succès.` };
  }

  async findAllEtablissements(): Promise<{ total: number; etablissements: any[] }> {
    const etabs = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante ORDER BY id_user_etablissement_sante DESC`,
    );
  
    const etablissements = await Promise.all(
      etabs.map(async (etab) => {
        const [compte] = await this.dataSource.query(
          `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [qrStatique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_statique WHERE id_user_etablissement_sante = $1 LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [qrDynamique] = await this.dataSource.query(
          `SELECT * FROM qr_code_paiement_dynamique 
           WHERE id_user_etablissement_sante = $1 AND statut = 'actif' 
           AND date_expiration > NOW() 
           ORDER BY date_creation DESC LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        const [image] = await this.dataSource.query(
          `SELECT url_image FROM images 
           WHERE id_user_etablissement_sante = $1 
           AND motif = 'photo_profile' LIMIT 1`,
          [etab.id_user_etablissement_sante],
        );
  
        return {
          ...etab,
          image_profil: image?.url_image || null,
          compte: compte || null,
          qr_code_statique: qrStatique || null,
          qr_code_dynamique: qrDynamique || null,
        };
      }),
    );
  
    return {
      total: etablissements.length,
      etablissements,
    };
  }


  async rechargerUser(identifiant: string, montant: number, idAdmin: number) {
    const [user] = await this.dataSource.query(
      `SELECT * FROM utilisateur WHERE email = $1 OR telephone = $1 LIMIT 1`,
      [identifiant],
    );
    if (!user) throw new NotFoundException("Utilisateur introuvable");
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 LIMIT 1`,
      [user.id_user],
    );
    if (!compte) throw new NotFoundException("Compte utilisateur introuvable");
  
    const nouveauSolde = compte.solde_compte + montant;
  
    await this.dataSource.transaction(async manager => {
      await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_user = $2`, [nouveauSolde, user.id_user]);
  
      await manager.query(
        `INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
         VALUES ($1, 'user', $2, $3, $4, $5, $6)`,
        [idAdmin, user.id_user, identifiant, montant, compte.solde_compte, nouveauSolde],
      );
    });
  
    return { message: '✅ Rechargement utilisateur effectué avec succès', nouveauSolde };
  }
  
  async rechargerEtablissement(identifiant: string, montant: number, idAdmin: number) {
    const [etab] = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante WHERE email = $1 OR telephone = $1 LIMIT 1`,
      [identifiant],
    );
    if (!etab) throw new NotFoundException("Établissement introuvable");
  
    const [compte] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
      [etab.id_user_etablissement_sante],
    );
    if (!compte) throw new NotFoundException("Compte établissement introuvable");
  
    const nouveauSolde = compte.solde_compte + montant;
  
    await this.dataSource.transaction(async manager => {
      await manager.query(
        `UPDATE compte SET solde_compte = $1 WHERE id_user_etablissement_sante = $2`,
        [nouveauSolde, etab.id_user_etablissement_sante],
      );
  
      await manager.query(
        `INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6)`,
        [idAdmin, etab.id_user_etablissement_sante, identifiant, montant, compte.solde_compte, nouveauSolde],
      );
    });
  
    return { message: '✅ Rechargement établissement effectué avec succès', nouveauSolde,  montant_crédité: montant };
  }
  
  
  
  
}
