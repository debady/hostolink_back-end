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

DECOMMIT UN FICHIER SUIVI PAR GIT
    placer son nom dans .gitignore
    git rm --cached .env
    git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
    git push origin --force --all


VOIR L'ETAT DES CES PROJET GOOGLE CLOUD
    https://console.cloud.google.com/iam-admin/projects



    ---- https://account.africastalking.com/ ---

    atsk_9cb676c636c08f6cad76b4f83d16c7abc61ed8b542f3a7aa43ea08394b7d7444e736c91d

Mb4rrL17e



COMMANDE TEST API https://dashboard.nexmo.com/ 
    curl -X POST "https://rest.nexmo.com/sms/json" -d "api_key=607d95e2" -d "api_secret=2yxhopCqAC9LSxYE" -d "to=+2250502556104" -d "from=Vonage" -d "text=Test OTP de HostoLink"
