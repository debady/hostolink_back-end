// ----------------------
// Service QR Code (JWT)
// ----------------------
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeJwtService } from './qr-code-jwt/qr-code-jwt.service';
import { EtablissementService } from 'src/user_etablissement_sante/user_etablissement_sante.service';
import { QrCodePayload, QrCodeType, RecipientType } from './interface_qr_code/qr-code-payload.interface';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCodeStatique)
    private qrCodeStatiqueRepository: Repository<QrCodeStatique>,
    @InjectRepository(QrCodeDynamique)
    private qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
    private qrCodeJwtService: QrCodeJwtService,
    private etablissementService: EtablissementService,
  ) {}

  async generateStaticQrCodeForEtablissement(etablissementId: number) {
    // Vérifier que l'établissement existe
    const etablissement = await this.etablissementService.findOne(etablissementId);
    
    // Créer le payload
    const payload: QrCodePayload = {
      recipientType: RecipientType.ETABLISSEMENT,
      recipientId: etablissement.id_user_etablissement_sante,
      qrType: QrCodeType.STATIC,
      timestamp: Date.now(),
    };
    
    // Générer le token JWT
    const token = this.qrCodeJwtService.generateToken(payload, true);
    
    // Créer l'enregistrement en base de données
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Expiration dans 1 an
    
    const qrCode = this.qrCodeStatiqueRepository.create({
      id_user_etablissement_sante: etablissementId,
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

  async generateDynamicQrCodeForEtablissement(etablissementId: number) {
    // Vérifier que l'établissement existe
    const etablissement = await this.etablissementService.findOne(etablissementId);
    
    // Créer le payload
    const expirationTime = Date.now() + 60 * 1000; // 60 secondes
    const payload: QrCodePayload = {
      recipientType: RecipientType.ETABLISSEMENT,
      recipientId: etablissement.id_user_etablissement_sante,
      qrType: QrCodeType.DYNAMIC,
      timestamp: Date.now(),
      expiresAt: expirationTime,
    };
    
    // Générer le token JWT
    const token = this.qrCodeJwtService.generateToken(payload, false);
    
    // Créer l'enregistrement en base de données
    const expirationDate = new Date(expirationTime);
    
    const qrCode = this.qrCodeDynamiqueRepository.create({
      id_user_etablissement_sante: etablissementId,
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

  async validateQrCode(token: string) {
    try {
      // Essayer d'abord comme un QR code dynamique
      const payload = this.qrCodeJwtService.verifyToken(token, false);
      return {
        isValid: true,
        payload
      };
    } catch (error) {
      try {
        // Si ça échoue, essayer comme un QR code statique
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