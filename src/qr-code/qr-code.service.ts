
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCodeDynamique)
    private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
    
    @InjectRepository(QrCodeStatique)
    private readonly qrCodeStatiqueRepository: Repository<QrCodeStatique>,
    
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Génère un token JWT pour un QR code
   * @param id_user ID de l'utilisateur
   * @param isDynamic Si true, le token est pour un QR code dynamique (expirant), sinon statique
   * @param expiresIn Durée d'expiration en secondes (pour les codes dynamiques)
   * @returns Token JWT
   */
  private generateToken(id_user: string, isDynamic: boolean, expiresIn?: number): string {
    const payload = {
      sub: id_user,
      type: isDynamic ? 'dynamic' : 'static',
      user_type: 'utilisateur',
      iat: Math.floor(Date.now() / 1000),
    };

    const options: any = {
      secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
    };
    
    if (isDynamic && expiresIn) {
      options.expiresIn = `${expiresIn}s`;
    }

    return this.jwtService.sign(payload, options);
  }

  /**
   * Crée automatiquement un QR code statique pour un utilisateur lors de son inscription
   * @param id_user ID de l'utilisateur
   * @returns Le QR code statique créé
   */
  async createStaticQrForNewUser(id_user: string): Promise<QrCodeStatique> {
    // Vérifier si un QR code statique existe déjà
    const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
      where: { id_user }
    });
    
    if (existingQrCode) {
      return existingQrCode;
    }
    
    // Générer le token JWT
    const token = this.generateToken(id_user, false);
    
    // Créer l'entrée QR code statique
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user,
      token,
      statut: 'actif',
    });
    
    return this.qrCodeStatiqueRepository.save(qrCode);
  }

  /**
   * Récupère le QR code statique d'un utilisateur
   * @param id_user ID de l'utilisateur
   * @returns Le QR code statique ou null si aucun n'existe
   */
  async getUserStaticQrCode(id_user: string): Promise<QrCodeStatique | null> {
    return this.qrCodeStatiqueRepository.findOne({
      where: { id_user, statut: 'actif' }
    });
  }

  /**
   * Crée un QR code dynamique pour un utilisateur (utilisé à la demande)
   * @param id_user ID de l'utilisateur
   * @param expiresIn Durée de validité en secondes (défaut: 60)
   * @returns Le QR code dynamique créé
   */
  async createDynamicQrForUser(id_user: string, expiresIn: number = 30): Promise<QrCodeDynamique> {
    // Générer le token JWT avec expiration
    const token = this.generateToken(id_user, true, expiresIn);
    
    // Calculer la date d'expiration
    const dateExpiration = new Date();
    dateExpiration.setSeconds(dateExpiration.getSeconds() + expiresIn);
    
    // Créer l'entrée QR code dynamique
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user,
      token,
      date_expiration: dateExpiration,
      statut: 'actif',
    });
    
    return this.qrCodeDynamiqueRepository.save(qrCode);
  }

  /**
   * Met à jour le statut des QR codes dynamiques expirés pour un utilisateur
   * @param id_user ID de l'utilisateur (optionnel)
   * @returns Nombre de QR codes mis à jour
   */
  async updateExpiredQrCodesStatus(id_user?: string): Promise<number> {
    const now = new Date();
    
    const whereCondition: any = { 
      statut: 'actif',
      date_expiration: LessThan(now)
    };
    
    if (id_user) {
      whereCondition.id_user = id_user;
    }
    
    const result = await this.qrCodeDynamiqueRepository.update(
      whereCondition,
      { statut: 'inactif' }
    );
    
    console.log(`${result.affected} QR codes dynamiques marqués comme inactifs`);
    return result.affected || 0;
  }

  /**
   * Supprime les QR codes dynamiques expirés depuis longtemps
   * @param days Nombre de jours à conserver après expiration (défaut: 7)
   * @returns Nombre de QR codes supprimés
   */
  async deleteOldExpiredQrCodes(days: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    console.log(`${result.affected} QR codes dynamiques anciens supprimés`);
    return result.affected || 0;
  }

  /**
   * Vérifie la validité d'un token JWT de QR code
   * @param token Token JWT à vérifier
   * @returns Payload décodé si valide
   */
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
      });
    } catch (error) {
      throw new BadRequestException('Token invalide ou expiré');
    }
  }

  /**
   * Valide un QR code à partir du token JWT
   * @param token Token JWT du QR code
   * @returns Informations sur le propriétaire du QR code
   */
  async validateQrCode(token: string): Promise<any> {
    try {
      // Vérifier le token
      const payload = this.verifyToken(token);
      
      // Déduire le type de QR code à partir du payload
      const isDynamic = payload.type === 'dynamic';
      const id_user = payload.sub;
      
      // Chercher le QR code dans la bonne table
      let qrCode;
      if (isDynamic) {
        qrCode = await this.qrCodeDynamiqueRepository.findOne({
          where: { token }
        });
        
        // Vérifier l'expiration pour les QR codes dynamiques
        if (qrCode) {
          const now = new Date();
          if (now > qrCode.date_expiration) {
            // Marquer comme inactif si expiré
            qrCode.statut = 'inactif';
            await this.qrCodeDynamiqueRepository.save(qrCode);
            throw new BadRequestException('QR code expiré');
          }
        }
      } else {
        qrCode = await this.qrCodeStatiqueRepository.findOne({
          where: { token }
        });
      }
      
      if (!qrCode) {
        throw new NotFoundException('QR code non trouvé');
      }
      
      if (qrCode.statut !== 'actif') {
        throw new BadRequestException('QR code inactif');
      }
      
      // Retourner les informations sur le propriétaire du QR code
      return {
        id_user: qrCode.id_user,
        id_user_etablissement_sante: qrCode.id_user_etablissement_sante,
        type: isDynamic ? 'dynamic' : 'static',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur de validation du QR code: ' + error.message);
    }
  }

  /**
   * Génère une représentation image d'un QR code à partir du token
   * @param token Token JWT à encoder dans le QR
   * @returns URL de l'image en data URL
   */
  async generateQrCodeImage(token: string): Promise<string> {
    try {
      return await QRCode.toDataURL(token);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la génération de l\'image QR code');
    }
  }

  /**
   * Rafraîchit ou crée un QR code dynamique pour un utilisateur
   * @param id_user ID de l'utilisateur
   * @param expiresIn Durée de validité en secondes (défaut: 30 secondes)
   * @returns Le nouveau QR code dynamique
   */
  async refreshUserDynamicQrCode(id_user: string, expiresIn: number = 30): Promise<QrCodeDynamique> {
    console.log(`Rafraîchissement du QR code dynamique pour l'utilisateur ${id_user}`);
    
    try {
      // Désactiver tous les QR codes dynamiques actifs de cet utilisateur
      const updateResult = await this.qrCodeDynamiqueRepository.update(
        { id_user, statut: 'actif' },
        { statut: 'inactif' }
      );
      
      console.log(`${updateResult.affected} QR codes désactivés`);
      
      // Créer un nouveau QR code dynamique
      return this.createDynamicQrForUser(id_user, expiresIn);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du QR code:', error);
      throw new BadRequestException('Impossible de rafraîchir le QR code: ' + error.message);
    }
  }

  /**
   * Récupère les QR codes dynamiques actifs d'un utilisateur spécifique
   * @param id_user ID de l'utilisateur
   * @returns Liste des QR codes dynamiques de l'utilisateur
   */
  async getUserDynamicQrCodes(id_user: string): Promise<QrCodeDynamique[]> {
    // D'abord mettre à jour le statut des QR codes expirés
    await this.updateExpiredQrCodesStatus(id_user);
    
    return this.qrCodeDynamiqueRepository.find({
      where: { 
        id_user,
        statut: 'actif'
      },
      order: {
        date_creation: 'DESC'
      }
    });
  }

  /**
   * Récupère tous les QR codes (statiques et dynamiques) d'un utilisateur spécifique
   * @param id_user ID de l'utilisateur
   * @returns Objet contenant les QR codes statiques et dynamiques
   */
  async getAllUserQrCodes(id_user: string): Promise<{ static: QrCodeStatique[], dynamic: QrCodeDynamique[] }> {
    // D'abord mettre à jour le statut des QR codes expirés
    await this.updateExpiredQrCodesStatus(id_user);
    
    const staticQrCodes = await this.qrCodeStatiqueRepository.find({
      where: { 
        id_user,
        statut: 'actif'
      }
    });
    
    const dynamicQrCodes = await this.qrCodeDynamiqueRepository.find({
      where: { 
        id_user,
        statut: 'actif'
      },
      order: {
        date_creation: 'DESC'
      }
    });
    
    return {
      static: staticQrCodes,
      dynamic: dynamicQrCodes
    };
  }

  /**
   * Récupère un QR code spécifique (statique ou dynamique) par son ID
   * @param id_qrcode ID du QR code
   * @param type Type du QR code ('static' ou 'dynamic')
   * @returns Le QR code demandé
   */
  async getQrCodeById(id_qrcode: number, type: 'static' | 'dynamic'): Promise<QrCodeStatique | QrCodeDynamique | null> {
    if (type === 'static') {
      return this.qrCodeStatiqueRepository.findOne({
        where: { id_qrcode }
      });
    } else {
      // Si c'est un QR code dynamique, vérifier s'il est expiré
      const qrCode = await this.qrCodeDynamiqueRepository.findOne({
        where: { id_qrcode }
      });
      
      if (qrCode && qrCode.statut === 'actif') {
        const now = new Date();
        if (now > qrCode.date_expiration) {
          qrCode.statut = 'inactif';
          await this.qrCodeDynamiqueRepository.save(qrCode);
        }
      }
      
      return qrCode;
    }
  }

  /* 
   * Méthodes pour les établissements de santé (à décommenter plus tard)
   */
  /*
  private generateTokenForEtablissement(id_etablissement: number, isDynamic: boolean, expiresIn?: number): string {
    const payload = {
      sub: id_etablissement.toString(),
      type: isDynamic ? 'dynamic' : 'static',
      user_type: 'etablissement',
      iat: Math.floor(Date.now() / 1000),
    };

    const options: any = {
      secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
    };
    
    if (isDynamic && expiresIn) {
      options.expiresIn = `${expiresIn}s`;
    }

    return this.jwtService.sign(payload, options);
  }

  async createStaticQrForNewEtablissement(id_etablissement: number): Promise<QrCodeStatique> {
    // Vérifier si un QR code statique existe déjà
    const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
      where: { id_user_etablissement_sante: id_etablissement }
    });
    
    if (existingQrCode) {
      return existingQrCode;
    }
    
    // Générer le token JWT
    const token = this.generateTokenForEtablissement(id_etablissement, false);
    
    // Créer l'entrée QR code statique
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user_etablissement_sante: id_etablissement,
      token,
      statut: 'actif',
    });
    
    return this.qrCodeStatiqueRepository.save(qrCode);
  }

  async createDynamicQrForEtablissement(id_etablissement: number, expiresIn: number = 30): Promise<QrCodeDynamique> {
    // Générer le token JWT avec expiration
    const token = this.generateTokenForEtablissement(id_etablissement, true, expiresIn);
    
    // Calculer la date d'expiration
    const dateExpiration = new Date();
    dateExpiration.setSeconds(dateExpiration.getSeconds() + expiresIn);
    
    // Créer l'entrée QR code dynamique
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user_etablissement_sante: id_etablissement,
      token,
      date_expiration: dateExpiration,
      statut: 'actif',
    });
    
    return this.qrCodeDynamiqueRepository.save(qrCode);
  }

  async getEtablissementStaticQrCode(id_etablissement: number): Promise<QrCodeStatique | null> {
    return this.qrCodeStatiqueRepository.findOne({
      where: { id_user_etablissement_sante: id_etablissement, statut: 'actif' }
    });
  }

  async refreshEtablissementDynamicQrCode(id_etablissement: number, expiresIn: number = 30): Promise<QrCodeDynamique> {
    console.log(`Rafraîchissement du QR code dynamique pour l'établissement ${id_etablissement}`);
    
    // Désactiver tous les QR codes dynamiques actifs de cet établissement
    await this.qrCodeDynamiqueRepository.update(
      { id_user_etablissement_sante: id_etablissement, statut: 'actif' },
      { statut: 'inactif' }
    );
    
    // Créer un nouveau QR code dynamique
    return this.createDynamicQrForEtablissement(id_etablissement, expiresIn);
  }

  async getEtablissementDynamicQrCodes(id_etablissement: number): Promise<QrCodeDynamique[]> {
    // D'abord mettre à jour le statut des QR codes expirés
    await this.qrCodeDynamiqueRepository.update(
      { 
        id_user_etablissement_sante: id_etablissement, 
        statut: 'actif',
        date_expiration: LessThan(new Date())
      },
      { statut: 'inactif' }
    );
    
    return this.qrCodeDynamiqueRepository.find({
      where: { 
        id_user_etablissement_sante: id_etablissement,
        statut: 'actif'
      },
      order: {
        date_creation: 'DESC'
      }
    });
  }

  async getAllEtablissementQrCodes(id_etablissement: number): Promise<{ static: QrCodeStatique[], dynamic: QrCodeDynamique[] }> {
    // D'abord mettre à jour le statut des QR codes expirés
    await this.qrCodeDynamiqueRepository.update(
      { 
        id_user_etablissement_sante: id_etablissement, 
        statut: 'actif',
        date_expiration: LessThan(new Date())
      },
      { statut: 'inactif' }
    );
    
    const staticQrCodes = await this.qrCodeStatiqueRepository.find({
      where: { 
        id_user_etablissement_sante: id_etablissement,
        statut: 'actif'
      }
    });
    
    const dynamicQrCodes = await this.qrCodeDynamiqueRepository.find({
      where: { 
        id_user_etablissement_sante: id_etablissement,
        statut: 'actif'
      },
      order: {
        date_creation: 'DESC'
      }
    });
    
    return {
      static: staticQrCodes,
      dynamic: dynamicQrCodes
    };
  }
  */
}