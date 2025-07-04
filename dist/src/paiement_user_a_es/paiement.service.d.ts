import { NotificationService } from 'src/module_notification_push/notif_push.service';
import { DataSource } from 'typeorm';
export declare class PaiementService {
    private readonly dataSource;
    private readonly notificationService;
    constructor(dataSource: DataSource, notificationService: NotificationService);
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
    payerParQr(shortId: string, idCompteEtablissement: number, montant: number, idUser: string): Promise<{
        message: string;
        montant_envoyé: number;
        montant_recu: number;
        frais_appliqués: number;
        votre_nouveau_solde_est: any;
        etablissement_de_santé: any;
    }>;
    payerParIdentifiant(identifiant: string, montant: number, idUser: string): Promise<{
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
}
