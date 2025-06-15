"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./utilisateur/user.module");
const cloudinary_module_1 = require("./upload/cloudinary.module");
const administrateur_module_1 = require("./administrateur/administrateur.module");
const gestion_utilisateur_module_1 = require("./administrateur/Gest_utilisateurs/gestion_utilisateur.module");
const invitation_module_1 = require("./invitations/invitation.module");
const annonce_module_1 = require("./annonce/annonce.module");
const liste_numero_etablissement_sante_module_1 = require("./liste_etablissement/liste_numero_etablissement_sante.module");
const etablissement_sante_module_1 = require("./localisation_etablissement_sante/etablissement_sante.module");
const user_etablissement_sante_module_1 = require("./user_etablissement_sante/user-etablissement-sante.module");
const expert_sante_module_1 = require("./user_etablissement_sante/expert-sante.module");
const qr_dynamique_module_1 = require("./qr-dynamique_user_es/qr-dynamique.module");
const paiement_module_1 = require("./paiement_user_a_es/paiement.module");
const transaction_frais_module_1 = require("./transaction-frais/transaction-frais.module");
const transaction_interne_module_1 = require("./transaction-interne/transaction-interne.module");
const thematique_discussion_module_1 = require("./1-Module_reseaux_sociale/thematique_discussion/thematique_discussion.module");
const agent_assistant_module_1 = require("./agent-assistant/agent-assistant.module");
const questions_predefinies_module_1 = require("./Discussion_agent_client/questions_predefinies/questions_predefinies.module");
const message_assistant_client_module_1 = require("./Discussion_agent_client/message_assistant_client/message_assistant_client.module");
const conversations_module_1 = require("./Discussion_agent_client/conversations/conversations.module");
const messages_assistant_client_image_module_1 = require("./Discussion_agent_client/messages_assistant_client_image/messages_assistant_client_image.module");
const image_module_1 = require("./image/image.module");
const commentaire_module_1 = require("./1-Module_reseaux_sociale/commentaire/commentaire.module");
const publication_module_1 = require("./1-Module_reseaux_sociale/publication/publication.module");
const transaction_module_1 = require("./transaction_user_es/transaction.module");
const documents_identite_module_1 = require("./documents_identite/documents_identite.module");
const partage_module_1 = require("./1-Module_reseaux_sociale/partage/partage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: Number(process.env.DATABASE_PORT) || 5432,
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'postgres',
                database: process.env.DATABASE_NAME || 'hostolink_bd',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                autoLoadEntities: true,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            image_module_1.ImageModule,
            cloudinary_module_1.CloudinaryModule,
            administrateur_module_1.AdministrateurModule,
            gestion_utilisateur_module_1.GestionUtilisateurModule,
            invitation_module_1.InvitationModule,
            annonce_module_1.AnnonceModule,
            liste_numero_etablissement_sante_module_1.ListeNumeroEtablissementSanteModule,
            etablissement_sante_module_1.EtablissementSanteModule,
            user_etablissement_sante_module_1.UserEtablissementSanteModule,
            expert_sante_module_1.ExpertSanteModule,
            qr_dynamique_module_1.QrDynamiqueModule,
            paiement_module_1.PaiementModule,
            transaction_frais_module_1.TransactionFraisModule,
            transaction_interne_module_1.TransactionInterneModule,
            thematique_discussion_module_1.ThematiqueDiscussionModule,
            agent_assistant_module_1.AgentAssistantModule,
            questions_predefinies_module_1.QuestionsPredefiniesModule,
            message_assistant_client_module_1.MessageAssistantClientModule,
            conversations_module_1.ConversationsModule,
            messages_assistant_client_image_module_1.MessagesAssistantClientImageModule,
            documents_identite_module_1.DocumentsIdentiteModule,
            commentaire_module_1.CommentaireModule,
            partage_module_1.PartageModule,
            publication_module_1.PublicationModule,
            partage_module_1.PartageModule,
            commentaire_module_1.CommentaireModule,
            transaction_module_1.TransactionModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map