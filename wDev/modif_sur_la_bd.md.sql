--la table code_verif_otp
  DROP TYPE IF EXISTS moyen_envoi_enum CASCADE;
    
-- ajouter le champs moyen_envoyer
  ALTER TABLE code_verif_otp ADD COLUMN moyen_envoyer VARCHAR;


-- ajout de la table raison_suppression_compte
  DROP TABLE IF EXISTS raison_suppression_compte CASCADE;
  CREATE TABLE raison_suppression_compte (
    id SERIAL PRIMARY KEY,
    raison TEXT NOT NULL,
    date_suppression TIMESTAMP DEFAULT now(),
    id_user_etablissement_sante INTEGER,
    CONSTRAINT fk_etab FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
  );


-- 1. Supprimer l'ancienne contrainte avec ON DELETE CASCADE
  ALTER TABLE raison_suppression_compte DROP CONSTRAINT fk_etab;

-- 2. Recréer la contrainte SANS ON DELETE CASCADE
  ALTER TABLE raison_suppression_compte
  ADD CONSTRAINT fk_etab
  FOREIGN KEY (id_user_etablissement_sante)
  REFERENCES user_etablissement_sante(id_user_etablissement_sante);

-- supprimer la contrainte sur transaction interne
  ALTER TABLE transaction_interne
  DROP CONSTRAINT fk_transaction_interne_transactions_frais;

--ajout de la collone de verif (A DEVELOPPER)
  ALTER TABLE user_etablissement_sante
  ADD COLUMN compte_verifie BOOLEAN DEFAULT true;

  UPDATE user_etablissement_sante
  SET compte_verifie = true
  WHERE id_user_etablissement_sante = 18;

-- supperssion de la contrainte de l'enum de type de transaction
  ALTER TABLE transaction_interne
  DROP CONSTRAINT transaction_interne_type_transaction_check;


---------- invitation ou partage de l'appli -------

ALTER TABLE utilisateur
ADD COLUMN code_invitation_utilise VARCHAR(100);


CREATE TABLE invitation (
    id_invitation SERIAL PRIMARY KEY,
    id_user UUID NOT NULL,
    code_invitation VARCHAR(100) UNIQUE NOT NULL,
    nombre_partages INTEGER DEFAULT 0,
    nombre_clicks INTEGER DEFAULT 0,
    nombre_inscriptions INTEGER DEFAULT 0,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invitation_user FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);



CREATE TABLE invitation_tracking (
    id_tracking SERIAL PRIMARY KEY,
    code_invitation VARCHAR(100) NOT NULL,
    ip_visiteur VARCHAR(100),
    user_agent TEXT,
    date_click TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tracking_invitation FOREIGN KEY (code_invitation) REFERENCES invitation(code_invitation) ON DELETE CASCADE
);

------------- SAMEDI 12 AVRIL 2025 -----------------

CREATE TABLE IF NOT EXISTS admin_rechargements (
    id_rechargement SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL,
    cible_type VARCHAR(20) NOT NULL CHECK (cible_type IN ('user', 'etablissement')),
    cible_id INTEGER NOT NULL,
    identifiant TEXT NOT NULL,
    montant INTEGER NOT NULL,
    nouveau_solde INTEGER NOT NULL,
    ancien_solde INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode VARCHAR(20) DEFAULT 'manuel'
);


ALTER TABLE admin_rechargements
ADD CONSTRAINT fk_admin FOREIGN KEY (id_admin) REFERENCES administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


ALTER TABLE admin_rechargements
ALTER COLUMN cible_id TYPE TEXT;
