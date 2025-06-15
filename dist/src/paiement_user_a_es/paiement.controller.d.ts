import { PaiementService } from './paiement.service';
export declare class PaiementController {
    private readonly paiementService;
    constructor(paiementService: PaiementService);
    lireInfosParQr(token: string): Promise<{
        id_qrcode: any;
        short_id: any;
        id_user_etablissement_sante: any;
        nom_etablissement: any;
        telephone: any;
        email: any;
        adresse: any;
        id_compte_etablissement: any;
    }>;
    payerParQr(req: any, body: {
        shortId: string;
        idCompteEtablissement: number;
        montant: number;
    }): Promise<{
        message: string;
        montant_envoyé: number;
        montant_recu: number;
        frais_appliqués: number;
        votre_nouveau_solde_est: any;
        etablissement_de_santé: any;
    }>;
    payerVersEtablissementParIdentifiant(body: {
        identifiant: string;
        montant: number;
    }, req: any): Promise<{
        message: string;
        identifiant_etablissement: string;
        montant_envoyé: number;
        montant_recu: number;
        frais_appliqués: number;
        solde_restant: any;
        beneficiaire: {
            nom: any;
            telephone: any;
            categorie: any;
            email: any;
        };
        photo: any;
    }>;
    getTokenTest(req: any): {
        message: string;
        utilisateur: any;
    };
}
