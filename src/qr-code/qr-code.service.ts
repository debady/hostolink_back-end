 import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodePayload, QrCodePayloadUser, QrCodeType, RecipientType } from './interface_qr_code/qr-code-payload.interface';
import { CompteService } from 'src/compte/compte.service';
import { Compte } from 'src/compte/entitie/compte.entity';
import { UserService } from 'src/utilisateur/user.service';
import { User } from 'src/utilisateur/entities/user.entity';



@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCodeDynamique)
    private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
    
    @InjectRepository(QrCodeStatique)
    private readonly qrCodeStatiqueRepository: Repository<QrCodeStatique>,
    
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => CompteService))
    private readonly compteService: CompteService,

    @Inject(forwardRef(() => UserService)) // Ajout du service utilisateur
    private readonly userService: UserService

    // Commenté pour les établissements de santé
    // @Inject(forwardRef(() => EtablissementService))
    // private readonly etablissementService: EtablissementService,
  ) {}

  //  * Génère un token JWT pour un QR code avec un payload complet
  //  * @param payload Informations complètes pour le QR code
  private generateTokenWithPayload(payload: QrCodePayload): string {
    const options: any = {
      secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
    };
    
    // Ajouter l'expiration si applicable
    if (payload.expiresAt) {
      const expiresInSeconds = Math.floor((payload.expiresAt - payload.timestamp) / 1000);
      if (expiresInSeconds > 0) {
        options.expiresIn = `${expiresInSeconds}s`;
      }
    }

    return this.jwtService.sign(payload, options);
  }

  //  * Génère un payload pour un QR code utilisateur
  //  * @param isDynamic Si true, crée un payload pour QR code dynamique
  private createUserPayload(
    id_user: string, 
    isDynamic: boolean, 
    expiresIn?: number,
    additionalInfo?: { 
      accountNumber?: string, 
      currency?: string, 
      // amount?: number, 
      // description?: string 
    }
  ): QrCodePayloadUser {

    const timestamp = Date.now();
    
    const payload: QrCodePayloadUser = {
      recipientType: RecipientType.USER,
      recipientId: id_user,
      qrType: isDynamic ? QrCodeType.DYNAMIC : QrCodeType.STATIC,
      timestamp,
      ...additionalInfo
    };
    
    // Ajouter l'expiration pour les QR codes dynamiques
    if (isDynamic && expiresIn) {
      payload.expiresAt = timestamp + (expiresIn * 1000);
    }
    
    return payload;
  }


  //  * Crée automatiquement un QR code statique pour un utilisateur lors de son inscription
  //  * @returns Le QR code statique créé
  async createStaticQrForNewUser(
    id_user: string, 
    accountNumber?: string
  ): Promise<QrCodeStatique> {
    // Vérifier si un QR code statique existe déjà
    const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
      where: { id_user }
    });
    
    if (existingQrCode) {
      return existingQrCode;
    }
    
    // Créer le payload et générer le token JWT
    const payload = this.createUserPayload(id_user, false, undefined, { accountNumber });
    const token = this.generateTokenWithPayload(payload);
    
    // Créer l'entrée QR code statique
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user,
      token,
      statut: 'actif',
    });
    
    return this.qrCodeStatiqueRepository.save(qrCode);
  }

  //  * Récupère le QR code statique d'un utilisateur
  async getUserStaticQrCode(id_user: string): Promise<QrCodeStatique | null> {
    return this.qrCodeStatiqueRepository.findOne({
      where: { id_user, statut: 'actif' }
    });
  }

  //  * Crée un QR code dynamique pour un utilisateur
  //  * @returns Le QR code dynamique créé
  async createDynamicQrForUser(
    id_user: string, 
    accountNumber?: string,
    expiresIn: number = 60,
    currency?: string,
    // amount?: number,
    // description?: string
  ): Promise<QrCodeDynamique> {
    // Créer le payload avec toutes les informations
    const payload = this.createUserPayload(
      id_user, 
      true, 
      expiresIn, 
      { 
        accountNumber,
        currency, 
        // amount, 
        // description 
      }
    );
    
    // Générer le token JWT
    const token = this.generateTokenWithPayload(payload);
    
    // Calculer la date d'expiration
// Calculer la date d'expiration
const dateExpiration = new Date(payload.expiresAt || Date.now() + (expiresIn * 1000));
    
    // Créer l'entrée QR code dynamique
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user,
      token,
      date_expiration: dateExpiration,
      statut: 'actif',
    });
    
    return this.qrCodeDynamiqueRepository.save(qrCode);
  }

  //  * Met à jour le statut des QR codes dynamiques expirés pour un utilisateur
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

  //  * Supprime les QR codes dynamiques expirés depuis longtemps
  async deleteOldExpiredQrCodes(days: number = 1): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    console.log(`${result.affected} QR codes dynamiques anciens supprimés`);
    return result.affected || 0;
  }

  //  * Vérifie la validité d'un token JWT de QR code
  //  * @returns Payload décodé si valide
  verifyToken(token: string): QrCodePayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_QR_SECRET', 'qr_code_secret_key'),
      });
    } catch (error) {
      throw new BadRequestException('Token invalide ou expiré');
    }
  }

  //  * Valide un QR code à partir du token JWT
  //  * @returns Informations complètes sur le QR code et son propriétaire
  async validateQrCode(token: string): Promise<any> {
    try {
      // Vérifier le token
      const payload = this.verifyToken(token) as QrCodePayload;
      
      // Déduire le type de QR code à partir du payload
      const isDynamic = payload.qrType === QrCodeType.DYNAMIC;
      const id_user = payload.recipientType === RecipientType.USER ? payload.recipientId as string : undefined;
      const id_etablissement = payload.recipientType === RecipientType.ETABLISSEMENT ? payload.recipientId as number : undefined;
      
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

    // ✅ Récupérer uniquement nom, prénom et numéro de compte
    let userInfo: { identifiant: string; nom: string; prenom: string; numero_compte: string } | null = null;

    if (id_user) {
      const user = await this.userService.getUserById(id_user); // Récupérer nom & prénom
      const compte = await this.compteService.getUserCompte(id_user); // Récupérer numéro de compte

      if (user && compte) {
        userInfo = {
          identifiant: user.id_user,
          nom: user.nom,
          prenom: user.prenom,
          numero_compte: compte.numero_compte
        };
      }
    }// /* else if (payload.recipientType === RecipientType.ETABLISSEMENT && id_etablissement) {
    //   // Récupérer les informations du compte de l'établissement
    //   accountInfo = await this.compteService.getEtablissementCompte(id_etablissement);
      
    //   // Récupérer les informations de l'établissement
    //   const etablissement = await this.etablissementService.findOne(id_etablissement);
    //   if (etablissement) {
    //     userInfo = {
    //       nom: etablissement.nom,
    //       adresse: etablissement.adresse,
    //       telephone: etablissement.telephone,
    //       email: etablissement.email
    //     };
    //   }
    // } */
 
      // Retourner les informations complètes
      return {
        ...payload,
        id_qrcode: qrCode.id_qrcode,
        creation_date: qrCode.date_creation,
        utilisateur: userInfo // Ajoute `nom`, `prenom` et `numero_compte` uniquement si trouvé
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur de validation du QR code: ' + error.message);
    }
  }

  //  * Génère une représentation image d'un QR code à partir du token
  async generateQrCodeImage(token: string): Promise<string> {
    try {
      return await QRCode.toDataURL(token);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la génération de l\'image QR code');
    }
  }

  //  * Rafraîchit ou crée un QR code dynamique pour un utilisateur
  async refreshUserDynamicQrCode(
    id_user: string, 
    accountNumber,
    expiresIn: number = 60,
    currency?: string,
    // amount?: number,
    // description?: string
  ): Promise<QrCodeDynamique> {
    console.log(`Rafraîchissement du QR code dynamique pour l'utilisateur ${id_user}`);
    
    try {
      // Désactiver tous les QR codes dynamiques actifs de cet utilisateur
      const updateResult = await this.qrCodeDynamiqueRepository.update(
        { id_user, statut: 'actif' },
        { statut: 'inactif' }
      );
      
      console.log(`${updateResult.affected} QR codes désactivés`);
      
      // Créer un nouveau QR code dynamique
      return this.createDynamicQrForUser(id_user, accountNumber, expiresIn, currency, );
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du QR code:', error);
      throw new BadRequestException('Impossible de rafraîchir le QR code: ' + error.message);
    }
  }

  //  * Récupère les QR codes dynamiques actifs d'un utilisateur spécifique
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

  //  * Récupère tous les QR codes (statiques et dynamiques) d'un utilisateur spécifique
  //  * @returns Objet contenant les QR codes statiques et dynamiques
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

  //  * Récupère un QR code spécifique (statique ou dynamique) par son ID
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
  //  * Méthodes pour les établissements de santé (à décommenter plus tard)
  //  * Génère un payload pour un QR code établissement
  private createEtablissementPayload(
    id_etablissement: number, 
    isDynamic: boolean, 
    expiresIn?: number,
    additionalInfo?: { 
      accountNumber?: string, 
      currency?: string, 
      // amount?: number, 
      // description?: string 
    }
  ): QrCodePayloadEtablissement {
    const timestamp = Date.now();
    
    const payload: QrCodePayloadEtablissement = {
      recipientType: RecipientType.ETABLISSEMENT,
      recipientId: id_etablissement,
      qrType: isDynamic ? QrCodeType.DYNAMIC : QrCodeType.STATIC,
      timestamp,
      ...additionalInfo
    };
    
    // Ajouter l'expiration pour les QR codes dynamiques
    if (isDynamic && expiresIn) {
      payload.expiresAt = timestamp + (expiresIn * 1000);
    }
    
    return payload;
  }

  async createStaticQrForNewEtablissement(
    id_etablissement: number,
    accountNumber?: string
  ): Promise<QrCodeStatique> {
    // Vérifier si un QR code statique existe déjà
    const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
      where: { id_user_etablissement_sante: id_etablissement }
    });
    
    if (existingQrCode) {
      return existingQrCode;
    }
    
    // Créer le payload et générer le token JWT
    const payload = this.createEtablissementPayload(id_etablissement, false, undefined, { accountNumber });
    const token = this.generateTokenWithPayload(payload);
    
    // Créer l'entrée QR code statique
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user_etablissement_sante: id_etablissement,
      token,
      statut: 'actif',
    });
    
    return this.qrCodeStatiqueRepository.save(qrCode);
  }

  async createDynamicQrForEtablissement(
    id_etablissement: number, 
    expiresIn: number = 60,
    accountNumber,
    currency?: string,
    // amount?: number,
    // description?: string
  ): Promise<QrCodeDynamique> {
    // Créer le payload avec toutes les informations
    const payload = this.createEtablissementPayload(
      id_etablissement, 
      true, 
      expiresIn, 
      { 
        accountNumber,
        currency, 
        // amount, 
        // description 
      }
    );
    
    // Générer le token JWT
    const token = this.generateTokenWithPayload(payload);
    
    // Calculer la date d'expiration
    const dateExpiration = new Date(payload.expiresAt);
    
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

  async refreshEtablissementDynamicQrCode(
    id_etablissement: number, 
    expiresIn: number = 60,
    accountNumber,
    currency?: string,
    // amount?: number,
    // description?: string
  ): Promise<QrCodeDynamique> {
    console.log(`Rafraîchissement du QR code dynamique pour l'établissement ${id_etablissement}`);
    
    // Désactiver tous les QR codes dynamiques actifs de cet établissement
    await this.qrCodeDynamiqueRepository.update(
      { id_user_etablissement_sante: id_etablissement, statut: 'actif' },
      { statut: 'inactif' }
    );
    
    // Créer un nouveau QR code dynamique
    return this.createDynamicQrForEtablissement(id_etablissement, expiresIn, accountNumber, currency, );
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