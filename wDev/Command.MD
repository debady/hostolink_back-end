#                        COMMANDE A EXECUTER DANS LES TERMINALES

CONNEXION A LA BD SUPABASE
    psql "postgresql://postgres.skwupmsitzsxukbmnkwv:mdp_dev_sohapigroup@aws-0-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require"

Exporter  
    pg_dump -U postgres -d hostolink_bd -F p -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\base_donnees\hostolink_bd.sql"
    
Importer 
    psql -U postgres -d hostolink_bd -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\base_donnees\hostolink-dev1.sql"

EXPORTER LA BD
    pg_dump -U postgres hostolink_bd > C:/Users/NGUESSAN.DESKTOP-38E6PIP/Desktop/SohapiGroup/hostolink_back-end/bd/hostolink_bd.sql

UPLO9ADER UNE IMAGE SUR CLOUDINARY

    curl -X POST "https://api.cloudinary.com/v1_1/dhrrk7vsd/image/upload" -F "file=@C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\src\images\imgtes.PNG" -F "upload_preset=hostolink_preset"

INSTALLER DEPENDANCE CLOUDINARY
    npm install @nestjs/platform-express multer multer-storage-cloudinary cloudinary uuid

INSTALLATION CERTIFICAT SUPABASE
    curl -o supabase-ca.pem https://curl.se/ca/cacert.pem

VERIF TABLE DE LA BD supabase
    curl -X GET "https://skwupmsitzsxukbmnkwv.supabase.co/rest/v1/" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3VwbXNpdHpzeHVrYm1ua3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDQ1NzksImV4cCI6MjA1NjU4MDU3OX0.6WDc8hTaer5058Q5RZv4jAdGeJqTwyiLKtnVyXf_a68"

TEST API supabase
    curl -X GET "https://skwupmsitzsxukbmnkwv.supabase.co/rest/v1/" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3VwbXNpdHpzeHVrYm1ua3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDQ1NzksImV4cCI6MjA1NjU4MDU3OX0.6WDc8hTaer5058Q5RZv4jAdGeJqTwyiLKtnVyXf_a68" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3VwbXNpdHpzeHVrYm1ua3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDQ1NzksImV4cCI6MjA1NjU4MDU3OX0.6WDc8hTaer5058Q5RZv4jAdGeJqTwyiLKtnVyXf_a68"


INSTALLER LES DEPENDANCES ET REBUILDER (supprimer dist)
    npm run build
    npm run buildù

Installer geojson
    npm install geojson
    npm install --save-dev @types/geojson

CONNEXION A LA BD supababse 
    pg_dump -U postgres.skwupmsitzsxukbmnkwv -h aws-0-eu-west-3.pooler.supabase.com -d postgres -f hostolink_bd_supabase.sql

EXPORTER LA BD supababse
    pg_dump -U postgres.skwupmsitzsxukbmnkwv -h aws-0-eu-west-3.pooler.supabase.com -d postgres -f hostolink_bd_supabase.sql


*------------------------------NOTE POUR CREER UNE BASE DE DONNEE POSTGRESQL VIA DOCKER-----------------------------*

Créer une base de données PostgreSQL dans un conteneur Docker est un excellent choix ! Voici les étapes de base pour y parvenir :

*-------------- Télécharger l'image PostgreSQL
    Exécutez la commande suivante pour récupérer l'image officielle de PostgreSQL depuis Docker Hub :
                      docker pull postgres


*-------------- Créer et exécuter un conteneur PostgreSQL
    Lancez un conteneur PostgreSQL en spécifiant un mot de passe pour l'utilisateur postgres :
                            docker run --name nom_de_votre_conteneur -e POSTGRES_PASSWORD=mot_de_passe -d nom_de_votre_bd

*-------------- Se connecter au conteneur
    Vous pouvez accéder au conteneur en exécutant cette commande :
                            docker exec -it nom_de_votre_conteneur bash
    Une fois à l'intérieur du conteneur, vous pouvez accéder à PostgreSQL :
                            psql -U postgres

*-------------- Créer une base de données
    Une fois connecté à PostgreSQL, créez une base de données avec une commande SQL :
                            CREATE DATABASE nom_de_la_base;

Cela devrait vous permettre de configurer et d'utiliser une base PostgreSQL dans votre conteneur Docker. Si vous avez des questions ou rencontrez un problème, je suis là pour vous aider !


*------------------------------NOTE POUR IMPORTER UNE BASE DE DONNEE POSTGRESQL AVEC INSTALLATION DE POSTGIS VIA DOCKER-----------------------------*

    Pour importer une base de données avec PostGIS dans un conteneur Docker, vous pouvez suivre ces étapes :

*------------------------------NOTE POUR LA GEOLOCALISATION -----------------------------*

TELECHARGER POSTGIS 
    https://ftp.postgresql.org/pub/postgis/pg17/v3.5.0/win64/postgis-bundle-pg17x64-setup-3.5.0-2.exe

    executer
    choix  version 
    coche postgis (avant dernière dans la liste)
    executer puis 
    connexion a la bd
    taper la commande d'extension postgis
        > CREATE EXTENSION postgis;
        
    Activer Toutes les Fonctionnalités PostGIS (Optionnel)
        Si tu veux aussi ajouter toutes les fonctionnalités supplémentaires de PostGIS, exécute :
            CREATE EXTENSION postgis_topology; 
            CREATE EXTENSION postgis_raster;
            CREATE EXTENSION postgis_sfcgal; -- Pour la 3D


*-  ------------------NOTE DE LA REVISION BD LOCALE---------------------*
Clé primaire sur id_user dans utilisateur utilisateur_pkey référencées par d'autres tables

    fk_compte_utilisateur (table compte)
    fk_cartes_bancaires_utilisateur (table cartes_bancaires)
    fk_code_verif_otp_utilisateur (table code_verif_otp)
    fk_contacts_hostolink_utilisateur (table contacts_hostolink)
    fk_contacts_hostolink_contact (table contacts_hostolink)
    fk_notification_transaction_utilisateur (table notification_transaction)
    fk_qr_code_paiement_utilisateur (table qr_code_paiement_dynamique)
    fk_historique_transactions_utilisateur (table historique_transactions)
    fk_cartes_qr_code_statique_utilisateur (table cartes_qr_code_statique)
    fk_discussion_assistant_client_utilisateur (table discussion_assistant_client)
    fk_message_assistant_client_utilisateur (table message_assistant_client)
    fk_message_reseau_social_utilisateur (table message_reseau_social)
    fk_partage_appli_utilisateur (table partage_appli)
    fk_publication_utilisateur (table publication)
    fk_reclamations_utilisateur (table reclamations)
    fk_verification_kyc_utilisateur (table verification_kyc)
    fk_cartes_physiques_utilisateur (table cartes_physiques)



------------------------------- NOTE SECURITE ET CRYPTAGE --------------------

 
# Notes importantes :
    extension pgcrypto pour les criptage sécurisés

        CREATE EXTENSION IF NOT EXISTS pgcrypto;


SUPPRIMER TOUTES LES ADMIN DE LA BD
    TRUNCATE TABLE administrateurs CASCADE;

SUPPRIMER LA CONTRAINT D'ENUM DE role 
    ALTER TABLE administrateurs ALTER COLUMN role TYPE VARCHAR(50);
    
DROP TYPE IF EXISTS role_admin_enum;

<<<<<<< HEAD:Command.MD


------------------------------- MODULE QR CODE --------------------

# Tables modifiés :

    Table compte :

           Column            |            Type             | Collation | Nullable |                  Default
-----------------------------+-----------------------------+-----------+----------+-------------------------------------------
 id_compte                   | integer                     |           | not null | nextval('compte_id_compte_seq'::regclass)
 solde_compte                | integer                     |           |          | 0
 solde_bonus                 | integer                     |           |          | 0
 cumule_mensuel              | integer                     |           |          | 0
 plafond                     | integer                     |           |          | 100000
 mode_paiement_preferentiel  | character varying(50)       |           |          |
 type_user                   | character varying(20)       |           | not null |
 devise                      | character varying(10)       |           | not null | 'XOF'::character varying
 numero_compte               | character varying(50)       |           |          |
 date_creation_compte        | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 date_modification           | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 id_user                     | uuid                        |           |          |
 id_user_etablissement_sante | integer                     |           |          |
Indexes:
    "compte_pkey" PRIMARY KEY, btree (id_compte)
    "compte_numero_compte_key" UNIQUE CONSTRAINT, btree (numero_compte)
Check constraints:
    "compte_type_user_check" CHECK (type_user::text = ANY (ARRAY['utilisateur'::character varying::text, 'etablissement'::character varying::text]))
Foreign-key constraints:
    "fk_compte_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_compte_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
Referenced by:
    TABLE "cartes_bancaires" CONSTRAINT "fk_cartes_bancaires_compte" FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_externe" CONSTRAINT "fk_transaction_externe_compte" FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_interne" CONSTRAINT "fk_transaction_interne_expediteur" FOREIGN KEY (id_compte_expediteur) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_interne" CONSTRAINT "fk_transaction_interne_recepteur" FOREIGN KEY (id_compte_recepteur) REFERENCES compte(id_compte) ON DELETE CASCADE


     Table qr_code_paiement_dynamique :

           Column            |            Type             | Collation | Nullable |                       Default       
-----------------------------+-----------------------------+-----------+----------+-----------------------------------------------------
 id_qrcode                   | integer                     |           | not null | nextval('qr_code_paiement_id_qrcode_seq'::regclass)
 qr_code_valeur              | text                        |           |          |
 date_creation               | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 date_expiration             | timestamp without time zone |           | not null |
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 token                       | character varying(1000)     |           |          | NULL::character varying
 id_user_etablissement_sante | integer                     |           |          |
 id_user                     | uuid                        |           |          |
Indexes:
    "qr_code_paiement_pkey" PRIMARY KEY, btree (id_qrcode)
Foreign-key constraints:
    "fk_qr_code_dynamique_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
    "fk_qr_code_paiement_dynamique_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_qr_code_paiement_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE


    Table qr_code_paiement_statique :

           Column            |            Type             | Collation | Nullable |                           Default   
-----------------------------+-----------------------------+-----------+----------+--------------------------------------------------------------
 id_qrcode                   | integer                     |           | not null | nextval('qr_code_paiement_statique_id_qrcode_seq'::regclass)
 qr_code_data                | text                        |           |          |
 date_creation               | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 id_user_etablissement_sante | integer                     |           |          |
 id_user                     | uuid                        |           |          |
 date_expiration             | timestamp without time zone |           |          |
 token                       | character varying(1000)     |           |          |
Indexes:
    "qr_code_paiement_statique_pkey" PRIMARY KEY, btree (id_qrcode)
Foreign-key constraints:
    "fk_qr_code_paiement_statique_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_qr_code_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
=======
DECOMMIT UN FICHIER SUIVI PAR GIT
    placer son nom dans .gitignore
    git rm --cached .env
    git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
    git push origin --force --all


VOIR L'ETAT DES CES PROJET GOOGLE CLOUD
    https://console.cloud.google.com/iam-admin/projects
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d:wDev/Command.MD
