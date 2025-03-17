Table utilisateur {
    id_user INTEGER [primary key]
    date_inscription TIMESTAMP
    code_confirmation VARCHAR(10)
    position GEOMETRY(Point,4326)
    email VARCHAR(255)
    telephone VARCHAR(20)
    mdp VARCHAR(255)
    nom VARCHAR(255)
    prenom VARCHAR(255)
    pays VARCHAR(100)
    photo_profile VARCHAR(255)
}

Table compte {
    id_compte INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    type_compte VARCHAR(20)
    solde_compte INTEGER
    solde_bonus INTEGER
    cumule_mensuel INTEGER
    plafond INTEGER
    mode_paiement_preferentiel VARCHAR(50)
    type_user VARCHAR(20)
    devise VARCHAR(10)
    numero_compte VARCHAR(50) [unique]
    date_creation_compte TIMESTAMP
    date_modification TIMESTAMP
    statut VARCHAR(20)
}

Table cartes_bancaires {
    id_carte_bancaire INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_compte INTEGER [ref: > compte.id_compte]
    type_carte VARCHAR(20)
    banque VARCHAR(100)
    alias VARCHAR(50)
    numero_carte VARCHAR(20)
    date_expiration DATE
    statut VARCHAR(20)
    kyc_verifie BOOLEAN
    commande_physique BOOLEAN
    date_creation TIMESTAMP
}

Table cartes_physiques {
    id_carte_physique INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    statut VARCHAR(20)
    date_creation TIMESTAMP
}

Table transaction_interne {
    id_transaction INTEGER [primary key]
    id_compte_expediteur INTEGER [ref: > compte.id_compte]
    id_compte_recepteur INTEGER [ref: > compte.id_compte]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    montant INTEGER
    devise VARCHAR(10)
    statut VARCHAR(20)
    date_transaction TIMESTAMP
    type_transaction VARCHAR(20)
}

Table transaction_externe {
    id_transaction_externe INTEGER [primary key]
    id_utilisateur INTEGER [ref: > utilisateur.id_user]
    id_compte INTEGER [ref: > compte.id_compte]
    id_moyen_paiement INTEGER [ref: > transactions_bancaires.id_transaction]
    montant NUMERIC(15,2)
    frais_transaction NUMERIC(10,2)
    statut VARCHAR(20)
    devise VARCHAR(10)
    type_transaction VARCHAR(100)
    moyen_paiement VARCHAR(50)
    reference_externe VARCHAR(100) [unique]
    date_transaction TIMESTAMP
    motif VARCHAR(255)
}

Table transactions_bancaires {
    id_transaction INTEGER [primary key]
    id_carte_bancaire INTEGER [ref: > cartes_bancaires.id_carte_bancaire]
    montant NUMERIC(15,2)
    devise VARCHAR(10)
    statut VARCHAR(20)
    date_transaction TIMESTAMP
    description TEXT
}

Table transactions_frais {
    id_frais INTEGER [primary key]
    id_transaction INTEGER [ref: > transactions_frais.id_transaction] [unique]
    montant_frais INTEGER
    type_transaction VARCHAR(20)
    mode_paiement VARCHAR(20)
    date_creation TIMESTAMP
}

Table user_etablissement_sante {
    id_user_etablissement_sante INTEGER [primary key]
    id_admin_gestionnaire INTEGER [ref: > administrateurs.id_admin_gestionnaire]
    nom VARCHAR(255)
    telephone VARCHAR(20)
    categorie VARCHAR(100)
    adresse TEXT
    latitude DOUBLE PRECISION
    longitude DOUBLE PRECISION
    geom GEOMETRY(Point,4326)
    date_creation TIMESTAMP
}

Table administrateurs {
    id_admin_gestionnaire INTEGER [primary key]
    nom VARCHAR(255)
    email VARCHAR(255) [unique]
    telephone VARCHAR(20) [unique]
    mdp VARCHAR(255)
    role VARCHAR(50)
    statut VARCHAR(20)
}

Table publication {
    id_publication INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    id_admin_gestionnaire INTEGER [ref: > administrateurs.id_admin_gestionnaire]
    contenu TEXT
    date_creation TIMESTAMP
    statut VARCHAR(20)
}

Table notification_transaction {
    id_notification_transaction INTEGER [primary key]
    id_transaction INTEGER
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    type_notification VARCHAR(20)
    contenu TEXT
    montant NUMERIC(15,2)
    date_envoi TIMESTAMP
    statut VARCHAR(20)
    is_lu BOOLEAN
}

Table notification_broadcast {
    id_notification_broadcast INTEGER [primary key]
    id_admin_gestionnaire INTEGER [ref: > administrateurs.id_admin_gestionnaire]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    cible VARCHAR(20)
    titre VARCHAR(255)
    message TEXT
    statut VARCHAR(20)
    date_envoi TIMESTAMP
}

Table qr_code_paiement_dynamique {
    id_qrcode INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    qr_code_data TEXT
    date_creation TIMESTAMP
    expiration_qrcode TIMESTAMP
    statut VARCHAR(20)
}

Table qr_code_paiement_statique {
    id_qrcode INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    qr_code_data TEXT
    date_creation TIMESTAMP
    statut VARCHAR(20)
}

Table reclamations {
    id_reclamation INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    id_admin_gestionnaire INTEGER [ref: > administrateurs.id_admin_gestionnaire]
    sujet VARCHAR(255)
    message TEXT
    statut VARCHAR(20)
    date_creation TIMESTAMP
}

Table contacts_hostolink {
    id_contact INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_contact_user INTEGER [ref: > utilisateur.id_user]
}

Table verification_kyc {
    id_verification INTEGER [primary key]
    id_user INTEGER [ref: > utilisateur.id_user]
    id_user_etablissement_sante INTEGER [ref: > user_etablissement_sante.id_user_etablissement_sante]
    statut VARCHAR(20)
    date_verification TIMESTAMP
}
