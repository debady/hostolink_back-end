-- Table: administrateurs
CREATE TABLE public.administrateurs (
    id_admin_gestionnaire SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    statut VARCHAR(20) DEFAULT 'actif',
    dernier_connexion TIMESTAMP,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    compte_verifier BOOLEAN DEFAULT false
);

-- Table: agent_assistance
CREATE TABLE public.agent_assistance (
    id_agent_assistance SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    mdp VARCHAR(255) NOT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_photo_agent VARCHAR(255)
);

-- Table: annonce
CREATE TABLE public.annonce (
    id_annonce SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    titre_annonce VARCHAR(255),
    description_annonce TEXT,
    date DATE,
    url_images VARCHAR(255) DEFAULT NULL
);

-- Table: assistance_categories
CREATE TABLE public.assistance_categories (
    id_categorie SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reponse_automatique TEXT NOT NULL
);

-- Table: cartes_bancaires
CREATE TABLE public.cartes_bancaires (
    id_carte_bancaire SERIAL PRIMARY KEY,
    type_carte VARCHAR(20) NOT NULL CHECK (type_carte IN ('physique', 'virtuelle')),
    banque VARCHAR(100) DEFAULT 'Hostolink',
    alias VARCHAR(50),
    numero_carte VARCHAR(20) DEFAULT '****-****-****-7394',
    date_expiration DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'inactif',
    kyc_verifie BOOLEAN DEFAULT false,
    commande_physique BOOLEAN DEFAULT false,
    date_creation TIMESTAMP DEFAULT NOW(),
    id_compte INTEGER NOT NULL,
    id_user UUID
);


-- Table: cartes_physiques
CREATE TABLE public.cartes_physiques (
    id_commande SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    id_carte_bancaire INTEGER NOT NULL,
    adresse_livraison TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en attente',
    date_commande TIMESTAMP DEFAULT NOW(),
    id_user UUID
);

-- Table: cartes_qr_code_statique
CREATE TABLE public.cartes_qr_code_statique (
    id_carte_qr_statique SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    qr_code_unique TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    id_user UUID
);

-- Table: code_verif_otp
CREATE TABLE public.code_verif_otp (
    id SERIAL PRIMARY KEY,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_valid BOOLEAN DEFAULT true NOT NULL,
    moyen_envoyer VARCHAR(20) NOT NULL CHECK (moyen_envoyer IN ('email', 'telephone')),
    id_user UUID,
    id_user_etablissement_sante INTEGER
);

-- Table: commentaire
CREATE TABLE public.commentaire (
    id_commentaire SERIAL PRIMARY KEY,
    id_publication INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    date_commentaire TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: compte
CREATE TABLE public.compte (
    id_compte SERIAL PRIMARY KEY,
    solde_compte INTEGER DEFAULT 0,
    solde_bonus INTEGER DEFAULT 0,
    cumule_mensuel INTEGER DEFAULT 0,
    plafond INTEGER DEFAULT 100000,
    mode_paiement_preferentiel VARCHAR(50),
    type_user VARCHAR(20) NOT NULL CHECK (type_user IN ('utilisateur', 'etablissement')),
    devise VARCHAR(10) DEFAULT 'XOF' NOT NULL,
    numero_compte VARCHAR(50) UNIQUE,
    date_creation_compte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    id_user UUID,
    id_user_etablissement_sante INTEGER
);


-- Table: contacts_hostolink
CREATE TABLE public.contacts_hostolink (
    id_contact SERIAL PRIMARY KEY,
    id_compte_contact INTEGER NOT NULL,
    alias_contact VARCHAR(100),
    nom_contact VARCHAR(255),
    numero_contact VARCHAR(20) NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user UUID,
    id_contact_user UUID
);

-- Table: discussion_assistant_client
CREATE TABLE public.discussion_assistant_client (
    id_discussion SERIAL PRIMARY KEY,
    id_agent_assistance INTEGER NOT NULL,
    id_etablissement INTEGER,
    sujet VARCHAR(255) NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'resolu', 'ferme')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_dernier_message TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_categorie_assistance INTEGER NOT NULL,
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Table: expert_sante
CREATE TABLE public.expert_sante (
    id_expert SERIAL PRIMARY KEY,
    id_user_etablissement_sante INTEGER NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    domaine_expertise VARCHAR(255),
    identifiant CHAR(6) NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    url_profile TEXT
);

-- Table: historique_transactions
CREATE TABLE public.historique_transactions (
    id_historique SERIAL PRIMARY KEY,
    id_transaction INTEGER NOT NULL,
    ancien_statut VARCHAR(20),
    nouveau_statut VARCHAR(20),
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Table: images
CREATE TABLE public.images (
    id_image UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date TIMESTAMP DEFAULT now() NOT NULL,
    url_image VARCHAR NOT NULL,
    motif VARCHAR(50) NOT NULL,
    type_user VARCHAR(50),
    id_user UUID,
    id_user_etablissement_sante INTEGER,
    id_admin_gestionnaire INTEGER
);

-- Table: journal_activites
CREATE TABLE public.journal_activites (
    id_activite SERIAL PRIMARY KEY,
    id_user INTEGER,
    id_admin_gestionnaire INTEGER,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    date_heure TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: liste_numero_vert_etablissement_sante
CREATE TABLE public.liste_numero_vert_etablissement_sante (
    id_liste_num_etablissement_sante SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    nom_etablissement VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    image VARCHAR(255),
    presentation TEXT NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    type_etablissement VARCHAR(50) NOT NULL CHECK (type_etablissement IN ('hopital', 'clinique', 'pharmacie', 'centre_medical', 'autre')),
    site_web VARCHAR(255),
    categorie VARCHAR(255) DEFAULT NULL
);


-- Table: message_assistant_client
CREATE TABLE public.message_assistant_client (
    id_message SERIAL PRIMARY KEY,
    id_discussion INTEGER NOT NULL,
    expediteur VARCHAR(20) NOT NULL CHECK (expediteur IN ('utilisateur', 'etablissement', 'agent_assistance')),
    id_expediteur INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    type_message VARCHAR(20) DEFAULT 'texte' CHECK (type_message IN ('texte', 'image', 'fichier')),
    url_fichier VARCHAR(255),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Table: messages_thematique
CREATE TABLE public.messages_thematique (
    id_message SERIAL PRIMARY KEY,
    id_thematique_discussion INTEGER NOT NULL,
    id_expediteur UUID NOT NULL,
    contenu TEXT NOT NULL,
    type_message VARCHAR(20) NOT NULL CHECK (type_message IN ('texte', 'image')),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_lu BOOLEAN DEFAULT false,
    url_image TEXT,
    nbre_like INTEGER,
    status_reponse BOOLEAN DEFAULT false
);

-- Table: notification_broadcast
CREATE TABLE public.notification_broadcast (
    id_notification_broadcast SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    cible VARCHAR(20) NOT NULL CHECK (cible IN ('utilisateur', 'etablissement')),
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'envoye',
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante INTEGER
);

-- Table: notification_transaction
CREATE TABLE public.notification_transaction (
    id_notification_transaction SERIAL PRIMARY KEY,
    id_transaction INTEGER NOT NULL,
    identif_transaction VARCHAR(10) DEFAULT ('Hstlk-' || substr(md5(random()::text), 1, 5)) NOT NULL,
    type_notification VARCHAR(20) NOT NULL CHECK (type_notification IN ('paiement', 'retrait', 'virement', 'autre')),
    contenu TEXT NOT NULL,
    montant NUMERIC(15,2),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'envoyé',
    is_lu BOOLEAN DEFAULT false NOT NULL,
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Table: partage
CREATE TABLE public.partage (
    id_partage SERIAL PRIMARY KEY,
    id_publication INTEGER NOT NULL,
    id_user INTEGER NOT NULL,
    date_partage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lien_partage VARCHAR(255),
    plateforme_partage VARCHAR(255),
    nombre_clics INTEGER DEFAULT 0,
    id_user_etablissement_sante INTEGER
);

-- Table: publication
CREATE TABLE public.publication (
    id_publication SERIAL PRIMARY KEY,
    titre_publication VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    image VARCHAR(255),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    compteur_like INTEGER DEFAULT 0,
    id_user_etablissement_sante INTEGER,
    id_admin_gestionnaire INTEGER NOT NULL,
    id_user UUID
);

-- Table: publicite
CREATE TABLE public.publicite (
    id_pub SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    descript_pub TEXT NOT NULL,
    url_image_pub VARCHAR(255),
    date_debut_pub DATE NOT NULL,
    date_fin_pub DATE NOT NULL,
    statuts VARCHAR(20) DEFAULT 'actif'
);


-- Table: qr_code_paiement_dynamique
CREATE TABLE public.qr_code_paiement_dynamique (
    id_qrcode SERIAL PRIMARY KEY,
    qr_code_valeur TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_expiration TIMESTAMP NOT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    token VARCHAR(1000) DEFAULT NULL,
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Table: qr_code_paiement_statique
CREATE TABLE public.qr_code_paiement_statique (
    id_qrcode SERIAL PRIMARY KEY,
    qr_code_data TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    id_user_etablissement_sante INTEGER,
    id_user UUID,
    date_expiration TIMESTAMP,
    token VARCHAR(1000)
);

-- Table: reclamations
CREATE TABLE public.reclamations (
    id_reclamation SERIAL PRIMARY KEY,
    id_transaction INTEGER,
    sujet VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente',
    date_ouverture TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motif VARCHAR(255) DEFAULT 'Autre',
    id_user_etablissement_sante INTEGER,
    id_admin_gestionnaire INTEGER NOT NULL,
    id_user UUID
);

-- Table: thematiques
CREATE TABLE public.thematiques (
    id_thematique_discussion SERIAL PRIMARY KEY,
    id_admin_gestionnaire INTEGER NOT NULL,
    titre_thematique VARCHAR(255) NOT NULL,
    sous_titre VARCHAR(255),
    image VARCHAR(255),
    description TEXT NOT NULL,
    nbre_expert INTEGER DEFAULT 0,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: transaction_externe
CREATE TABLE public.transaction_externe (
    id_transaction_externe SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    montant NUMERIC(15,2) NOT NULL,
    frais_transaction NUMERIC(10,2) DEFAULT 0.00,
    statut VARCHAR(20) DEFAULT 'en attente',
    devise VARCHAR(10) NOT NULL,
    type_transaction VARCHAR(100) CHECK (type_transaction IN ('depot', 'retrait')),
    moyen_paiement VARCHAR(50) CHECK (moyen_paiement IN ('wave', 'mtn', 'moov', 'orange', 'paypal', 'djamo', 'push', 'carte_bancaire', 'virement_bancaire')),
    reference_externe VARCHAR(100) UNIQUE,
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motif VARCHAR(255) NOT NULL,
    id_compte INTEGER NOT NULL,
    id_moyen_paiement INTEGER NOT NULL,
    id_transaction INTEGER
);

-- Table: transaction_interne
CREATE TABLE public.transaction_interne (
    id_transaction SERIAL PRIMARY KEY,
    id_compte_expediteur INTEGER NOT NULL,
    id_utilisateur_recepteur INTEGER,
    id_etablissement_recepteur INTEGER,
    montant NUMERIC(15,2) NOT NULL,
    frais_transaction NUMERIC(10,2) DEFAULT 0.00,
    statut VARCHAR(20) DEFAULT 'en attente',
    devise_transaction VARCHAR(10) NOT NULL,
    type_transaction VARCHAR(100) CHECK (type_transaction IN ('transfert', 'paiement_qrcode')),
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_qrcode INTEGER,
    id_compte_recepteur INTEGER NOT NULL,
    id_user_etablissement_sante INTEGER
);

-- Table: transactions_bancaires
CREATE TABLE public.transactions_bancaires (
    id_transaction SERIAL PRIMARY KEY,
    id_carte_bancaire INTEGER NOT NULL,
    montant NUMERIC(15,2) NOT NULL,
    devise VARCHAR(10) NOT NULL,
    statut VARCHAR(20) DEFAULT 'en attente',
    date_transaction TIMESTAMP DEFAULT NOW(),
    description TEXT
);


-- Table: transactions_frais
CREATE TABLE public.transactions_frais (
    id_frais SERIAL PRIMARY KEY,
    id_transaction INTEGER NOT NULL UNIQUE,
    montant_frais INTEGER NOT NULL,
    type_transaction VARCHAR(20) NOT NULL CHECK (type_transaction IN ('interne', 'externe', 'bancaire')),
    mode_paiement VARCHAR(20) NOT NULL CHECK (mode_paiement IN ('wallet', 'mobile_money', 'banque')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_etablissement_sante
CREATE TABLE public.user_etablissement_sante (
    id_user_etablissement_sante SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    telephone VARCHAR(20),
    categorie VARCHAR(100),
    adresse TEXT,
    creat_at TIMESTAMP DEFAULT NOW(),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom public.geometry(Point,4326),
    specialites VARCHAR,
    email VARCHAR(255) UNIQUE DEFAULT NULL,
    mot_de_passe TEXT
);

-- Table: utilisateur
CREATE TABLE public.utilisateur (
    id_user UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date_inscription TIMESTAMP DEFAULT NOW() NOT NULL,
    position public.geometry(Point,4326),
    email VARCHAR(255),
    telephone VARCHAR(20),
    mdp VARCHAR(255),
    nom VARCHAR(255),
    prenom VARCHAR(255),
    pays VARCHAR(100),
    raison_banni TEXT DEFAULT 'R.A.S',
    compte_verifier BOOLEAN DEFAULT false,
    dernier_otp_envoye TIMESTAMP,
    actif BOOLEAN DEFAULT true,
    fcm_token VARCHAR(255) DEFAULT NULL
);

-- Table: verification_kyc
CREATE TABLE public.verification_kyc (
    id_kyc SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    type_document VARCHAR(50) CHECK (type_document IN ('CNI', 'Passeport', 'Permis de conduire')),
    url_document_recto TEXT NOT NULL,
    url_document_verso TEXT,
    selfie_url TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en attente',
    date_soumission TIMESTAMP DEFAULT NOW(),
    id_user_etablissement_sante INTEGER,
    id_user UUID
);

-- Relation `annonce` avec `administrateurs`
ALTER TABLE public.annonce
ADD CONSTRAINT fk_annonce_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `cartes_bancaires` avec `utilisateur`
ALTER TABLE public.cartes_bancaires
ADD CONSTRAINT fk_cartes_bancaires_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `cartes_physiques` avec `utilisateur`
ALTER TABLE public.cartes_physiques
ADD CONSTRAINT fk_cartes_physiques_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `cartes_qr_code_statique` avec `utilisateur`
ALTER TABLE public.cartes_qr_code_statique
ADD CONSTRAINT fk_cartes_qr_code_statique_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `code_verif_otp` avec `utilisateur`
ALTER TABLE public.code_verif_otp
ADD CONSTRAINT fk_code_verif_otp_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `code_verif_otp` avec `user_etablissement_sante`
ALTER TABLE public.code_verif_otp
ADD CONSTRAINT fk_code_verif_otp_user_etablissement
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `compte` avec `utilisateur`
ALTER TABLE public.compte
ADD CONSTRAINT fk_compte_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `compte` avec `user_etablissement_sante`
ALTER TABLE public.compte
ADD CONSTRAINT fk_compte_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `contacts_hostolink` avec `utilisateur`
ALTER TABLE public.contacts_hostolink
ADD CONSTRAINT fk_contacts_hostolink_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `contacts_hostolink` avec `utilisateur` (contact enregistré)
ALTER TABLE public.contacts_hostolink
ADD CONSTRAINT fk_contacts_hostolink_contact
FOREIGN KEY (id_contact_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


-- Relation `discussion_assistant_client` avec `utilisateur`
ALTER TABLE public.discussion_assistant_client
ADD CONSTRAINT fk_discussion_assistant_client_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `discussion_assistant_client` avec `user_etablissement_sante`
ALTER TABLE public.discussion_assistant_client
ADD CONSTRAINT fk_discussion_assistant_client_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `historique_transactions` avec `utilisateur`
ALTER TABLE public.historique_transactions
ADD CONSTRAINT fk_historique_transactions_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `historique_transactions` avec `user_etablissement_sante`
ALTER TABLE public.historique_transactions
ADD CONSTRAINT fk_historique_transactions_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `notification_transaction` avec `utilisateur`
ALTER TABLE public.notification_transaction
ADD CONSTRAINT fk_notification_transaction_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `notification_transaction` avec `user_etablissement_sante`
ALTER TABLE public.notification_transaction
ADD CONSTRAINT fk_notification_transaction_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `partage` avec `publication`
ALTER TABLE public.partage
ADD CONSTRAINT fk_partage_publication
FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;

-- Relation `partage` avec `user_etablissement_sante`
ALTER TABLE public.partage
ADD CONSTRAINT fk_partage_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `publication` avec `utilisateur`
ALTER TABLE public.publication
ADD CONSTRAINT fk_publication_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `qr_code_paiement_dynamique` avec `utilisateur`
ALTER TABLE public.qr_code_paiement_dynamique
ADD CONSTRAINT fk_qr_code_dynamique_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `qr_code_paiement_dynamique` avec `user_etablissement_sante`
ALTER TABLE public.qr_code_paiement_dynamique
ADD CONSTRAINT fk_qr_code_paiement_dynamique_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `qr_code_paiement_statique` avec `utilisateur`
ALTER TABLE public.qr_code_paiement_statique
ADD CONSTRAINT fk_qr_code_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `qr_code_paiement_statique` avec `user_etablissement_sante`
ALTER TABLE public.qr_code_paiement_statique
ADD CONSTRAINT fk_qr_code_paiement_statique_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `reclamations` avec `utilisateur`
ALTER TABLE public.reclamations
ADD CONSTRAINT fk_reclamations_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `reclamations` avec `user_etablissement_sante`
ALTER TABLE public.reclamations
ADD CONSTRAINT fk_reclamations_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `reclamations` avec `administrateurs`
ALTER TABLE public.reclamations
ADD CONSTRAINT fk_reclamations_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `transaction_interne` avec `user_etablissement_sante`
ALTER TABLE public.transaction_interne
ADD CONSTRAINT fk_transaction_interne_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


-- Relation `expert_sante` avec `user_etablissement_sante`
ALTER TABLE public.expert_sante
ADD CONSTRAINT fk_expert_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `thematiques` avec `administrateurs`
ALTER TABLE public.thematiques
ADD CONSTRAINT fk_thematiques_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `messages_thematique` avec `thematiques`
ALTER TABLE public.messages_thematique
ADD CONSTRAINT fk_message_thematique
FOREIGN KEY (id_thematique_discussion) REFERENCES public.thematiques(id_thematique_discussion) ON DELETE CASCADE;

-- Relation `messages_thematique` avec `utilisateur`
ALTER TABLE public.messages_thematique
ADD CONSTRAINT fk_message_utilisateur
FOREIGN KEY (id_expediteur) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `notification_broadcast` avec `administrateurs`
ALTER TABLE public.notification_broadcast
ADD CONSTRAINT fk_notification_broadcast_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `notification_broadcast` avec `user_etablissement_sante`
ALTER TABLE public.notification_broadcast
ADD CONSTRAINT fk_notification_broadcast_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `verification_kyc` avec `utilisateur`
ALTER TABLE public.verification_kyc
ADD CONSTRAINT fk_verification_kyc_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `verification_kyc` avec `user_etablissement_sante`
ALTER TABLE public.verification_kyc
ADD CONSTRAINT fk_verification_kyc_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `images` avec `administrateurs`
ALTER TABLE public.images
ADD CONSTRAINT fk_images_administrateurs
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `images` avec `user_etablissement_sante`
ALTER TABLE public.images
ADD CONSTRAINT fk_images_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

-- Relation `images` avec `utilisateur`
ALTER TABLE public.images
ADD CONSTRAINT fk_images_users
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Relation `journal_activites` avec `administrateurs`
ALTER TABLE public.journal_activites
ADD CONSTRAINT fk_journal_activites_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `publication` avec `administrateurs`
ALTER TABLE public.publication
ADD CONSTRAINT fk_publication_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `publicite` avec `administrateurs`
ALTER TABLE public.publicite
ADD CONSTRAINT fk_publicite_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `liste_numero_vert_etablissement_sante` avec `administrateurs`
ALTER TABLE public.liste_numero_vert_etablissement_sante
ADD CONSTRAINT fk_liste_numero_vert_admin_gestionnaire
FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

-- Relation `message_assistant_client` avec `utilisateur`
ALTER TABLE public.message_assistant_client
ADD CONSTRAINT fk_message_assistant_client_utilisateur
FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

-- Relation `message_assistant_client` avec `user_etablissement_sante`
ALTER TABLE public.message_assistant_client
ADD CONSTRAINT fk_message_assistant_client_user_etablissement_sante
FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;
