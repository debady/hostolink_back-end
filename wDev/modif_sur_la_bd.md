- la table code_verif_otp
    DROP TYPE IF EXISTS moyen_envoi_enum CASCADE;
    
- ajouter le champs moyen_envoyer
    ALTER TABLE code_verif_otp ADD COLUMN moyen_envoyer VARCHAR;
