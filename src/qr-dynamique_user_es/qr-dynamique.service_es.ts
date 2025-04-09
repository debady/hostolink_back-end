import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';
import * as crypto from 'crypto';
import { QrCodePaiementDynamique } from './entities/qr_code_paiement_dynamique.entity';

@Injectable()
export class QrDynamiqueService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(QrCodePaiementDynamique)
    private readonly qrRepo: Repository<QrCodePaiementDynamique>,
  ) {}

  onModuleInit() {
    this.startQrGenerationLoop();
  }

  private startQrGenerationLoop() {
    setInterval(async () => {
      try {
        console.log('⏳ Génération automatique des QR dynamiques...');

        const etablissements = await this.dataSource.query(`
          SELECT id_user_etablissement_sante FROM user_etablissement_sante
        `);

        for (const etab of etablissements) {
          const id = etab.id_user_etablissement_sante;

          // Supprimer l’ancien QR dynamique
          await this.qrRepo.delete({ id_user_etablissement_sante: id });

          // Générer un nouveau QR
          const token = this.generateToken();
          const expiration = new Date(Date.now() + 60 * 1000);
          const valeur = `HST_DYNAMIC_${id}_${token}`;

          const qr = this.qrRepo.create({
            qr_code_valeur: valeur,
            date_expiration: expiration,
            date_creation: new Date(),
            statut: 'actif',
            token,
            id_user_etablissement_sante: id,
          });

          await this.qrRepo.save(qr);
          console.log(`✅ QR dynamique généré pour établissement ID ${id} : ${valeur}`);
        }
      } catch (err) {
        console.error('❌ Erreur QR dynamique :', err.message);
      }
    }, 60 * 1000);
  }

  async getQrActifOuNouveau(idEtablissement: number) {
    const now = new Date();

    const actif = await this.qrRepo.findOne({
      where: {
        id_user_etablissement_sante: idEtablissement,
        statut: 'actif',
        date_expiration: MoreThan(now),
      },
    });

    if (actif) {
      console.log('✅ QR dynamique actif trouvé');
      return actif;
    }

    await this.qrRepo.delete({ id_user_etablissement_sante: idEtablissement });

    const token = this.generateToken();
    const expiration = new Date(now.getTime() + 60 * 1000);
    const valeur = `HST_DYNAMIC_${idEtablissement}_${token}`;

    const qr = this.qrRepo.create({
      qr_code_valeur: valeur,
      date_expiration: expiration,
      date_creation: now,
      statut: 'actif',
      token,
      id_user_etablissement_sante: idEtablissement,
    });

    const saved = await this.qrRepo.save(qr);
    console.log('🔄 Nouveau QR dynamique généré pour ID:', idEtablissement);
    return saved;
  }

  async validerQrEtInvalider(token: string) {
    const qr = await this.qrRepo.findOne({
      where: { token, statut: 'actif' },
    });

    if (!qr) throw new NotFoundException('QR code invalide ou expiré');

    if (qr.date_expiration.getTime() < new Date().getTime()) {
      throw new BadRequestException('QR code expiré');
    }

    qr.statut = 'expiré';
    await this.qrRepo.save(qr);

    console.log('✅ QR utilisé et invalidé :', token);
    return {
      message: 'QR Code validé avec succès',
      etablissement_id: qr.id_user_etablissement_sante,
    };
  }

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}


// import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class QrDynamiqueService implements OnModuleInit {
//   constructor(private readonly dataSource: DataSource) {}

//   onModuleInit() {
//     // console.log('📡 QR Dynamique Service initialisé');
//     this.startQrGenerationLoop();
//   }

//   startQrGenerationLoop() {
//     setInterval(async () => {
//       try {
//         console.log('⏳ Génération automatique des QR dynamiques...');

//         // 1. Récupérer tous les établissements
//         const etablissements = await this.dataSource.query(`
//           SELECT id_user_etablissement_sante 
//           FROM user_etablissement_sante
//         `);

//         for (const etab of etablissements) {
//           const id = etab.id_user_etablissement_sante;

//           // 2. Supprimer l’ancien QR dynamique
//           await this.dataSource.query(
//             `DELETE FROM qr_code_paiement_dynamique WHERE id_user_etablissement_sante = $1`,
//             [id],
//           );

//           // 3. Générer un nouveau token
//           const token = this.generateToken();
//           const expiration = new Date(Date.now() + 60 * 1000);
//           const valeur = `HST_DYNAMIC_${id}_${token}`;

//           // 4. Créer le nouveau QR dynamique
//           await this.dataSource.query(
//             `INSERT INTO qr_code_paiement_dynamique 
//               (qr_code_valeur, statut, token, id_user_etablissement_sante, date_expiration)
//              VALUES ($1, 'actif', $2, $3, $4)`,
//             [valeur, token, id, expiration],
//           );

//           console.log(`✅ QR dynamique généré pour établissement ID ${id} : ${valeur}`);
//         }
//       } catch (err) {
//         console.error('❌ Erreur lors de la génération des QR dynamiques :', err);
//       }
//     }, 60 * 1000); // ⏱ toutes les 60 secondes
//   }

//   // private generateToken(): string {
//   //   return Math.random().toString(36).substring(2) + Date.now().toString(36);
//   // }

//   // async getQrActifOuNouveau(idEtab: number) {
//   //   const now = new Date();

//   //   // 1. Cherche QR actif existant
//   //   const existing = await this.dataSource.query(
//   //     `SELECT * FROM qr_code_paiement_dynamique 
//   //      WHERE id_user_etablissement_sante = $1 AND statut = 'actif' 
//   //      AND date_expiration > NOW() LIMIT 1`,
//   //     [idEtab],
//   //   );

//   //   if (existing.length > 0) {
//   //     return {
//   //       qr_code_valeur: existing[0].qr_code_valeur,
//   //       token: existing[0].token,
//   //       expires_at: existing[0].date_expiration,
//   //     };
//   //   }

//   //   // 2. Supprimer tous les anciens QR (sécurité)
//   //   await this.dataSource.query(
//   //     `DELETE FROM qr_code_paiement_dynamique 
//   //      WHERE id_user_etablissement_sante = $1`,
//   //     [idEtab],
//   //   );

//   //   // 3. Génère un nouveau QR
//   //   const token = this.generateToken();
//   //   const expiration = new Date(now.getTime() + 60 * 1000); // 60 sec
//   //   const valeur = `HST_DYNAMIC_${idEtab}_${token}`;

//   //   await this.dataSource.query(
//   //     `INSERT INTO qr_code_paiement_dynamique 
//   //       (qr_code_valeur, statut, token, id_user_etablissement_sante, date_expiration)
//   //      VALUES ($1, 'actif', $2, $3, $4)`,
//   //     [valeur, token, idEtab, expiration],
//   //   );

//   //   return {
//   //     qr_code_valeur: valeur,
//   //     token,
//   //     expires_at: expiration,
//   //   };
//   // }

//   // ✅ Méthode appelée par POST /qr-codes/validate
//   // async validerQrEtInvalider(token: string) {
//   //   const now = new Date();

//   //   const qr = await this.dataSource.query(
//   //     `SELECT * FROM qr_code_paiement_dynamique 
//   //      WHERE token = $1 LIMIT 1`,
//   //     [token],
//   //   );

//   //   if (qr.length === 0) {
//   //     throw new NotFoundException('QR code introuvable ou déjà utilisé');
//   //   }

//   //   const qrCode = qr[0];

//   //   if (qrCode.statut !== 'actif') {
//   //     throw new BadRequestException('Ce QR code est déjà utilisé ou invalide');
//   //   }

//   //   if (new Date(qrCode.date_expiration).getTime() < now.getTime()) {
//   //     throw new BadRequestException('Ce QR code a expiré');
//   //   }

//   //   // 1. Invalider le QR
//   //   await this.dataSource.query(
//   //     `UPDATE qr_code_paiement_dynamique SET statut = 'invalide' 
//   //      WHERE id_qrcode = $1`,
//   //     [qrCode.id_qrcode],
//   //   );

//   //   // 2. Générer un nouveau pour l’établissement
//   //   const newToken = this.generateToken();
//   //   const newExpiration = new Date(now.getTime() + 60 * 1000);
//   //   const newValeur = `HST_DYNAMIC_${qrCode.id_user_etablissement_sante}_${newToken}`;

//   //   await this.dataSource.query(
//   //     `INSERT INTO qr_code_paiement_dynamique 
//   //       (qr_code_valeur, statut, token, id_user_etablissement_sante, date_expiration)
//   //      VALUES ($1, 'actif', $2, $3, $4)`,
//   //     [newValeur, newToken, qrCode.id_user_etablissement_sante, newExpiration],
//   //   );

//   //   return {
//   //     message: 'QR code valide. Paiement autorisé.',
//   //     etablissement_id: qrCode.id_user_etablissement_sante,
//   //   };
//   // }


//   async getQrActifOuNouveau(idEtablissement: number) {
//     const now = new Date();

//     // 1. Vérifie si un QR dynamique actif existe
//     const actif = await this.qrRepo.findOne({
//       where: {
//         id_user_etablissement_sante: idEtablissement,
//         statut: 'actif',
//         date_expiration: () => 'date_expiration > now()',
//       },
//     });

//     if (actif) {
//       console.log('✅ QR dynamique actif déjà existant');
//       return actif;
//     }

//     // 2. Supprime tous les anciens QR (optionnel)
//     await this.qrRepo.delete({
//       id_user_etablissement_sante: idEtablissement,
//     });

//     // 3. Génère un nouveau QR dynamique
//     const token = crypto.randomBytes(16).toString('hex');
//     const nowDate = new Date();
//     const expiration = new Date(nowDate.getTime() + 60 * 1000); // 60 sec

//     const nouveau = this.qrRepo.create({
//       qr_code_valeur: `HST_DYNAMIC_${idEtablissement}_${token}`,
//       date_creation: nowDate,
//       date_expiration: expiration,
//       statut: 'actif',
//       token,
//       id_user_etablissement_sante: idEtablissement,
//     });

//     const qr = await this.qrRepo.save(nouveau);
//     console.log('🔄 Nouveau QR dynamique généré pour établissement ID:', idEtablissement);
//     return qr;
//   }

//   async validerQrEtInvalider(token: string) {
//     const qr = await this.qrRepo.findOne({
//       where: { token, statut: 'actif' },
//     });

//     if (!qr) throw new BadRequestException('QR code invalide ou expiré');

//     // Invalide le QR après utilisation
//     qr.statut = 'expiré';
//     await this.qrRepo.save(qr);

//     console.log('✅ QR dynamique utilisé et invalidé :', token);
//     return {
//       message: 'QR Code validé avec succès',
//       etablissement_id: qr.id_user_etablissement_sante,
//     };
//   }

//   private generateToken(): string {
//     return Math.random().toString(36).substring(2) + Date.now().toString(36);
//   }

// }
