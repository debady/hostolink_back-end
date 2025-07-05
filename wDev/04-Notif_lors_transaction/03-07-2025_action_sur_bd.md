# POUR NOTIFIER L'ETABLISSEMENT DE SANTE QUAND IL RECOIS UN PAYEMENT 

ALTER TABLE user_etablissement_sante 
ADD COLUMN fcm_token character varying(255) DEFAULT NULL;

ALTER TABLE user_etablissement_sante 
ADD COLUMN derniere_connexion timestamp without time zone DEFAULT now();


ALTER TABLE utilisateur 
ADD COLUMN derniere_connexion timestamp without time zone DEFAULT now();

ALTER TABLE utilisateur 
ADD COLUMN notification_preferences jsonb DEFAULT '{"transaction": true, "securite": true, "marketing": false}';