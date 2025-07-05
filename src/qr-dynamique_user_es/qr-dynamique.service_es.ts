import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';
import * as crypto from 'crypto';
import { QrCodePaiementDynamique } from './entities/qr_code_paiement_dynamique.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class QrDynamiqueService implements OnModuleInit {
 
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(QrCodePaiementDynamique)
    private readonly qrRepo: Repository<QrCodePaiementDynamique>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  onModuleInit() {
    this.startQrGenerationLoop();
  }
  /**
     * Génère un identifiant court unique
     * @returns Identifiant court de 16 caractères
     */
    public generateShortId(): string {
      // Générer un ID court de 16 caractères hexadécimaux
      return crypto.randomBytes(8).toString('hex');
    }
    
  // private startQrGenerationLoop() {
    
  //   setInterval(async () => {
  //     try {

        
  //       // ////console.log('⏳ Génération automatique des QR dynamiques...');

  //       const etablissements = await this.dataSource.query(`
  //         SELECT id_user_etablissement_sante FROM user_etablissement_sante
  //       `);

  //       for (const etab of etablissements) {
  //         const id = etab.id_user_etablissement_sante;

  //         // // Générer un identifiant court
  //         // const shortId = this.generateShortId();

  //         // Supprimer l’ancien QR dynamique
  //         await this.qrRepo.delete({ id_user_etablissement_sante: id });

  //         // Générer un nouveau QR
  //         const token = this.generateToken();
  //         const expiration = new Date(Date.now() + 60 * 1000);
  //         const valeur = `HST_DYNAMIC_${id}_${token}`;
  //         // Générer un identifiant court
  //         const short_id = this.generateShortId();

  //         const qr = this.qrRepo.create({
  //           qr_code_valeur: valeur,
  //           date_expiration: expiration,
  //           date_creation: new Date(),
  //           statut: 'actif',
  //           token,
  //           short_id,
  //           id_user_etablissement_sante: id,
  //         });

  //         await this.qrRepo.save(qr);
  //         // ////console.log(`✅ QR dynamique généré pour établissement ID ${id} : ${valeur}`);
  //       }
  //     } catch (err) {
  //       console.error('❌ Erreur QR dynamique :', err.message);
  //     }
  //   }, 60 * 1000);
  // }

  // ...existing code...
private startQrGenerationLoop() {
  setInterval(async () => {
    try {
      const etablissements = await this.dataSource.query(`
        SELECT id_user_etablissement_sante FROM user_etablissement_sante
      `);

      for (const etab of etablissements) {
        const id = etab.id_user_etablissement_sante;

        // Chercher le QR actif
        let qr = await this.qrRepo.findOne({
          where: {
            id_user_etablissement_sante: id,
            statut: 'actif',
          },
        });

        const token = this.generateToken();
        const expiration = new Date(Date.now() + 60 * 1000);
        const valeur = `HST_DYNAMIC_${id}_${token}`;
        const short_id = this.generateShortId();

        if (qr) {
          // Mettre à jour le QR existant
          qr.qr_code_valeur = valeur;
          qr.date_expiration = expiration;
          qr.date_creation = new Date();
          qr.token = token;
          qr.short_id = short_id;
          await this.qrRepo.save(qr);
        } else {
          // Créer un nouveau QR
          qr = this.qrRepo.create({
            qr_code_valeur: valeur,
            date_expiration: expiration,
            date_creation: new Date(),
            statut: 'actif',
            token,
            short_id,
            id_user_etablissement_sante: id,
          });
          await this.qrRepo.save(qr);
        }
      }
    } catch (err) {
      console.error('❌ Erreur QR dynamique :', err.message);
    }
  }, 60 * 1000);
}
// ...existing code...

  // async getQrActifOuNouveau(idEtablissement: number) {
  //   const now = new Date();

  //   const actif = await this.qrRepo.findOne({
  //     where: {
  //       id_user_etablissement_sante: idEtablissement,
  //       statut: 'actif',
  //       date_expiration: MoreThan(now),
  //     },
  //   });

  //   if (actif) {
  //     ////console.log('✅ QR dynamique actif trouvé');
  //     return actif;
  //   }

  //   await this.qrRepo.delete({ id_user_etablissement_sante: idEtablissement });

  //   const token = this.generateToken();
  //   const expiration = new Date(now.getTime() + 60 * 1000);
  //   const valeur = `HST_DYNAMIC_${idEtablissement}_${token}`;

  //   const qr = this.qrRepo.create({
  //     qr_code_valeur: valeur,
  //     date_expiration: expiration,
  //     date_creation: now,
  //     statut: 'actif',
  //     token,
  //     id_user_etablissement_sante: idEtablissement,
  //   });

  //   const saved = await this.qrRepo.save(qr);
  //   // ////console.log('🔄 Nouveau QR dynamique généré pour ID:', idEtablissement);
  //   return saved;
  // }

  // ...existing code...
async getQrActifOuNouveau(idEtablissement: number) {
  const now = new Date();

  let actif = await this.qrRepo.findOne({
    where: {
      id_user_etablissement_sante: idEtablissement,
      statut: 'actif',
      date_expiration: MoreThan(now),
    },
  });

  if (actif) {
    return actif;
  }

  // Pas de suppression, juste création
  const token = this.generateToken();
  const expiration = new Date(now.getTime() + 60 * 1000);
  const valeur = `HST_DYNAMIC_${idEtablissement}_${token}`;
  const short_id = this.generateShortId();

  const qr = this.qrRepo.create({
    qr_code_valeur: valeur,
    date_expiration: expiration,
    date_creation: now,
    statut: 'actif',
    token,
    short_id,
    id_user_etablissement_sante: idEtablissement,
  });

  const saved = await this.qrRepo.save(qr);
  return saved;
}
// ...existing code...

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

    ////console.log('✅ QR utilisé et invalidé :', token);
    return {
      message: 'QR Code validé avec succès',
      etablissement_id: qr.id_user_etablissement_sante,
    };
  }

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  //  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
  //   const transaction = this.transactionRepo.create({
  //     ...dto,
  //     statut: 'en_attente',
  //   });
  //   return this.transactionRepo.save(transaction);
  // }

}
