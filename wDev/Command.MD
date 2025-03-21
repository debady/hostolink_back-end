#                        COMMANDE A EXECUTER DANS LES TERMINALES

CONNEXION A LA BD SUPABASE
    (a revoir)

Exporter bd locale 
    pg_dump -U postgres -d hostolink_bd -F p -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\base_donnees\hostolink_bd.sql"
    
Importer locale
    psql -U postgres -d hostolink_bd -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\base_donnees\hostolink-dev1.sql"


UPLO9ADER UNE IMAGE SUR CLOUDINARY

    curl -X POST "https://api.cloudinary.com/v1_1/dhrrk7vsd/image/upload" -F "file=@C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\wDev\prompt.md" -F "upload_preset=hostolink_preset"

    images grouper 
        https://collection.cloudinary.com/dhrrk7vsd/387f34fb0827d86134e0d6d720f22e23
    

INSTALLER DEPENDANCE CLOUDINARY
    npm install @nestjs/platform-express multer multer-storage-cloudinary cloudinary uuid

INSTALLATION CERTIFICAT SUPABASE
    curl -o supabase-ca.pem https://curl.se/ca/cacert.pem

VERIF TABLE DE LA BD supabase
    (a faire)

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


------------------------- NOTE SECURITE ET CRYPTAGE --------------------

 
# Notes importantes :
    extension pgcrypto pour les criptage sécurisés

        CREATE EXTENSION IF NOT EXISTS pgcrypto;


SUPPRIMER TOUTES LES ADMIN DE LA BD
    TRUNCATE TABLE administrateurs CASCADE;

SUPPRIMER LA CONTRAINT D'ENUM DE role 
    ALTER TABLE administrateurs ALTER COLUMN role TYPE VARCHAR(50);
    
DROP TYPE IF EXISTS role_admin_enum;

DECOMMITER UN FICHIER SUIVI PAR GIT
    placer son nom dans .gitignore
    git rm --cached .env
    git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
    git push origin --force --all

------------GOOGLE CLOUD ---------------

VOIR L'ETAT DES CES PROJET GOOGLE CLOUD
    https://console.cloud.google.com/iam-admin/projects


---- ENVOI SMS PAR https://account.africastalking.com/ ------

    - atsk_9cb676c636c08f6cad76b4f83d16c7abc61ed8b542f3a7aa43ea08394b7d7444e736c91d 
    - Mb4rrL17e

-------------ENVOI SMS PAR https://dashboard.nexmo.com/ ------------

COMMANDE TEST API https://dashboard.nexmo.com/ 
    curl -X POST "https://rest.nexmo.com/sms/json" -d "api_key=607d95e2" -d "api_secret=2yxhopCqAC9LSxYE" -d "to=+2250502556104" -d "from=Vonage" -d "text=Test OTP de HostoLink"



------------- NOTE ENVOI OTP SMTP -------------
    npm install nodemailer axios
    npm install nodemailer
    node test_email.js



------------ NOTE NOTIFICATION PUSH FIREBASE ------------

CREER UNE CLE PRIVE,TELECHARGER ,RENOME ,PLACER DANS 
    /config
    ajouter FIREBASE_CREDENTIALS=config/firebase-admin-sdk.json dans .env

INSTALLER LA DEPENDANCE POUR ENVOI 
    npm install firebase-admin

CREER firebase.service.ts DANS config/ 
    et ajouter son code
    on ajouter son module dans app.module
    lancer le server 

------------------- SMS NOTE NONAGE --------------

CREER SON COMPTE 
VERIFIER PAR WHATSAPP 
RECUP API CLE ET ID 
INSTALLER LA DPCE 
    npm install @vonage/server-sdk

AJOUTER CES VR DS l'ENVIRON 

