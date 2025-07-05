# pour permettre aux établissement de santé de retirer leur argent par wave 

ALTER TABLE user_etablissement_sante 
ADD COLUMN numero_wave VARCHAR(20),
ADD COLUMN wave_verified BOOLEAN DEFAULT false;

CREATE TABLE wave_payout_session (
    id SERIAL PRIMARY KEY,
    id_user_etablissement_sante INTEGER NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    amount BIGINT NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    status VARCHAR(20) DEFAULT 'pending',
    wave_phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    webhook_received BOOLEAN DEFAULT false,
    wave_transaction_id VARCHAR(255),
    
    FOREIGN KEY (id_user_etablissement_sante) 
    REFERENCES user_etablissement_sante(id_user_etablissement_sante)
);

ALTER TABLE compte 
ADD COLUMN limite_retrait_journalier INTEGER DEFAULT 500000,
ADD COLUMN retrait_mensuel_cumule INTEGER DEFAULT 0;


ALTER TABLE user_etablissement_sante 
ADD COLUMN numero_wave VARCHAR(20), -- Pour le champ "mobile" de l'API
ADD COLUMN wave_verified BOOLEAN DEFAULT false;
DROP TABLE wave_payout_session;

CREATE TABLE wave_payout_session (
    id SERIAL PRIMARY KEY,
    id_user_etablissement_sante INTEGER NOT NULL,
    
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    receive_amount VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    
    wave_payout_id VARCHAR(50),
    wave_fee VARCHAR(10),
    wave_status VARCHAR(20),
    wave_timestamp TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (id_user_etablissement_sante) 
    REFERENCES user_etablissement_sante(id_user_etablissement_sante)
);

ALTER TABLE transaction_externe 
ADD COLUMN wave_payout_id VARCHAR(50),
ADD COLUMN idempotency_key VARCHAR(255);


ALTER TABLE compte 
ADD COLUMN limite_retrait_journalier INTEGER DEFAULT 500000,
ADD COLUMN retrait_mensuel_cumule INTEGER DEFAULT 0;

ALTER TABLE user_etablissement_sante 
ADD COLUMN numero_wave VARCHAR(20), -- Pour le champ "mobile" de l'API
ADD COLUMN wave_verified BOOLEAN DEFAULT false;

ALTER TABLE user_etablissement_sante 
ADD COLUMN numero_wave VARCHAR(20), -- Pour le champ "mobile" de l'API
ADD COLUMN wave_verified BOOLEAN DEFAULT false;

ALTER TABLE user_etablissement_sante 
ADD COLUMN numero_wave VARCHAR(20), 
ADD COLUMN wave_verified BOOLEAN DEFAULT false;

CREATE TABLE wave_payout_session (
    id SERIAL PRIMARY KEY,
    id_user_etablissement_sante INTEGER NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL, 
    currency VARCHAR(10) DEFAULT 'XOF',
    receive_amount VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    wave_payout_id VARCHAR(50), 
    wave_fee VARCHAR(10), 
    wave_status VARCHAR(20), 
    wave_timestamp TIMESTAMP, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_user_etablissement_sante) 
    REFERENCES user_etablissement_sante(id_user_etablissement_sante)
);

ALTER TABLE transaction_externe 
ADD COLUMN wave_payout_id VARCHAR(50), 
ADD COLUMN idempotency_key VARCHAR(255); 


ALTER TABLE transaction_externe 
ALTER COLUMN id_utilisateur DROP NOT NULL;

ALTER TABLE transaction_externe 
ALTER COLUMN motif DROP NOT NULL;