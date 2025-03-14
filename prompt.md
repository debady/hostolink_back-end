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

    hebergeur d'images : cloudinary
    hebergeur bd : supabase
    hebergeur back-end : render



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

    
    --------------------.env fonctionnelle -------------------------------------
    # # ⚙️ Configuration de PostgreSQL
    # DB_HOST=localhost
    # DB_PORT=5432
    # DB_USER=dev_sohapigroup
    # DB_PASSWORD=mdp_dev_sohapigroup
    # DB_NAME=hostolink_bd

    # # Clé secrète pour JWT
    # JWT_SECRET=MY_SECRET_KEY


    ---------------------------------------------------------

API Secret 
        HEEz2vCv7MyxBRjCZScbXeUKgEw

API KEY 
        197881586145143

API environment variable 
        CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dhrrk7vsd



----------SUPABASE--------------

*prompt*
    J'ai développé mon application flutter base de données postgres et back-end netjs comment héberger pour tester en attendant Je suis sur Windows je sais que je peux utilisé supabase donc montre explique tout


projet name = hostolink
mdp : mdp_dev_sohapigroup



Session pooler Supavisor
------------------------------------------------------
Url
    postgresql://postgres.skwupmsitzsxukbmnkwv:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres

host:
    aws-0-eu-west-3.pooler.supabase.com

port:
    5432

database:
    postgres

user:
    postgres

