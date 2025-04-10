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
