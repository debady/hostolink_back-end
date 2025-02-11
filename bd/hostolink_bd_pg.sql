

-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS annonce, carte_bancaire, commentaire, compte, contacts_enregistres, 
    etablissement_sante, liker, liste_numero_etablissement_sante, localisation, message, 
    notification, partages, publication, publicite, qr_code_paiement, role_permission, 
    thematiques, transaction, utilisateur, verification_compte, verification_identite CASCADE;

-- Création des tables sans les clés étrangères

CREATE TABLE annonce (
    id_annonce SERIAL PRIMARY KEY,
    titre_annonce VARCHAR(255) NOT NULL,
    description_annonce TEXT,
    date DATE NOT NULL,
    id_role_permission INT
);

CREATE TABLE carte_bancaire (
    id_carte_bancaire SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    numero_carte VARCHAR(20) UNIQUE NOT NULL,
    date_expiration DATE NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    type_bancaire VARCHAR(20) NOT NULL,
    status_bancaire VARCHAR(20) DEFAULT 'actif'
);

CREATE TABLE commentaire (
    id_commentaire SERIAL PRIMARY KEY,
    id_publication INT NOT NULL,
    id_user INT NOT NULL,
    contenu_commentaire TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compte (
    id_compte SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    type_compte VARCHAR(20) NOT NULL,
    solde_compte DECIMAL(15,2) DEFAULT 0.00,
    devise VARCHAR(10) NOT NULL,
    numero_compte VARCHAR(50) UNIQUE NOT NULL,
    date_creation_compte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

CREATE TABLE contacts_enregistres (
    id_contact SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_contact_user INT NOT NULL,
    nom_contact VARCHAR(255),
    numero_contact VARCHAR(20),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE etablissement_sante (
    id_etablissement SERIAL PRIMARY KEY,
    telephone_etablissement_sante VARCHAR(20) NOT NULL,
    nom_etablissement_sante VARCHAR(255) NOT NULL,
    adresse_etablissement_sante TEXT NOT NULL,
    type_etablissement VARCHAR(100) NOT NULL,
    email_etablissement_sante VARCHAR(255) UNIQUE,
    mdp VARCHAR(255) NOT NULL,
    id_localisation INT
);

CREATE TABLE liker (
    id_like SERIAL PRIMARY KEY,
    id_post_liker INT NOT NULL,
    id_user INT NOT NULL,
    date_liker TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE liste_numero_etablissement_sante (
    id_liste_num_etablissement_sante SERIAL PRIMARY KEY,
    id_role_permission INT,
    nom_etablissement VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    image VARCHAR(255),
    presentation TEXT NOT NULL,
    emplacement VARCHAR(255) NOT NULL
);

CREATE TABLE localisation (
    id_localisation SERIAL PRIMARY KEY,
    longitude DECIMAL(10,8) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    altitude DECIMAL(10,8)
);

CREATE TABLE message (
    id_message SERIAL PRIMARY KEY,
    id_user INT,
    id_thematique INT,
    contenu_message TEXT,
    date TIMESTAMP DEFAULT NULL
);

CREATE TABLE notification (
    id_notification SERIAL PRIMARY KEY,
    id_transaction INT NOT NULL,
    id_role_permission INT NOT NULL,
    contenu TEXT NOT NULL,
    montant DECIMAL(15,2),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'envoyé'
);

CREATE TABLE partages (
    id_partage SERIAL PRIMARY KEY,
    id_publication INT NOT NULL,
    id_user INT NOT NULL,
    date_partage TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publication (
    id_publication SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    titre_publication VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    image VARCHAR(255),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publicite (
    id_pub SERIAL PRIMARY KEY,
    id_role_permission INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    descript_pub TEXT NOT NULL,
    image_pub VARCHAR(255),
    date_debut_pub DATE NOT NULL,
    date_fin_pub DATE NOT NULL,
    statuts VARCHAR(20) DEFAULT 'actif'
);

CREATE TABLE qr_code_paiement (
    id_qrcode SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    montant DECIMAL(15,2) NOT NULL,
    devise VARCHAR(10) NOT NULL,
    qr_code_data TEXT NOT NULL,
    statut_qrcode VARCHAR(20) DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_qrcode TIMESTAMP DEFAULT NULL
);

CREATE TABLE role_permission (
    id_role_permission SERIAL PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    permission TEXT NOT NULL,
    description_role TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thematiques (
    id_thematique_discussion SERIAL PRIMARY KEY,
    titre_thematique VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction (
    id_transaction SERIAL PRIMARY KEY,
    id_compte_recepteur INT NOT NULL,
    id_compte_expediteur INT NOT NULL,
    id_etablissement INT,
    id_carte_bancaire INT,
    montant DECIMAL(15,2) NOT NULL,
    statut VARCHAR(20) DEFAULT 'en attente',
    devise_transaction VARCHAR(10) NOT NULL,
    type_transaction VARCHAR(100) NOT NULL,
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utilisateur (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    pays VARCHAR(100) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_profile VARCHAR(255),
    mdp VARCHAR(255) NOT NULL,
    derniere_connexion TIMESTAMP DEFAULT NULL
);

CREATE TABLE verification_compte (
    id_verif_compte SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    email VARCHAR(191) NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL,
    date_verification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'non vérifié'
);

CREATE TABLE verification_identite (
    id_verification SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    type_verification VARCHAR(100) NOT NULL,
    statut_verification VARCHAR(20) DEFAULT 'en attente',
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP DEFAULT NULL
);


ALTER TABLE annonce
  ADD CONSTRAINT annonce_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES role_permission (id_role_permission);

ALTER TABLE carte_bancaire
  ADD CONSTRAINT carte_bancaire_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE commentaire
  ADD CONSTRAINT commentaire_ibfk_1 FOREIGN KEY (id_publication) REFERENCES publication (id_publication) ON DELETE CASCADE,
  ADD CONSTRAINT commentaire_ibfk_2 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE compte
  ADD CONSTRAINT compte_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE contacts_enregistres
  ADD CONSTRAINT contacts_enregistres_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE,
  ADD CONSTRAINT contacts_enregistres_ibfk_2 FOREIGN KEY (id_contact_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE etablissement_sante
  ADD CONSTRAINT fk_localisation FOREIGN KEY (id_localisation) REFERENCES localisation (id_localisation);

ALTER TABLE liker
  ADD CONSTRAINT liker_ibfk_1 FOREIGN KEY (id_post_liker) REFERENCES publication (id_publication) ON DELETE CASCADE,
  ADD CONSTRAINT liker_ibfk_2 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE liste_numero_etablissement_sante
  ADD CONSTRAINT fk_rolepermission_listetablissement FOREIGN KEY (id_role_permission) REFERENCES role_permission (id_role_permission);

ALTER TABLE message
  ADD CONSTRAINT message_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user),
  ADD CONSTRAINT message_ibfk_2 FOREIGN KEY (id_thematique) REFERENCES thematiques (id_thematique_discussion);

ALTER TABLE notification
  ADD CONSTRAINT notification_ibfk_1 FOREIGN KEY (id_transaction) REFERENCES transaction (id_transaction) ON DELETE CASCADE,
  ADD CONSTRAINT notification_ibfk_2 FOREIGN KEY (id_role_permission) REFERENCES role_permission (id_role_permission) ON DELETE CASCADE;

ALTER TABLE partages
  ADD CONSTRAINT partages_ibfk_1 FOREIGN KEY (id_publication) REFERENCES publication (id_publication) ON DELETE CASCADE,
  ADD CONSTRAINT partages_ibfk_2 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE publication
  ADD CONSTRAINT publication_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE publicite
  ADD CONSTRAINT publicite_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES role_permission (id_role_permission) ON DELETE CASCADE;

ALTER TABLE qr_code_paiement
  ADD CONSTRAINT qr_code_paiement_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE transaction
  ADD CONSTRAINT fk_etablissement FOREIGN KEY (id_etablissement) REFERENCES etablissement_sante (id_etablissement),
  ADD CONSTRAINT transaction_ibfk_1 FOREIGN KEY (id_compte_recepteur) REFERENCES compte (id_compte) ON DELETE CASCADE,
  ADD CONSTRAINT transaction_ibfk_2 FOREIGN KEY (id_compte_expediteur) REFERENCES compte (id_compte) ON DELETE CASCADE,
  ADD CONSTRAINT transaction_ibfk_3 FOREIGN KEY (id_carte_bancaire) REFERENCES carte_bancaire (id_carte_bancaire) ON DELETE SET NULL;

ALTER TABLE verification_compte
  ADD CONSTRAINT verification_compte_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

ALTER TABLE verification_identite
  ADD CONSTRAINT verification_identite_ibfk_1 FOREIGN KEY (id_user) REFERENCES utilisateur (id_user) ON DELETE CASCADE;

COMMIT;
