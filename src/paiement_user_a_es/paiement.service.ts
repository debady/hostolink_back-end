

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PaiementService {
  constructor(private readonly dataSource: DataSource) {}



  async lireInfosParQr(token: string) {
    if (!token) {
      throw new BadRequestException('Token requis');
    }
  
    const [qrValide] = await this.dataSource.query(
      `SELECT id_qrcode, short_id, id_user_etablissement_sante 
       FROM qr_code_paiement_dynamique 
       WHERE token = $1 AND statut = 'actif' AND date_expiration > NOW()
       LIMIT 1`,
      [token],
    );
  
    if (!qrValide) {
      throw new NotFoundException('QR Code invalide ou expiré');
    }
  
    const [infosEtablissement] = await this.dataSource.query(
      `SELECT 
        u.nom AS nom,
        u.telephone,
        u.email,
        u.adresse,
        c.id_compte
       FROM user_etablissement_sante u
       JOIN compte c ON u.id_user_etablissement_sante = c.id_user_etablissement_sante
       WHERE u.id_user_etablissement_sante = $1
       LIMIT 1`,
      [qrValide.id_user_etablissement_sante],
    );
  
    if (!infosEtablissement) {
      throw new NotFoundException('Établissement lié au QR code introuvable');
    }
  
    return {
      id_qrcode: qrValide.id_qrcode,
      short_id: qrValide.short_id,
      id_user_etablissement_sante: qrValide.id_user_etablissement_sante,
      nom_etablissement: infosEtablissement.nom,
      telephone: infosEtablissement.telephone,
      email: infosEtablissement.email,
      adresse: infosEtablissement.adresse,
      id_compte_etablissement: infosEtablissement.id_compte,
    };
  }
  





  async payerParQr(
  shortId: string,
  idCompteEtablissement: number,
  montant: number,
  idUser: string,
) {
  let compteUtilisateur: any = null;
  let compteEtablissement: any = null;
  let idQrcode: number | null = null;

  try {
    // console.log('Début try');

    if (!shortId || !idCompteEtablissement || !montant || !idUser) {
      throw new BadRequestException('Données manquantes pour effectuer le paiement');
    }

    // Récupérer l'id_qrcode depuis le shortId
    const [qr] = await this.dataSource.query(
      `SELECT id_qrcode FROM qr_code_paiement_dynamique WHERE short_id = $1 LIMIT 1`,
      [shortId],
    );
    if (!qr) {
      throw new NotFoundException(`QR Code avec short_id "${shortId}" introuvable.`);
    }
    idQrcode = qr.id_qrcode;

    [compteUtilisateur] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
      [idUser],
    );
    if (!compteUtilisateur) {
      throw new UnauthorizedException('Compte utilisateur introuvable');
    }

    if (compteUtilisateur.solde_compte < montant) {
      throw new BadRequestException('Solde insuffisant');
    }

    [compteEtablissement] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_compte = $1 LIMIT 1`,
      [idCompteEtablissement],
    );
    if (!compteEtablissement) {
      throw new NotFoundException('Compte établissement introuvable');
    }

    const frais = Math.floor(montant * 0);
    const montantFinal = montant - frais;

    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
        [montant, compteUtilisateur.id_compte],
      );
      await manager.query(
        `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
        [montantFinal, compteEtablissement.id_compte],
      );
      const insertTransaction = await manager.query(
        `INSERT INTO transaction_interne 
         (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur)
         VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_qrcode', $6, $7)
         RETURNING id_transaction`,
        [
          compteUtilisateur.id_compte,
          compteEtablissement.id_compte,
          montant,
          montantFinal,
          frais,
          idQrcode,
          compteEtablissement.id_user_etablissement_sante,
        ],
      );
      const idTransaction = insertTransaction[0].id_transaction;
      await manager.query(
        `INSERT INTO transactions_frais 
         (id_transaction, montant_frais, type_transaction, mode_paiement)
         VALUES ($1, $2, 'interne', 'wallet')`,
        [idTransaction, frais],
      );
      await manager.query(
        `UPDATE qr_code_paiement_dynamique SET statut = 'expiré' WHERE id_qrcode = $1`,
        [idQrcode],
      );
    });

    const [compteUserMaj] = await this.dataSource.query(
      `SELECT solde_compte FROM compte WHERE id_compte = $1`,
      [compteUtilisateur.id_compte],
    );
    const [etablissement] = await this.dataSource.query(
      `SELECT nom FROM user_etablissement_sante WHERE id_user_etablissement_sante = $1 LIMIT 1`,
      [compteEtablissement.id_user_etablissement_sante],
    );

    return {
      message: '✅ Paiement effectué avec succès',
      montant_envoyé: montant,
      montant_recu: montantFinal,
      frais_appliqués: frais,
      votre_nouveau_solde_est: compteUserMaj.solde_compte,
      etablissement_de_santé: etablissement?.nom ?? null,
    };
  } catch (error) {
    // console.log('Début catch');
    // Enregistrement systématique de la transaction échouée, même si tout est null
    try {
      await this.dataSource.query(
        `INSERT INTO transaction_interne
          (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur, motif_echec)
         VALUES ($1, $2, $3, $4, $5, $6, 'echouee', 'paiement_qrcode', $7, $8, $9)`,
        [
          compteUtilisateur?.id_compte ?? null,
          compteEtablissement?.id_compte ?? null,
          montant ?? null,
          0,
          0,
          'XOF',
          idQrcode ?? null,
          compteEtablissement?.id_user_etablissement_sante ?? null,
          error.message,
        ]
      );
    } catch (saveError) {
      console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
    }
    throw error;
  }
}




async payerParIdentifiant(identifiant: string, montant: number, idUser: string) {
  let compteUtilisateur: any = null;
  let compteEtablissement: any = null;
  let etab: any = null;
  let etabId: number | null = null;

  try {
    if (!identifiant || !montant || !idUser) {
      throw new BadRequestException('Données manquantes');
    }

    // 1. 🔍 Trouver l’établissement par email ou téléphone
    [etab] = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante 
       WHERE (email = $1 OR telephone = $1) AND compte_verifie = true LIMIT 1`,
      [identifiant],
    );

    if (!etab) {
      throw new NotFoundException("Établissement introuvable ou non vérifié");
    }

    etabId = etab.id_user_etablissement_sante;

    // 2. 💰 Vérifie le compte de l’utilisateur
    [compteUtilisateur] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
      [idUser],
    );

    if (!compteUtilisateur) {
      throw new UnauthorizedException('Compte utilisateur introuvable');
    }

    if (compteUtilisateur.solde_compte < montant) {
      throw new BadRequestException('Solde insuffisant');
    }

    // 3. 🔄 Compte de l’établissement
    [compteEtablissement] = await this.dataSource.query(
      `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
      [etabId],
    );

    if (!compteEtablissement) {
      throw new NotFoundException("Compte de l'établissement introuvable");
    }

    const frais = Math.floor(montant * 0);
    const montantFinal = montant - frais;

    // 4. 🔐 Transaction
    await this.dataSource.transaction(async (manager) => {
      // a. Débit
      await manager.query(
        `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
        [montant, compteUtilisateur.id_compte],
      );

      // b. Crédit
      await manager.query(
        `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
        [montantFinal, compteEtablissement.id_compte],
      );

      // ✅ c. Insérer d’abord dans transaction_interne
      const insertTransaction = await manager.query(
        `INSERT INTO transaction_interne 
        (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur)
        VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_contact', $6)
        RETURNING id_transaction`,
        [
          compteUtilisateur.id_compte,
          compteEtablissement.id_compte,
          montant,
          montantFinal,
          frais,
          etabId,
        ],
      );

      const idTransaction = insertTransaction[0].id_transaction;

      // ✅ d. Insérer dans transactions_frais avec le bon id_transaction
      await manager.query(
        `INSERT INTO transactions_frais 
         (id_transaction, montant_frais, type_transaction, mode_paiement)
         VALUES ($1, $2, 'interne', 'wallet')`,
        [idTransaction, frais],
      );
    });

    // 5. 🔁 Solde utilisateur MAJ
    const [soldeActuel] = await this.dataSource.query(
      `SELECT solde_compte FROM compte WHERE id_compte = $1`,
      [compteUtilisateur.id_compte],
    );

    const beneficiaire = {
      nom: etab.nom,
      telephone: etab.telephone,
      categorie: etab.categorie,
      email: etab.email,
    };

    const [photo] = await this.dataSource.query(
      `SELECT url_image FROM images 
       WHERE id_user_etablissement_sante = $1 AND motif = 'photo_profile' 
       ORDER BY date DESC LIMIT 1`,
      [etab.id_user_etablissement_sante],
    );

    return {
      message: '✅ Paiement effectué avec succès',
      identifiant_etablissement: identifiant,
      montant_envoyé: montant,
      montant_recu: montantFinal,
      frais_appliqués: frais,
      solde_restant: soldeActuel?.solde_compte || null,
      beneficiaire,
      photo: photo?.url_image ?? null,
    };
  } catch (error) {
    console.log('debut catch');
     // Enregistrement systématique de la transaction échouée, même si tout est null
    try {
     await this.dataSource.query(
        `INSERT INTO transaction_interne
          (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur, motif_echec)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
       [
        compteUtilisateur?.id_compte ?? null,
        compteEtablissement?.id_compte ?? null,
        montant ?? null,
        0,
        0,
        'XOF',
        'echouee',
        'transaction par identifiant',
        compteEtablissement?.id_user_etablissement_sante ?? null,
        error.message,
        ]
      );
      console.log('Transaction échouée enregistrée');
    } catch (saveError) {
      console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
    }
    throw error;
  }






  // async payerParQr(
  //   shortId: string,
  //   idCompteEtablissement: number,
  //   montant: number,
  //   idUser: string,
  // ) {

  //   if (!shortId || !idCompteEtablissement || !montant || !idUser) {
  //     throw new BadRequestException('Données manquantes pour effectuer le paiement');
  //   }
  
  //   // 🔍 Récupérer l'id_qrcode depuis le shortId
  //   const [qr] = await this.dataSource.query(
  //     `SELECT id_qrcode FROM qr_code_paiement_dynamique WHERE short_id = $1 LIMIT 1`,
  //     [shortId],
  //   );

  //   if (!qr) {
  //     throw new NotFoundException(`QR Code avec short_id "${shortId}" introuvable.`);
  //   }

  //   const idQrcode = qr.id_qrcode;


  //   const [compteUtilisateur] = await this.dataSource.query(
  //     `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
  //     [idUser],
  //   );
  
  //   if (!compteUtilisateur) {
  //     throw new UnauthorizedException('Compte utilisateur introuvable');
  //   }
  
  //   if (compteUtilisateur.solde_compte < montant) {
  //     throw new BadRequestException('Solde insuffisant');
  //   }
  
  //   const [compteEtablissement] = await this.dataSource.query(
  //     `SELECT * FROM compte WHERE id_compte = $1 LIMIT 1`,
  //     [idCompteEtablissement],
  //   );
  
  //   if (!compteEtablissement) {
  //     throw new NotFoundException('Compte établissement introuvable');
  //   }
  
  //   const frais = Math.floor(montant * 0.02);
  //   const montantFinal = montant - frais;
  
  //   await this.dataSource.transaction(async (manager) => {
  //     await manager.query(
  //       `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
  //       [montant, compteUtilisateur.id_compte],
  //     );
  
  //     await manager.query(
  //       `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
  //       [montantFinal, compteEtablissement.id_compte],
  //     );
  
  //     const insertTransaction = await manager.query(
  //       `INSERT INTO transaction_interne 
  //        (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur)
  //        VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_qrcode', $6, $7)
  //        RETURNING id_transaction`,
  //       [
  //         compteUtilisateur.id_compte,
  //         compteEtablissement.id_compte,
  //         montant,
  //         montantFinal,
  //         frais,
  //         idQrcode,
  //         compteEtablissement.id_user_etablissement_sante,
  //       ],
  //     );
  
  //     const idTransaction = insertTransaction[0].id_transaction;
  
  //     await manager.query(
  //       `INSERT INTO transactions_frais 
  //        (id_transaction, montant_frais, type_transaction, mode_paiement)
  //        VALUES ($1, $2, 'interne', 'wallet')`,
  //       [idTransaction, frais],
  //     );
  
  //     await manager.query(
  //       `UPDATE qr_code_paiement_dynamique SET statut = 'expiré' WHERE id_qrcode = $1`,
  //       [idQrcode],
  //     );
  //   });
  
  //   const [compteUserMaj] = await this.dataSource.query(
  //     `SELECT solde_compte FROM compte WHERE id_compte = $1`,
  //     [compteUtilisateur.id_compte],
  //   );
  
  //   const [compteEtabMaj] = await this.dataSource.query(
  //     `SELECT solde_compte FROM compte WHERE id_compte = $1`,
  //     [compteEtablissement.id_compte],
  //   );

  //   const [etablissement] = await this.dataSource.query(
  //     `SELECT nom FROM user_etablissement_sante WHERE id_user_etablissement_sante = $1 LIMIT 1`,
  //     [compteEtablissement.id_user_etablissement_sante],
  //   );
  
  //   return {
  //     message: '✅ Paiement effectué avec succès',
  //     montant_envoyé: montant,
  //     montant_recu: montantFinal,
  //     frais_appliqués: frais,
  //     votre_nouveau_solde_est: compteUserMaj.solde_compte,
  //     etablissement_de_santé: etablissement?.nom ?? null, // ✅ Ajouté
  //     // solde_etablissement: compteEtabMaj.solde_compte,
  //   };
  // }
  

  // // 3️⃣ Paiement par identifiant d’établissement (inchangé pour l’instant)
  // async payerParIdentifiant(identifiant: string, montant: number, idUser: string) {
  //         if (!identifiant || !montant || !idUser) {
  //           throw new BadRequestException('Données manquantes');
  //         }
        
  //         // 1. 🔍 Trouver l’établissement par email ou téléphone
  //         const [etab] = await this.dataSource.query(
  //           `SELECT * FROM user_etablissement_sante 
  //            WHERE (email = $1 OR telephone = $1) AND compte_verifie = true LIMIT 1`,
  //           [identifiant],
  //         );
        
  //         if (!etab) {
  //           throw new NotFoundException("Établissement introuvable ou non vérifié");
  //         }
        
  //         const etabId = etab.id_user_etablissement_sante;
        
  //         // 2. 💰 Vérifie le compte de l’utilisateur
  //         const [compteUtilisateur] = await this.dataSource.query(
  //           `SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`,
  //           [idUser],
  //         );
        
  //         if (!compteUtilisateur) {
  //           throw new UnauthorizedException('Compte utilisateur introuvable');
  //         }
        
  //         if (compteUtilisateur.solde_compte < montant) {
  //           throw new BadRequestException('Solde insuffisant');
  //         }
        
  //         // 3. 🔄 Compte de l’établissement
  //         const [compteEtablissement] = await this.dataSource.query(
  //           `SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`,
  //           [etabId],
  //         );
        
  //         if (!compteEtablissement) {
  //           throw new NotFoundException("Compte de l'établissement introuvable");
  //         }
        
  //         const frais = Math.floor(montant * 0.02);
  //         const montantFinal = montant - frais;
        
  //         // 4. 🔐 Transaction
  //         await this.dataSource.transaction(async (manager) => {
  //           // a. Débit
  //           await manager.query(
  //             `UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`,
  //             [montant, compteUtilisateur.id_compte],
  //           );
          
  //           // b. Crédit
  //           await manager.query(
  //             `UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`,
  //             [montantFinal, compteEtablissement.id_compte],
  //           );
          
  //           // ✅ c. Insérer d’abord dans transaction_interne
  //           const insertTransaction = await manager.query(
  //             `INSERT INTO transaction_interne 
  //             (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur)
  //             VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_contact', $6)
  //             RETURNING id_transaction`,
  //             [
  //               compteUtilisateur.id_compte,
  //               compteEtablissement.id_compte,
  //               montant,
  //               montantFinal, // ✅ montant_recu
  //               frais,
  //               etabId,
  //             ],
  //           );
            
          
  //           const idTransaction = insertTransaction[0].id_transaction;
          
  //           // ✅ d. Insérer dans transactions_frais avec le bon id_transaction
  //           await manager.query(
  //             `INSERT INTO transactions_frais 
  //              (id_transaction, montant_frais, type_transaction, mode_paiement)
  //              VALUES ($1, $2, 'interne', 'wallet')`,
  //             [idTransaction, frais],
  //           );
  //         });
          
        
  //         // 5. 🔁 Solde utilisateur MAJ
  //         const [soldeActuel] = await this.dataSource.query(
  //           `SELECT solde_compte FROM compte WHERE id_compte = $1`,
  //           [compteUtilisateur.id_compte],
  //         );
    
  //     const beneficiaire = {
  //       nom: etab.nom,
  //       telephone: etab.telephone,
  //       categorie: etab.categorie,
  //       email: etab.email,
  //     };
      

  //     const [photo] = await this.dataSource.query(
  //       `SELECT url_image FROM images 
  //        WHERE id_user_etablissement_sante = $1 AND motif = 'photo_profile' 
  //        ORDER BY date DESC LIMIT 1`,
  //       [etab.id_user_etablissement_sante],
  //     );

  //         return {
  //           message: '✅ Paiement effectué avec succès',
  //           identifiant_etablissement: identifiant,
  //           montant_envoyé: montant,
  //           montant_recu: montantFinal,
  //           frais_appliqués: frais,
  //           solde_restant: soldeActuel?.solde_compte || null,
  //           beneficiaire,
  //       photo: photo?.url_image ?? null, // ✅ Valeur sûre

  //     };
          
    }
        
}

