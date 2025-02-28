- je developpe une application flutter de payement  inluant un reseau sociale , un systeme de géolocalisation des  établissement de santé , 
    de discution sur des thématique , de listing des etablissement de santé et numero d'urgence avec 
    leur information puis on peut cliquer sur leur numero et etre rediriger sur l'application d'appel , 
    incluant une carte bancaire, son qr code lui permet de recevoir de l'argent et en le scannant par la même application , 
    deposer et retirer de l'argent de l'application a travers les operateur mobile ivoirienne ainsi que wave, banque, 
    djamo; le principe de l'application est quel'utilisateur a le choix de saisir son numéro ou son adresse email 
    et quand il saisir , si ces coordonnée n'existe pas dans la base de données postgres alors on insert dans 
    la bd puis on lui demande definir un mot de passe puis de le taper a noueau si les deux mot de passe correspond 
    alors on insert dans la bd puis il a accès au dashord pour la suite voici la base de donnée en question j'aimerais 
    que tu merise car nous allons l'utilser tout au long du projet 

    front-end : Flutter 
    back-end : postgres 
    back-end : netjs 
    environnement de test avant de l'introduit dans le flutter déjà développer :postman

- Structure de Votre Projet Backend
    Répertoire Principal
    .env : Fichier de configuration pour les variables d'environnement (comme les clés API, les informations de connexion à la base de données, etc.).

    .gitignore : Fichier pour ignorer certains fichiers/dossiers dans Git (ex: node_modules, .env).

    .prettierrc : Fichier de configuration pour Prettier (formatage du code).

    bd : Dossier contenant probablement des scripts ou des fichiers liés à la base de données (ex: migrations, scripts SQL).

    dist : Dossier généré contenant le code JavaScript compilé à partir de TypeScript.

    eslint.config.mjs : Fichier de configuration pour ESLint (linter pour JavaScript/TypeScript).

    nest-cli.json : Fichier de configuration pour NestJS CLI.

    node_modules : Dossier contenant les dépendances du projet (installées via npm ou yarn).

    package-lock.json : Fichier verrouillant les versions des dépendances installées.

    package.json : Fichier contenant les métadonnées du projet et les dépendances.

    prompt.txt : Fichier texte contenant probablement des informations ou des instructions.

    README.md : Fichier de documentation du projet.

    src : Dossier principal contenant le code source du backend.

    test : Dossier contenant les tests unitaires ou d'intégration.

    tsconfig.build.json : Fichier de configuration TypeScript pour la compilation.

    tsconfig.json : Fichier de configuration TypeScript principal.

    Dossier src (Code Source)
    Le dossier src est le cœur de votre application. Voici ce que j'attends généralement dans un projet NestJS :

    main.ts : Point d'entrée de l'application.

    app.module.ts : Module principal de l'application.

    entities/ : Contient les entités TypeORM (ex: User, Otp).

    controllers/ : Contient les contrôleurs pour gérer les routes (ex: user.controller.ts).

    services/ : Contient la logique métier (ex: user.service.ts, otp.service.ts).

    dto/ : Contient les Data Transfer Objects (DTO) pour valider les données entrantes.

    interfaces/ : Contient les interfaces TypeScript.

    repositories/ : Contient les repositories TypeORM (si utilisés).

    migrations/ : Contient les scripts de migration de la base de données.

    Problèmes Actuels
    À partir de ce que vous avez partagé, voici les problèmes que vous pourriez rencontrer :

    Erreurs de Dépendances :

    Problèmes liés à l'importation de modules (ex: OtpModule dans UserModule).

    Erreurs comme UnknownDependenciesException.

    Problèmes de TypeORM :

    Migrations non fonctionnelles.

    Relations mal configurées entre les entités (ex: User et Otp).

    Problèmes de Validation des OTP :

    La méthode verifyOtp() n'est pas reconnue ou ne fonctionne pas correctement.

    Problèmes de génération ou d'envoi d'OTP.

    Problèmes de Sécurité :

    Stockage des mots de passe ou des OTPs de manière non sécurisée.

    Absence de validation des données entrantes.

    Prochaines Étapes
    Analyse du Code :

    Partagez le contenu des fichiers clés (ex: user.controller.ts, otp.service.ts, user.entity.ts, otp.entity.ts, etc.).

    Cela me permettra de mieux comprendre votre implémentation et de corriger les erreurs.

    Correction des Problèmes :

    Je vais vous aider à résoudre les erreurs de dépendances, de TypeORM et de logique OTP.

    Je vais également vérifier la sécurité de votre application.

    Optimisation :

    Amélioration de la structure du code.

    Ajout de tests unitaires ou d'intégration.


Récapitulatif complet de ce que tu voulais faire et des étapes parcourues :
    🔹 Objectif initial
    Tu voulais implémenter un système de connexion sécurisé avec OTP dans ton backend Nest.js. Ce système devait permettre à un utilisateur de :

    saisir soit  un email ou un numéro de téléphone. 
    s'il n'existe pas alors il est nouveau alors on l'insert puis on passe a la suite 
    Définir un mot de passe après l’inscription.
    Recevoir un OTP pour valider certaines actions (connexion, réinitialisation, etc.).
    Vérifier l’OTP saisi par l’utilisateur.
    Utiliser PostgreSQL pour stocker les utilisateurs et les OTPs.
    🔹 Ce qui existait déjà dans ton projet
    ✔ Backend Nest.js fonctionnel avec des routes pour la gestion des utilisateurs.
    ✔ Connexion à PostgreSQL via TypeORM.
    ✔ Endpoints existants :

    check-user → Vérifie si un utilisateur existe.
    register-user → Inscrit un utilisateur sans mot de passe.
    define-password → Permet à l’utilisateur de définir un mot de passe.
    verify-pin → Vérifie un PIN de connexion.
    verify-code → Vérifie un ancien système d’OTP lié aux utilisateurs.


- la base de donnéee
    hostolink_bd=# \dt
                        Liste des relations
    SchÚma |               Nom                | Type  | PropriÚtaire
    --------+----------------------------------+-------+--------------
    public | annonce                          | table | postgres
    public | carte_bancaire                   | table | postgres
    public | commentaire                      | table | postgres
    public | compte                           | table | postgres
    public | contacts_enregistres             | table | postgres
    public | etablissement_sante              | table | postgres
    public | liker                            | table | postgres
    public | liste_numero_etablissement_sante | table | postgres
    public | localisation                     | table | postgres
    public | message                          | table | postgres
    public | migrations                       | table | postgres
    public | notification                     | table | postgres
    public | partages                         | table | postgres
    public | publication                      | table | postgres
    public | publicite                        | table | postgres
    public | qr_code_paiement                 | table | postgres
    public | role_permission                  | table | postgres
    public | thematiques                      | table | postgres
    public | transaction                      | table | postgres
    public | utilisateur                      | table | postgres
    public | verification_compte              | table | postgres
    public | verification_identite            | table | postgres
    (22 lignes)


    hostolink_bd=# \d utilisateur
                                                    Table ½ public.utilisateur ╗
        Colonne      |            Type             | Collationnement | NULL-able |                  Par dÚfaut
    -------------------+-----------------------------+-----------------+-----------+----------------------------------------------
    id_user           | integer                     |                 | not null  | nextval('utilisateur_id_user_seq'::regclass)
    nom               | character varying           |                 |           |
    prenom            | character varying           |                 |           |
    email             | character varying           |                 |           |
    telephone         | character varying           |                 |           |
    pays              | character varying           |                 |           |
    photo_profile     | character varying           |                 |           |
    mdp               | character varying           |                 |           |
    date_inscription  | timestamp without time zone |                 |           | CURRENT_TIMESTAMP
    code_confirmation | character varying(10)       |                 |           |
    Index :
        "utilisateur_pkey" PRIMARY KEY, btree (id_user)
        "UQ_80273015241cbddf8152908bd5b" UNIQUE CONSTRAINT, btree (telephone)
        "UQ_e1136325a6b28e2a02b81b2f5e1" UNIQUE CONSTRAINT, btree (email)
    RÚfÚrencÚ par :
        TABLE "carte_bancaire" CONSTRAINT "carte_bancaire_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "commentaire" CONSTRAINT "commentaire_ibfk_2" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "compte" CONSTRAINT "compte_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "contacts_enregistres" CONSTRAINT "contacts_enregistres_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "contacts_enregistres" CONSTRAINT "contacts_enregistres_ibfk_2" FOREIGN KEY (id_contact_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "liker" CONSTRAINT "liker_ibfk_2" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "message" CONSTRAINT "message_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user)
        TABLE "partages" CONSTRAINT "partages_ibfk_2" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "publication" CONSTRAINT "publication_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "qr_code_paiement" CONSTRAINT "qr_code_paiement_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "verification_compte" CONSTRAINT "verification_compte_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
        TABLE "verification_identite" CONSTRAINT "verification_identite_ibfk_1" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE


hostolink_bd=# \d otp
                                            Table ½ public.otp ╗
    Colonne   |            Type             | Collationnement | NULL-able |           Par dÚfaut
    ------------+-----------------------------+-----------------+-----------+---------------------------------
    id         | integer                     |                 | not null  | nextval('otp_id_seq'::regclass)
    user_id    | integer                     |                 | not null  |
    otp_code   | character varying(6)        |                 | not null  |
    expires_at | timestamp without time zone |                 | not null  |
    is_valid   | boolean                     |                 |           | true
    Index :
        "otp_pkey" PRIMARY KEY, btree (id)
    Contraintes de clÚs ÚtrangÞres :
        "fk_otp_user" FOREIGN KEY (user_id) REFERENCES utilisateur(id_user) ON DELETE CASCADE



les Endpoints 

    ok - 1- MISSION : Vérifier si un utilisateur existe
    Méthode : POST
    URL : http://localhost:3000/api/check-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
    ok - 2- MISSION : Enregistrer un utilisateur (Sans mot de passe)
    Méthode : POST
    URL : http://localhost:3000/api/register-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
    ok - 3-MISSION : Définir un mot de passe après inscription
    Méthode : POST
    URL :http://localhost:3000/api/define-password
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "password": "MonMotDePasse123"
        }

    ok - 4-MISSION : Générer un OTP
    Méthode : POST
    URL : http://localhost:3000/api/generate-otp
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }


    ok - 5-MISSION :  Vérifier un OTP
    Méthode : POST
    URL : http://localhost:3000/api/verify-otp
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }



    ok - 6-MISSION :   Vérifier le PIN (mot de passe)
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }
    
    ok -7-MISSION :Récupérer tous les utilisateurs (Test Admin uniquement)
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }

    
    