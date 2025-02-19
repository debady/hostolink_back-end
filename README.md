#                   INITIATION DU PROJET NETJS

# Hostolink Backend

Bienvenue dans le backend de **Hostolink**, une API construite avec **NestJS**, **PostgreSQL**, et **Docker** pour gérer les fonctionnalités de paiement et d'épargne pour les soins de santé.

## 🚀 Fonctionnalités principales
- Gestion des utilisateurs (authentification, rôles, permissions)
- Transactions financières (dépôt, retrait, transfert)
- Intégration avec des services de paiement (Wave, PayPal, etc.)
- Géolocalisation des établissements de santé
- Notifications en temps réel avec Firebase
- Sécurité renforcée (JWT, bcrypt, validation des requêtes)

---

## 📦 Prérequis
Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18+)
- [NestJS CLI](https://docs.nestjs.com/) (`npm install -g @nestjs/cli`)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (optionnel, mais recommandé)

---

## ⚙️ Installation
Clonez le projet et installez les dépendances :

```sh
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/hostolink-backend.git
cd hostolink-backend

# Installer les dépendances
npm install
```

---

## 🛠️ Configuration
Avant de démarrer l'API, configurez l'environnement :

1. **Dupliquez** le fichier `.env.example` et renommez-le `.env`
2. **Modifiez** les variables selon votre environnement :

```env
PORT=3000
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/hostolink_bd
JWT_SECRET=secret_jwt
FIREBASE_API_KEY=xxx
```

---

## 🏗️ Démarrer le serveur

### 🔹 Mode développement
```sh
npm run start:dev
```
L'API sera accessible sur `http://localhost:3000`

### 🔹 Mode production
```sh
npm run build
npm run start:prod
```

---

## 🛠️ Utilisation avec Docker
Si vous utilisez **Docker**, vous pouvez lancer le projet sans installer PostgreSQL localement :

```sh
# Démarrer PostgreSQL via Docker
docker-compose up -d
```

---

## 📡 Documentation API
Une documentation **Swagger** est disponible après le démarrage du serveur :

Accédez à : [http://localhost:3000/api](http://localhost:3000/api)

---

## 🔍 Structure du projet
```
📂 src/
 ├── auth/            # Gestion de l'authentification (JWT, rôles)
 ├── users/           # Gestion des utilisateurs
 ├── transactions/    # Gestion des paiements et transferts
 ├── establishments/  # Géolocalisation des établissements de santé
 ├── notifications/   # Notifications en temps réel (Firebase)
 ├── app.module.ts    # Module principal
 ├── main.ts          # Point d'entrée de l'application
```

---

## 🧪 Tests
Exécutez les tests unitaires avec :
```sh
npm run test
```

Ou les tests e2e :
```sh
npm run test:e2e
```

---

## 📌 Contribution
Les contributions sont les bienvenues ! Clonez le repo, créez une branche et proposez vos modifications via une pull request.

---

## 📜 Licence
Ce projet est sous licence **MIT**. Consultez le fichier `LICENSE` pour plus de détails.

---

## 📞 Contact
Si vous avez des questions, contactez-nous à **contact@hostolink.com** ou ouvrez une issue sur GitHub.

---

🚀 **Développé avec ❤️ par l'équipe Hostolink** https://chatgpt.com/canvas/shared/67b24cad23d081918af94c0c51613f51
        
        

#                          CONFIGURATION DE BASE

        Télécharger postgres sur 
            > https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

        Installer en s'assurant d'avoir cocher
            ✅ PostgreSQL Server
            ✅ pgAdmin 4
            ✅ Command Line Tools (Important !)
            ✅ Stack Builder
            Définis un mot de passe pour l’utilisateur postgres (NGUESSAN)
            Choisis le port par défaut (5432) (ne change pas sauf si nécessaire)
            Termine l’installation et redémarre le PC

        - toucher Win > taper variable d'environnement > sous variale systeme > path > modifier > nouveau > coller > C:\Program Files\PostgreSQL\17\bin

        - Dans l'zxplorateur de fichier naviguer vers 
            >C:\Program Files\PostgreSQL\17\data

            ouvrir pg_hba.conf dans un éditeur puis rajouter 
            >host    all             all             127.0.0.1/32            scram-sha-256
        
        - Ouvir le cmd et taper
            > psql -U postgres
            entrer le mdp , rendu postgres=#

        - Lister les bd 
            > \l 
        
        - Lister les utilisateur 
            > \du

        -Créer un utilisateur 
            >CREATE USER dev_sohapigroup WITH PASSWORD 'mdp_devç_sohapigroup';

        -Donner tous les autorisations 
            > ALTER USER dev_sohapigroup WITH SUPERUSER CREATEDB CREATEROLE;

        -Se connecter avec  
            > psql -U dev_sohapigroup -d postgres
            mdp
        
        -Créer la base de données
            >createdb -U postgres hostolink_bd

        -Importer la base de données en fichiers sql (sauvagarde custom (.dump ou .backup).)
            > pg_restore -U postgres -d hostolink_bd "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\bd\hostolink_bd.sql"

        - Se connecter 
            > psql -U postgres -d hostolink_bd
        
        - Lister les tables 
            > \dt


*-                  CONNECTER CETTE BD AU BACK-END(netjs) ET AU FRONT-END(flutter)*

        - Ouvrir le projet back-end dans un éditeur 
            dans le fichier C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\src\app.module.ts

            mettre le nom de l'utilisateur 
            son mdp 
            le nom de la base de donnée
        
        -Créer un dossier pour une entité donné (user)
            préciser les champs leur types et restriction
        
        -Créer les services et controller (a documenté)
        -ouvrir un cmd et taper 
            > npm run start

            s'il y'a des erreurs d'installation, les installés  et reprendre la commande

        - Ouvrir son navigateur puis taper
            > http://localhost:3000/users

            afficher tous les données dans la table utilisateurs

        -  Ouvrir le projet  fron-end , flutter dans un éditeur (VsCode)

        -Créer un fichier qui servira d'api dans le dossier services

        -installer la dependance htpp
        pour communiquer avec le back-end

        - mettre le code de connexion au back-end
            Importer de cette dependance
            présiser l'URL de l'API
            préciser le mot clé de l'entité dans le back-end genre comme route en laravel
            recuper les utilisateur prévoir le cas d'erreur et mettre 
            préciser les champs à remplir , url , le type de donnée json et les valeurs 

        - Créer un fichiers pour afficher et inserer des données 
        - mettre sa classe dans le fichiers routes ou directement dans main.dart

        -faire 
            > flutter clean 
            > flutter pub get 
            > flutter run (Chrome)


#                       TEST DES ENPOINT AVEC POSTMAN

        - Installer et se connecter à son compte 
        -inviter les collab
        - créer une colection 
            > POST 
            > URL http://localhost:3000/users
            >Header : Key: Content-Type Value: application/json
            > Body cocher row 
                {
                    "nom": "nouvelle",
                    "prenom": "donnee ",
                    "email": "nouvelldonne@gmail.com",
                    "telephone": "07089100",
                    "pays": "Côte d'ivoire"
                    }
            > Send 

        - Pour récuperer tous 
            > GET 
            > URL http://localhost:3000/users
            > send



*------------------------------------*
PROJET NAME hostolink_bd
MDP SUPABASE mdp_dev_sohapigroup
pays france 

public eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcm9vd3VrZWR6ZnN4b2Nrd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTEwNTcsImV4cCI6MjA1NTM4NzA1N30.3OqLcL5E_Lg17sMxtoRFwyg7F14VwLBuXiAoi_B_RNo

projet url https://ocroowukedzfsxockwjf.supabase.co
API Key eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcm9vd3VrZWR6ZnN4b2Nrd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTEwNTcsImV4cCI6MjA1NTM4NzA1N30.3OqLcL5E_Lg17sMxtoRFwyg7F14VwLBuXiAoi_B_RNo


Javascript
Dart
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocroowukedzfsxockwjf.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



Project name
hostolink_bd
Project ID
ocroowukedzfsxockwjf

Copy



* pour la connexion en local*
cmd                   : npm run start:dev
postman | naviagteur :http://localhost:3000/auth/check-user


POUR AFFICHER QUE LE SERVER TOURNE BIEN : http://localhost:3000/auth/

AFFICHER TOUT LES USERS ajouter get dans postman et navigateur : http://localhost:3000/auth/users
