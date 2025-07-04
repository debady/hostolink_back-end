ALTER TABLE user_etablissement_sante 
ADD COLUMN fcm_token character varying(255) DEFAULT NULL;

-- Optionnel : pour gérer les tokens inactifs
ALTER TABLE user_etablissement_sante 
ADD COLUMN derniere_connexion timestamp without time zone DEFAULT now();


-- Pour gérer les tokens inactifs
ALTER TABLE utilisateur 
ADD COLUMN derniere_connexion timestamp without time zone DEFAULT now();

-- Pour les préférences de notification
ALTER TABLE utilisateur 
ADD COLUMN notification_preferences jsonb DEFAULT '{"transaction": true, "securite": true, "marketing": false}';