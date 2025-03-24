# CHAMPS DES TABLES A MODIFIER
    - utilisateur
        id-user (integer) = UUID

    - compte
        id_compte (integer) = UUID
        numero_compte (NOT NULL) = NULL
        statut_compte = ENUM('actif', 'bloque' ... )
        à supprimer = type_compte

    - qr_code_paiement
        à supprimer = id_user, montant, devise, date_création, qr_code_data
        à ajouter = id_compte, type_qr_code (ENUM: dynamique, statique), data_crypte, code_secret_totp, duree_qr_code

    - transaction
        id_transaction (integer) = UUID
        à supprimer = id_etablissement, id_carte_bancaire, devise_transaction
        à ajouter = code_totp_utilise, id_qr_code

# TABLES A CREER
    - code_totp
        id_totp
        id_transaction
        code_generer
        expiration_code

# les requêtes PostgreSQL pour implémenter les modifications :
*__ utilisateur*
        -- Supprimer l'ancien ID integer
            ALTER TABLE utilisateur 
            DROP COLUMN id_user;

            -- Ajouter le nouveau UUID avec contrainte PK
            ALTER TABLE utilisateur 
            ADD COLUMN id_user UUID PRIMARY KEY DEFAULT gen_random_uuid();


*__ compte*
       -- Créer le type ENUM
            CREATE TYPE statut_compte AS ENUM ('actif', 'bloque', 'suspendu', 'en_attente');

            -- Modifier l'ID et le statut
            ALTER TABLE compte 
            ALTER COLUMN id_compte TYPE UUID USING gen_random_uuid(),
            ALTER COLUMN numero_compte DROP NOT NULL,
            ADD COLUMN statut statut_compte NOT NULL DEFAULT 'actif',
            DROP COLUMN type_compte;



*__ qr_code_paiement*
        -- Créer le type ENUM
            CREATE TYPE type_qr_code AS ENUM ('dynamique', 'statique');

            -- Supprimer les colonnes
            ALTER TABLE qr_code_paiement
            DROP COLUMN id_user,
            DROP COLUMN montant,
            DROP COLUMN devise,
            DROP COLUMN date_creation,
            DROP COLUMN qr_code_data;

            -- Ajouter les nouvelles colonnes
            ALTER TABLE qr_code_paiement
            ADD COLUMN id_compte UUID REFERENCES compte(id_compte),
            ADD COLUMN type_qr_code type_qr_code NOT NULL,
            ADD COLUMN data_crypte BYTEA NOT NULL,
            ADD COLUMN code_secret_totp VARCHAR(128),
            ADD COLUMN duree_qr_code INTERVAL;


*__ transaction*
        -- Modifier l'ID et les colonnes
            ALTER TABLE transaction
            ALTER COLUMN id_transaction TYPE UUID USING gen_random_uuid(),
            DROP COLUMN id_etablissement,
            DROP COLUMN id_carte_bancaire,
            DROP COLUMN devise_transaction,
            ADD COLUMN code_totp_utilise VARCHAR(6),
            ADD COLUMN id_qr_code UUID REFERENCES qr_code_paiement(id_qr);


*__ code_totp*
        CREATE TABLE code_totp (
            id_totp UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            id_transaction UUID NOT NULL REFERENCES transaction(id_transaction),
            code_generer VARCHAR(6) NOT NULL,
            expiration_code TIMESTAMP NOT NULL
        );


*__ Contraintes supplémentaires recommandées :*
        -- Pour la table code_totp
            ALTER TABLE code_totp
            ADD CONSTRAINT unique_code_per_transaction UNIQUE (id_transaction, code_generer);

            -- Index sur l'expiration
            CREATE INDEX idx_code_totp_expiration ON code_totp(expiration_code);


 
# Notes importantes :
    extension pgcrypto pour les criptage sécurisés

        CREATE EXTENSION IF NOT EXISTS pgcrypto;
