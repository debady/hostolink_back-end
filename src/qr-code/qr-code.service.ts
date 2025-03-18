// src/qr-code/qr-code.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeJwtService } from './qr-code-jwt/qr-code-jwt.service';
import { UserService } from 'src/utilisateur/user.service';
import { CompteService } from 'src/compte/compte.service';
import { User } from 'src/utilisateur/entities/user.entity';
import { QrCodePayload, QrCodeType, RecipientType } from './interface_qr_code/qr-code-payload.interface';
// import { EtablissementService } from '../etablissement/etablissement.service';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCodeStatique)
    private qrCodeStatiqueRepository: Repository<QrCodeStatique>,
    @InjectRepository(QrCodeDynamique)
    private qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
    private qrCodeJwtService: QrCodeJwtService,
    private userService: UserService,
    // private etablissementService: EtablissementService,
    private compteService: CompteService,
  ) {}

  // Génération QR Code Statique - UTILISATEUR
  async generateStaticQrCodeForUser(userId: string) {
    // Vérifier que l'utilisateur existe
    const user = await this.userService.findOne(userId);
    if (!User) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    // Récupérer le compte de l'utilisateur
    const compte = await this.compteService.findCompteByUser(userId);
    
    // Créer le payload
    const payload: QrCodePayload = {
      recipientType: RecipientType.USER,
      recipientId: userId, // UUID pour l'utilisateur
      accountNumber: compte.numero_compte,
      currency: compte.devise,
      qrType: QrCodeType.STATIC,
      timestamp: Date.now(),
    };
    
    // Générer le token JWT
    const token = this.qrCodeJwtService.generateToken(payload, true);
    
    // Créer l'enregistrement en base de données
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Expire dans 1 an
    
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user: userId,
      token,
      date_expiration: expirationDate,
      statut: 'actif'
    });
    
    await this.qrCodeStatiqueRepository.save(qrCode);
    
    return {
      qrCode: token,
      expiresAt: expirationDate
    };
  }

  // Génération QR Code Dynamique - UTILISATEUR
  async generateDynamicQrCodeForUser(userId: string) {
    // Vérifier que l'utilisateur existe
    const user = await this.userService.findOne(userId);
    if (!User) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    // Récupérer le compte de l'utilisateur
    const compte = await this.compteService.findCompteByUser(userId);
    
    // Créer le payload
    const expirationTime = Date.now() + 60 * 1000; // 60 secondes
    const payload: QrCodePayload = {
      recipientType: RecipientType.USER,
      recipientId: userId, // UUID pour l'utilisateur
      accountNumber: compte.numero_compte,
      currency: compte.devise,
      qrType: QrCodeType.DYNAMIC,
      timestamp: Date.now(),
      expiresAt: expirationTime,
    };
    
    // Générer le token JWT
    const token = this.qrCodeJwtService.generateToken(payload, false);
    
    // Créer l'enregistrement en base de données
    const expirationDate = new Date(expirationTime);
    
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user: userId,
      token,
      date_expiration: expirationDate,
      statut: 'actif'
    });
    
    await this.qrCodeDynamiqueRepository.save(qrCode);
    
    return {
      qrCode: token,
      expiresAt: expirationDate
    };
  }

  // // Génération QR Code Statique - ÉTABLISSEMENT
  // async generateStaticQrCodeForEtablissement(etablissementId: number) {
  //   // Vérifier que l'établissement existe
  //   const etablissement = await this.etablissementService.findOne(etablissementId);
  //   if (!etablissement) {
  //     throw new NotFoundException(`Établissement avec ID ${etablissementId} non trouvé`);
  //   }
    
  //   // Récupérer le compte de l'établissement
  //   const compte = await this.compteService.findCompteByEtablissement(etablissementId);
    
  //   // Créer le payload
  //   const payload: QrCodePayload = {
  //     recipientType: RecipientType.ETABLISSEMENT,
  //     recipientId: etablissementId, // integer pour l'établissement
  //     accountNumber: compte.numero_compte,
  //     currency: compte.devise,
  //     qrType: QrCodeType.STATIC,
  //     timestamp: Date.now(),
  //   };
    
  //   // Générer le token JWT
  //   const token = this.qrCodeJwtService.generateToken(payload, true);
    
  //   // Créer l'enregistrement en base de données
  //   const expirationDate = new Date();
  //   expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Expire dans 1 an
    
  //   const qrCode = this.qrCodeStatiqueRepository.create({
  //     id_user_etablissement_sante: etablissementId,
  //     token,
  //     date_expiration: expirationDate,
  //     statut: 'actif'
  //   });
    
  //   await this.qrCodeStatiqueRepository.save(qrCode);
    
  //   return {
  //     qrCode: token,
  //     expiresAt: expirationDate
  //   };
  // }

  // // Génération QR Code Dynamique - ÉTABLISSEMENT
  // async generateDynamicQrCodeForEtablissement(etablissementId: number) {
  //   // Vérifier que l'établissement existe
  //   const etablissement = await this.etablissementService.findOne(etablissementId);
  //   if (!etablissement) {
  //     throw new NotFoundException(`Établissement avec ID ${etablissementId} non trouvé`);
  //   }
    
  //   // Récupérer le compte de l'établissement
  //   const compte = await this.compteService.findCompteByEtablissement(etablissementId);
    
  //   // Créer le payload
  //   const expirationTime = Date.now() + 60 * 1000; // 60 secondes
  //   const payload: QrCodePayload = {
  //     recipientType: RecipientType.ETABLISSEMENT,
  //     recipientId: etablissementId, // integer pour l'établissement
  //     accountNumber: compte.numero_compte,
  //     currency: compte.devise,
  //     qrType: QrCodeType.DYNAMIC,
  //     timestamp: Date.now(),
  //     expiresAt: expirationTime,
  //   };
    
  //   // Générer le token JWT
  //   const token = this.qrCodeJwtService.generateToken(payload, false);
    
  //   // Créer l'enregistrement en base de données
  //   const expirationDate = new Date(expirationTime);
    
  //   const qrCode = this.qrCodeDynamiqueRepository.create({
  //     id_user_etablissement_sante: etablissementId,
  //     token,
  //     date_expiration: expirationDate,
  //     statut: 'actif'
  //   });
    
  //   await this.qrCodeDynamiqueRepository.save(qrCode);
    
  //   return {
  //     qrCode: token,
  //     expiresAt: expirationDate
  //   };
  // }

  // Validation d'un QR Code (peut être utilisé pour les deux types)
  async validateQrCode(token: string) {
    try {
      // Essayer d'abord comme un QR code dynamique
      const payload = this.qrCodeJwtService.verifyToken(token, false);
      
      // Vérifier si le QR dynamique est expiré
      if (payload.expiresAt && payload.expiresAt < Date.now()) {
        return {
          isValid: false,
          message: 'QR code expiré'
        };
      }
      
      return {
        isValid: true,
        payload
      };
    } catch (error) {
      try {
        // Si ça échoue comme dynamique, essayer comme statique
        const payload = this.qrCodeJwtService.verifyToken(token, true);
        return {
          isValid: true,
          payload
        };
      } catch (error) {
        return {
          isValid: false,
          message: 'QR code invalide ou expiré'
        };
      }
    }
  }
}



