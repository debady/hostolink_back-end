--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: moyen_envoi_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.moyen_envoi_enum AS ENUM (
    'email',
    'telephone'
);


ALTER TYPE public.moyen_envoi_enum OWNER TO postgres;

--
-- Name: type_etablissement_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_etablissement_enum AS ENUM (
    'hopital',
    'clinique',
    'pharmacie',
    'centre_medical',
    'autre'
);


ALTER TYPE public.type_etablissement_enum OWNER TO postgres;

--
-- Name: type_notification_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_notification_enum AS ENUM (
    'paiement',
    'retrait',
    'virement',
    'autre'
);


ALTER TYPE public.type_notification_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrateurs (
    id_admin_gestionnaire integer NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb,
    statut character varying(20) DEFAULT 'actif'::character varying,
    dernier_connexion timestamp without time zone,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    compte_verifier character varying(255) DEFAULT false
);


ALTER TABLE public.administrateurs OWNER TO postgres;

--
-- Name: administrateurs_id_admin_gestionnaire_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrateurs_id_admin_gestionnaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrateurs_id_admin_gestionnaire_seq OWNER TO postgres;

--
-- Name: administrateurs_id_admin_gestionnaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrateurs_id_admin_gestionnaire_seq OWNED BY public.administrateurs.id_admin_gestionnaire;


--
-- Name: agent_assistance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_assistance (
    id_agent_assistance integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mdp character varying(255) NOT NULL,
    statut character varying(20) DEFAULT 'actif'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    url_photo_agent character varying(255)
);


ALTER TABLE public.agent_assistance OWNER TO postgres;

--
-- Name: agent_assistance_id_agent_assistance_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_assistance_id_agent_assistance_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_assistance_id_agent_assistance_seq OWNER TO postgres;

--
-- Name: agent_assistance_id_agent_assistance_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_assistance_id_agent_assistance_seq OWNED BY public.agent_assistance.id_agent_assistance;


--
-- Name: annonce; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annonce (
    id_annonce integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre_annonce character varying(255),
    description_annonce text,
    date date,
    url_images character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.annonce OWNER TO postgres;

--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annonce_id_annonce_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.annonce_id_annonce_seq OWNER TO postgres;

--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annonce_id_annonce_seq OWNED BY public.annonce.id_annonce;


--
-- Name: assistance_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assistance_categories (
    id_categorie integer NOT NULL,
    titre character varying(255) NOT NULL,
    description text NOT NULL,
    reponse_automatique text NOT NULL
);


ALTER TABLE public.assistance_categories OWNER TO postgres;

--
-- Name: assistance_categories_id_categorie_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assistance_categories_id_categorie_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assistance_categories_id_categorie_seq OWNER TO postgres;

--
-- Name: assistance_categories_id_categorie_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assistance_categories_id_categorie_seq OWNED BY public.assistance_categories.id_categorie;


--
-- Name: cartes_bancaires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartes_bancaires (
    id_carte_bancaire integer NOT NULL,
    type_carte character varying(20) NOT NULL,
    banque character varying(100) DEFAULT 'Hostolink'::character varying,
    alias character varying(50),
    numero_carte character varying(20) DEFAULT '****-****-****-1234'::character varying,
    date_expiration date NOT NULL,
    statut character varying(20) DEFAULT 'inactif'::character varying,
    kyc_verifie boolean DEFAULT false,
    commande_physique boolean DEFAULT false,
    date_creation timestamp without time zone DEFAULT now(),
    id_compte integer NOT NULL,
    id_user uuid,
    CONSTRAINT cartes_bancaires_type_carte_check CHECK (((type_carte)::text = ANY ((ARRAY['physique'::character varying, 'virtuelle'::character varying])::text[])))
);


ALTER TABLE public.cartes_bancaires OWNER TO postgres;

--
-- Name: cartes_bancaires_id_carte_bancaire_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq OWNER TO postgres;

--
-- Name: cartes_bancaires_id_carte_bancaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq OWNED BY public.cartes_bancaires.id_carte_bancaire;


--
-- Name: cartes_physiques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartes_physiques (
    id_commande integer NOT NULL,
    id_utilisateur integer NOT NULL,
    id_carte_bancaire integer NOT NULL,
    adresse_livraison text NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_commande timestamp without time zone DEFAULT now(),
    id_user uuid
);


ALTER TABLE public.cartes_physiques OWNER TO postgres;

--
-- Name: cartes_physiques_id_commande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartes_physiques_id_commande_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartes_physiques_id_commande_seq OWNER TO postgres;

--
-- Name: cartes_physiques_id_commande_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartes_physiques_id_commande_seq OWNED BY public.cartes_physiques.id_commande;


--
-- Name: cartes_qr_code_dynamique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartes_qr_code_dynamique (
    id_carte_qr integer NOT NULL,
    id_utilisateur integer NOT NULL,
    qr_code_unique text NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.cartes_qr_code_dynamique OWNER TO postgres;

--
-- Name: cartes_qr_code_id_carte_qr_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartes_qr_code_id_carte_qr_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartes_qr_code_id_carte_qr_seq OWNER TO postgres;

--
-- Name: cartes_qr_code_id_carte_qr_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartes_qr_code_id_carte_qr_seq OWNED BY public.cartes_qr_code_dynamique.id_carte_qr;


--
-- Name: cartes_qr_code_statique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartes_qr_code_statique (
    id_carte_qr_statique integer NOT NULL,
    id_utilisateur integer NOT NULL,
    qr_code_unique text NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user uuid
);


ALTER TABLE public.cartes_qr_code_statique OWNER TO postgres;

--
-- Name: cartes_qr_code_statique_id_carte_qr_statique_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq OWNER TO postgres;

--
-- Name: cartes_qr_code_statique_id_carte_qr_statique_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq OWNED BY public.cartes_qr_code_statique.id_carte_qr_statique;


--
-- Name: code_verif_otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.code_verif_otp (
    id integer NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_valid boolean DEFAULT true NOT NULL,
    moyen_envoyer public.moyen_envoi_enum NOT NULL,
    id_user uuid,
    id_user_etablissement_sante integer,
    CONSTRAINT check_id_user_or_etablissement CHECK ((((id_user IS NOT NULL) AND (id_user_etablissement_sante IS NULL)) OR ((id_user IS NULL) AND (id_user_etablissement_sante IS NOT NULL))))
);


ALTER TABLE public.code_verif_otp OWNER TO postgres;

--
-- Name: code_verif_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.code_verif_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.code_verif_otp_id_seq OWNER TO postgres;

--
-- Name: code_verif_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.code_verif_otp_id_seq OWNED BY public.code_verif_otp.id;


--
-- Name: commentaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commentaire (
    id_commentaire integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    contenu text NOT NULL,
    date_commentaire timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.commentaire OWNER TO postgres;

--
-- Name: compte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compte (
    id_compte integer NOT NULL,
    solde_compte integer DEFAULT 0,
    solde_bonus integer DEFAULT 0,
    cumule_mensuel integer DEFAULT 0,
    plafond integer DEFAULT 1000000,
    mode_paiement_preferentiel character varying(50),
    type_user character varying(20) NOT NULL,
    devise character varying(10) DEFAULT 'XOF'::character varying NOT NULL,
    numero_compte character varying(50),
    date_creation_compte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user uuid,
    id_user_etablissement_sante integer,
    CONSTRAINT compte_type_user_check CHECK (((type_user)::text = ANY (ARRAY[('utilisateur'::character varying)::text, ('etablissement'::character varying)::text])))
);



ALTER TABLE public.compte OWNER TO postgres;

--
-- Name: compte_id_compte_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compte_id_compte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compte_id_compte_seq OWNER TO postgres;

--
-- Name: compte_id_compte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compte_id_compte_seq OWNED BY public.compte.id_compte;


--
-- Name: contacts_hostolink; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts_hostolink (
    id_contact integer NOT NULL,
    id_compte_contact integer NOT NULL,
    alias_contact character varying(100),
    nom_contact character varying(255),
    numero_contact character varying(20) NOT NULL,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user uuid,
    id_contact_user uuid
);


ALTER TABLE public.contacts_hostolink OWNER TO postgres;

--
-- Name: contacts_hostolink_id_contact_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_hostolink_id_contact_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_hostolink_id_contact_seq OWNER TO postgres;

--
-- Name: contacts_hostolink_id_contact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_hostolink_id_contact_seq OWNED BY public.contacts_hostolink.id_contact;


--
-- Name: discussion_assistant_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discussion_assistant_client (
    id_discussion integer NOT NULL,
    id_agent_assistance integer NOT NULL,
    id_etablissement integer,
    sujet character varying(255) NOT NULL,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_dernier_message timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_categorie_assistance integer NOT NULL,
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT discussion_assistant_client_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'en_cours'::character varying, 'resolu'::character varying, 'ferme'::character varying])::text[])))
);


ALTER TABLE public.discussion_assistant_client OWNER TO postgres;

--
-- Name: discussion_assistant_client_id_discussion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discussion_assistant_client_id_discussion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discussion_assistant_client_id_discussion_seq OWNER TO postgres;

--
-- Name: discussion_assistant_client_id_discussion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discussion_assistant_client_id_discussion_seq OWNED BY public.discussion_assistant_client.id_discussion;


--
-- Name: historique_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historique_transactions (
    id_historique integer NOT NULL,
    id_transaction integer NOT NULL,
    ancien_statut character varying(20),
    nouveau_statut character varying(20),
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    id_user uuid
);


ALTER TABLE public.historique_transactions OWNER TO postgres;

--
-- Name: historique_transactions_id_historique_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historique_transactions_id_historique_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historique_transactions_id_historique_seq OWNER TO postgres;

--
-- Name: historique_transactions_id_historique_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historique_transactions_id_historique_seq OWNED BY public.historique_transactions.id_historique;


--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id_image uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    url_image character varying NOT NULL,
    motif character varying(50) NOT NULL,
    type_user character varying(50),
    id_user uuid,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: journal_activites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_activites (
    id_activite integer NOT NULL,
    id_user integer,
    id_admin_gestionnaire integer,
    action character varying(255) NOT NULL,
    details text,
    date_heure timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.journal_activites OWNER TO postgres;

--
-- Name: journal_activites_id_activite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journal_activites_id_activite_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journal_activites_id_activite_seq OWNER TO postgres;

--
-- Name: journal_activites_id_activite_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journal_activites_id_activite_seq OWNED BY public.journal_activites.id_activite;


--
-- Name: liste_numero_vert_etablissement_sante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liste_numero_vert_etablissement_sante (
    id_liste_num_etablissement_sante integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    nom_etablissement character varying(255) NOT NULL,
    contact character varying(20) NOT NULL,
    image character varying(255),
    presentation text NOT NULL,
    adresse character varying(255) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    type_etablissement public.type_etablissement_enum NOT NULL,
    site_web character varying(255)
);


ALTER TABLE public.liste_numero_vert_etablissement_sante OWNER TO postgres;

--
-- Name: liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq OWNER TO postgres;

--
-- Name: liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq OWNED BY public.liste_numero_vert_etablissement_sante.id_liste_num_etablissement_sante;


--
-- Name: message_assistant_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_assistant_client (
    id_message integer NOT NULL,
    id_discussion integer NOT NULL,
    expediteur character varying(20) NOT NULL,
    id_expediteur integer NOT NULL,
    contenu text NOT NULL,
    type_message character varying(20) DEFAULT 'texte'::character varying,
    url_fichier character varying(255),
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT message_assistant_client_expediteur_check CHECK (((expediteur)::text = ANY ((ARRAY['utilisateur'::character varying, 'etablissement'::character varying, 'agent_assistance'::character varying])::text[]))),
    CONSTRAINT message_assistant_client_type_message_check CHECK (((type_message)::text = ANY ((ARRAY['texte'::character varying, 'image'::character varying, 'fichier'::character varying])::text[])))
);


ALTER TABLE public.message_assistant_client OWNER TO postgres;

--
-- Name: message_assistant_client_id_message_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_assistant_client_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_assistant_client_id_message_seq OWNER TO postgres;

--
-- Name: message_assistant_client_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_assistant_client_id_message_seq OWNED BY public.message_assistant_client.id_message;


--
-- Name: message_reseau_social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_reseau_social (
    id_message integer NOT NULL,
    id_thematique integer NOT NULL,
    type_user character varying(50),
    contenu_message text NOT NULL,
    url_image character varying(255),
    nbre_like integer DEFAULT 0,
    status_reponse boolean DEFAULT false,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user uuid
);


ALTER TABLE public.message_reseau_social OWNER TO postgres;

--
-- Name: message_reseau_social_id_message_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_reseau_social_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_reseau_social_id_message_seq OWNER TO postgres;

--
-- Name: message_reseau_social_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_reseau_social_id_message_seq OWNED BY public.message_reseau_social.id_message;


--
-- Name: notification_broadcast; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_broadcast (
    id_notification_broadcast integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    cible character varying(20) NOT NULL,
    titre character varying(255) NOT NULL,
    message text NOT NULL,
    statut character varying(20) DEFAULT 'envoye'::character varying,
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    CONSTRAINT notification_broadcast_cible_check CHECK (((cible)::text = ANY ((ARRAY['utilisateur'::character varying, 'etablissement'::character varying])::text[])))
);


ALTER TABLE public.notification_broadcast OWNER TO postgres;

--
-- Name: notification_broadcast_id_notification_broadcast_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_broadcast_id_notification_broadcast_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_broadcast_id_notification_broadcast_seq OWNER TO postgres;

--
-- Name: notification_broadcast_id_notification_broadcast_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_broadcast_id_notification_broadcast_seq OWNED BY public.notification_broadcast.id_notification_broadcast;


--
-- Name: notification_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_transaction (
    id_notification_transaction integer NOT NULL,
    id_transaction integer NOT NULL,
    identif_transaction character varying(10) DEFAULT ('Hstlk-'::text || substr(md5((random())::text), 1, 5)) NOT NULL,
    type_notification public.type_notification_enum NOT NULL,
    contenu text NOT NULL,
    montant numeric(15,2),
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'envoy‚'::character varying,
    is_lu boolean DEFAULT false NOT NULL,
    id_user_etablissement_sante integer,
    id_user uuid
);


ALTER TABLE public.notification_transaction OWNER TO postgres;

--
-- Name: partage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partage (
    id_partage integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    date_partage timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lien_partage character varying(255),
    plateforme_partage character varying(255),
    nombre_clics integer DEFAULT 0,
    id_user_etablissement_sante integer
);


ALTER TABLE public.partage OWNER TO postgres;

--
-- Name: partage_appli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partage_appli (
    id_partage_appli integer NOT NULL,
    lien_partage character varying(255) NOT NULL,
    plateforme_partage character varying(50) NOT NULL,
    nombre_clics integer DEFAULT 0,
    bonus_recu integer DEFAULT 0,
    date_partage timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user uuid,
    CONSTRAINT partage_appli_plateforme_partage_check CHECK (((plateforme_partage)::text = ANY ((ARRAY['whatsapp'::character varying, 'facebook'::character varying, 'twitter'::character varying, 'instagram'::character varying, 'autre'::character varying])::text[])))
);


ALTER TABLE public.partage_appli OWNER TO postgres;

--
-- Name: partage_appli_id_partage_appli_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partage_appli_id_partage_appli_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partage_appli_id_partage_appli_seq OWNER TO postgres;

--
-- Name: partage_appli_id_partage_appli_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partage_appli_id_partage_appli_seq OWNED BY public.partage_appli.id_partage_appli;


--
-- Name: publication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publication (
    id_publication integer NOT NULL,
    titre_publication character varying(255) NOT NULL,
    contenu text NOT NULL,
    image character varying(255),
    date_publication timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    compteur_like integer DEFAULT 0,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer NOT NULL,
    id_user uuid
);


ALTER TABLE public.publication OWNER TO postgres;

--
-- Name: publicite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicite (
    id_pub integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre character varying(255) NOT NULL,
    descript_pub text NOT NULL,
    url_image_pub character varying(255),
    date_debut_pub date NOT NULL,
    date_fin_pub date NOT NULL,
    statuts character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.publicite OWNER TO postgres;

--
-- Name: qr_code_paiement_dynamique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qr_code_paiement_dynamique (
    id_qrcode integer NOT NULL,
    qr_code_valeur text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_expiration timestamp without time zone NOT NULL,
    statut character varying(20) DEFAULT 'actif'::character varying,
    token character varying(1000) DEFAULT NULL::character varying,
    id_user_etablissement_sante integer,
    id_user uuid
);


ALTER TABLE public.qr_code_paiement_dynamique OWNER TO postgres;

--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.qr_code_paiement_id_qrcode_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNER TO postgres;

--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNED BY public.qr_code_paiement_dynamique.id_qrcode;


--
-- Name: qr_code_paiement_statique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qr_code_paiement_statique (
    id_qrcode integer NOT NULL,
    qr_code_data text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user_etablissement_sante integer,
    id_user uuid,
    date_expiration timestamp without time zone,
    token character varying(1000)
);

ALTER TABLE public.qr_code_paiement_statique OWNER TO postgres;

--
-- Name: qr_code_paiement_statique_id_qrcode_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq OWNER TO postgres;

--
-- Name: qr_code_paiement_statique_id_qrcode_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq OWNED BY public.qr_code_paiement_statique.id_qrcode;


--
-- Name: reclamations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reclamations (
    id_reclamation integer NOT NULL,
    id_transaction integer,
    sujet character varying(255) NOT NULL,
    description text NOT NULL,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    date_ouverture timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motif character varying(255) DEFAULT 'Autre'::character varying,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer NOT NULL,
    id_user uuid
);


ALTER TABLE public.reclamations OWNER TO postgres;

--
-- Name: reclamations_id_reclamation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reclamations_id_reclamation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reclamations_id_reclamation_seq OWNER TO postgres;

--
-- Name: reclamations_id_reclamation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reclamations_id_reclamation_seq OWNED BY public.reclamations.id_reclamation;


--
-- Name: thematiques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thematiques (
    id_thematique_discussion integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre_thematique character varying(255) NOT NULL,
    sous_titre character varying(255),
    image character varying(255),
    description text NOT NULL,
    nbre_expert integer DEFAULT 0,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.thematiques OWNER TO postgres;

--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.thematiques_id_thematique_discussion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNER TO postgres;

--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNED BY public.thematiques.id_thematique_discussion;


--
-- Name: transaction_externe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_externe (
    id_transaction_externe integer NOT NULL,
    id_utilisateur integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    frais_transaction numeric(10,2) DEFAULT 0.00,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    devise character varying(10) NOT NULL,
    type_transaction character varying(100),
    moyen_paiement character varying(50),
    reference_externe character varying(100),
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motif character varying(255) NOT NULL,
    id_compte integer NOT NULL,
    id_moyen_paiement integer NOT NULL,
    id_transaction integer,
    CONSTRAINT transaction_externe_moyen_paiement_check CHECK (((moyen_paiement)::text = ANY ((ARRAY['wave'::character varying, 'mtn'::character varying, 'moov'::character varying, 'orange'::character varying, 'paypal'::character varying, 'djamo'::character varying, 'push'::character varying, 'carte_bancaire'::character varying, 'virement_bancaire'::character varying])::text[]))),
    CONSTRAINT transaction_externe_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['depot'::character varying, 'retrait'::character varying])::text[])))
);


ALTER TABLE public.transaction_externe OWNER TO postgres;

--
-- Name: transaction_externe_id_transaction_externe_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_externe_id_transaction_externe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_externe_id_transaction_externe_seq OWNER TO postgres;

--
-- Name: transaction_externe_id_transaction_externe_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_externe_id_transaction_externe_seq OWNED BY public.transaction_externe.id_transaction_externe;


--
-- Name: transaction_interne; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_interne (
    id_transaction integer NOT NULL,
    id_compte_expediteur integer NOT NULL,
    id_utilisateur_recepteur integer,
    id_etablissement_recepteur integer,
    montant numeric(15,2) NOT NULL,
    frais_transaction numeric(10,2) DEFAULT 0.00,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    devise_transaction character varying(10) NOT NULL,
    type_transaction character varying(100),
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_qrcode integer,
    id_compte_recepteur integer NOT NULL,
    id_user_etablissement_sante integer,
    CONSTRAINT transaction_interne_check CHECK (((id_utilisateur_recepteur IS NOT NULL) OR (id_etablissement_recepteur IS NOT NULL))),
    CONSTRAINT transaction_interne_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['transfert'::character varying, 'paiement_qrcode'::character varying])::text[])))
);


ALTER TABLE public.transaction_interne OWNER TO postgres;

--
-- Name: transaction_interne_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_interne_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_interne_id_transaction_seq OWNER TO postgres;

--
-- Name: transaction_interne_id_transaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_interne_id_transaction_seq OWNED BY public.transaction_interne.id_transaction;


--
-- Name: transactions_bancaires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions_bancaires (
    id_transaction integer NOT NULL,
    id_carte_bancaire integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    devise character varying(10) NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_transaction timestamp without time zone DEFAULT now(),
    description text
);


ALTER TABLE public.transactions_bancaires OWNER TO postgres;

--
-- Name: transactions_bancaires_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_bancaires_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_bancaires_id_transaction_seq OWNER TO postgres;

--
-- Name: transactions_bancaires_id_transaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_bancaires_id_transaction_seq OWNED BY public.transactions_bancaires.id_transaction;


--
-- Name: transactions_frais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions_frais (
    id_frais integer NOT NULL,
    id_transaction integer NOT NULL,
    montant_frais integer NOT NULL,
    type_transaction character varying(20) NOT NULL,
    mode_paiement character varying(20) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_frais_mode_paiement_check CHECK (((mode_paiement)::text = ANY ((ARRAY['wallet'::character varying, 'mobile_money'::character varying, 'banque'::character varying])::text[]))),
    CONSTRAINT transactions_frais_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['interne'::character varying, 'externe'::character varying, 'bancaire'::character varying])::text[])))
);


ALTER TABLE public.transactions_frais OWNER TO postgres;

--
-- Name: transactions_frais_id_frais_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_frais_id_frais_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_frais_id_frais_seq OWNER TO postgres;

--
-- Name: transactions_frais_id_frais_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_frais_id_frais_seq OWNED BY public.transactions_frais.id_frais;


--
-- Name: user_etablissement_sante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_etablissement_sante (
    id_user_etablissement_sante integer NOT NULL,
    nom character varying(255),
    telephone character varying(20),
    categorie character varying(100),
    adresse text,
    creat_at timestamp without time zone DEFAULT now(),
    latitude double precision,
    longitude double precision,
    geom public.geometry(Point,4326),
    specialites character varying,
    email character varying(255) DEFAULT NULL::character varying,
    mot_de_passe text
);


ALTER TABLE public.user_etablissement_sante OWNER TO postgres;

--
-- Name: user_etablissement_sante_id_user_etablissement_sante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq OWNER TO postgres;

--
-- Name: user_etablissement_sante_id_user_etablissement_sante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq OWNED BY public.user_etablissement_sante.id_user_etablissement_sante;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    date_inscription timestamp without time zone DEFAULT now() NOT NULL,
    "position" public.geometry(Point,4326),
    email character varying(255),
    telephone character varying(20),
    mdp character varying(255),
    nom character varying(255),
    prenom character varying(255),
    pays character varying(100),
    raison_banni text DEFAULT 'R.A.S'::text,
    id_user uuid DEFAULT gen_random_uuid() NOT NULL,
    compte_verifier boolean DEFAULT false,
    dernier_otp_envoye timestamp without time zone,
    actif boolean DEFAULT true
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: verification_kyc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_kyc (
    id_kyc integer NOT NULL,
    id_utilisateur integer NOT NULL,
    type_document character varying(50),
    url_document_recto text NOT NULL,
    url_document_verso text,
    selfie_url text NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_soumission timestamp without time zone DEFAULT now(),
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT verification_kyc_type_document_check CHECK (((type_document)::text = ANY ((ARRAY['CNI'::character varying, 'Passeport'::character varying, 'Permis de conduire'::character varying])::text[])))
);


ALTER TABLE public.verification_kyc OWNER TO postgres;

--
-- Name: verification_kyc_id_kyc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_kyc_id_kyc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_kyc_id_kyc_seq OWNER TO postgres;

--
-- Name: verification_kyc_id_kyc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_kyc_id_kyc_seq OWNED BY public.verification_kyc.id_kyc;


--
-- Name: administrateurs id_admin_gestionnaire; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateurs ALTER COLUMN id_admin_gestionnaire SET DEFAULT nextval('public.administrateurs_id_admin_gestionnaire_seq'::regclass);


--
-- Name: agent_assistance id_agent_assistance; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_assistance ALTER COLUMN id_agent_assistance SET DEFAULT nextval('public.agent_assistance_id_agent_assistance_seq'::regclass);


--
-- Name: annonce id_annonce; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce ALTER COLUMN id_annonce SET DEFAULT nextval('public.annonce_id_annonce_seq'::regclass);


--
-- Name: assistance_categories id_categorie; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assistance_categories ALTER COLUMN id_categorie SET DEFAULT nextval('public.assistance_categories_id_categorie_seq'::regclass);


--
-- Name: cartes_bancaires id_carte_bancaire; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_bancaires ALTER COLUMN id_carte_bancaire SET DEFAULT nextval('public.cartes_bancaires_id_carte_bancaire_seq'::regclass);


--
-- Name: cartes_physiques id_commande; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_physiques ALTER COLUMN id_commande SET DEFAULT nextval('public.cartes_physiques_id_commande_seq'::regclass);


--
-- Name: cartes_qr_code_dynamique id_carte_qr; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_qr_code_dynamique ALTER COLUMN id_carte_qr SET DEFAULT nextval('public.cartes_qr_code_id_carte_qr_seq'::regclass);


--
-- Name: cartes_qr_code_statique id_carte_qr_statique; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_qr_code_statique ALTER COLUMN id_carte_qr_statique SET DEFAULT nextval('public.cartes_qr_code_statique_id_carte_qr_statique_seq'::regclass);


--
-- Name: code_verif_otp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_verif_otp ALTER COLUMN id SET DEFAULT nextval('public.code_verif_otp_id_seq'::regclass);


--
-- Name: compte id_compte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte ALTER COLUMN id_compte SET DEFAULT nextval('public.compte_id_compte_seq'::regclass);


--
-- Name: contacts_hostolink id_contact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_hostolink ALTER COLUMN id_contact SET DEFAULT nextval('public.contacts_hostolink_id_contact_seq'::regclass);


--
-- Name: discussion_assistant_client id_discussion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_assistant_client ALTER COLUMN id_discussion SET DEFAULT nextval('public.discussion_assistant_client_id_discussion_seq'::regclass);


--
-- Name: historique_transactions id_historique; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_transactions ALTER COLUMN id_historique SET DEFAULT nextval('public.historique_transactions_id_historique_seq'::regclass);


--
-- Name: journal_activites id_activite; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_activites ALTER COLUMN id_activite SET DEFAULT nextval('public.journal_activites_id_activite_seq'::regclass);


--
-- Name: liste_numero_vert_etablissement_sante id_liste_num_etablissement_sante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante ALTER COLUMN id_liste_num_etablissement_sante SET DEFAULT nextval('public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq'::regclass);


--
-- Name: message_assistant_client id_message; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_assistant_client ALTER COLUMN id_message SET DEFAULT nextval('public.message_assistant_client_id_message_seq'::regclass);


--
-- Name: message_reseau_social id_message; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reseau_social ALTER COLUMN id_message SET DEFAULT nextval('public.message_reseau_social_id_message_seq'::regclass);


--
-- Name: notification_broadcast id_notification_broadcast; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_broadcast ALTER COLUMN id_notification_broadcast SET DEFAULT nextval('public.notification_broadcast_id_notification_broadcast_seq'::regclass);


--
-- Name: partage_appli id_partage_appli; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage_appli ALTER COLUMN id_partage_appli SET DEFAULT nextval('public.partage_appli_id_partage_appli_seq'::regclass);


--
-- Name: qr_code_paiement_dynamique id_qrcode; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_id_qrcode_seq'::regclass);


--
-- Name: qr_code_paiement_statique id_qrcode; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_statique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_statique_id_qrcode_seq'::regclass);


--
-- Name: reclamations id_reclamation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations ALTER COLUMN id_reclamation SET DEFAULT nextval('public.reclamations_id_reclamation_seq'::regclass);


--
-- Name: thematiques id_thematique_discussion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thematiques ALTER COLUMN id_thematique_discussion SET DEFAULT nextval('public.thematiques_id_thematique_discussion_seq'::regclass);


--
-- Name: transaction_externe id_transaction_externe; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe ALTER COLUMN id_transaction_externe SET DEFAULT nextval('public.transaction_externe_id_transaction_externe_seq'::regclass);


--
-- Name: transaction_interne id_transaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne ALTER COLUMN id_transaction SET DEFAULT nextval('public.transaction_interne_id_transaction_seq'::regclass);


--
-- Name: transactions_bancaires id_transaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_bancaires ALTER COLUMN id_transaction SET DEFAULT nextval('public.transactions_bancaires_id_transaction_seq'::regclass);


--
-- Name: transactions_frais id_frais; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_frais ALTER COLUMN id_frais SET DEFAULT nextval('public.transactions_frais_id_frais_seq'::regclass);


--
-- Name: user_etablissement_sante id_user_etablissement_sante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_etablissement_sante ALTER COLUMN id_user_etablissement_sante SET DEFAULT nextval('public.user_etablissement_sante_id_user_etablissement_sante_seq'::regclass);


--
-- Name: verification_kyc id_kyc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_kyc ALTER COLUMN id_kyc SET DEFAULT nextval('public.verification_kyc_id_kyc_seq'::regclass);


--
-- Data for Name: administrateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrateurs (id_admin_gestionnaire, email, telephone, mot_de_passe, role, permissions, statut, dernier_connexion, date_creation, date_modification, compte_verifier) FROM stdin;
27	geoloc1@hostolink.com	+2250101010105	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_geolocalisation	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
28	assistant2@hostolink.com	+2250101010106	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
29	gestionappel2@hostolink.com	+2250101010107	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
31	assistant3@hostolink.com	+2250101010109	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
32	gestionappel3@hostolink.com	+2250101010110	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
33	geoloc3@hostolink.com	+2250101010111	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_geolocalisation	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
34	assistant4@hostolink.com	+2250101010112	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
35	gestionappel4@hostolink.com	+2250101010113	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
36	geoloc4@hostolink.com	+2250101010114	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_geolocalisation	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
37	assistant5@hostolink.com	+2250101010115	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
38	gestionappel5@hostolink.com	+2250101010116	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
39	geoloc5@hostolink.com	+2250101010117	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_geolocalisation	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
40	assistant6@hostolink.com	+2250101010118	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
41	gestionappel6@hostolink.com	+2250101010119	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
43	superadmin001@gmail.com	+2250544704854	$2b$10$N0v0fWv07JdBNyR1wrhGG..hUfkSBjEPXkFVBWiDiMlB6tLc3pLrm	super_admin	{}	actif	\N	2025-03-19 20:08:24.29358	2025-03-19 20:08:24.29358	false
42	geoloc6@hostolink.com	+2250101010120	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_geolocalisation	{}	inactif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	false
23	superadmin1@hostolink.com	+2250102030450	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	super_admin	{}	gggg	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 20:15:38.407	false
24	superadmin2@hostolink.com	+2250101010102	$2b$10$xeTv.URnbYqhsQax47xp/OQUZdXhIG96PvVHwKeaCWV4S4jJGXlju	super_admin	{}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 21:03:32.758	false
25	assistant1@hostolink.com	+2250101010103	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	assistant	{"acces_stats": true, "gerer_utilisateurs": true, "supprimer_publications": false}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 21:10:32.746	false
26	gestionappel1@hostolink.com	+2250101010104	$2b$10$ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE	gestionnaire_appel	{"acces_stats": true, "gerer_utilisateurs": true, "supprimer_publications": false}	actif	2025-03-19 19:56:22.386287	2025-03-19 19:56:22.386287	2025-03-19 21:11:58.54	false
44	superadmin002@gmail.com	+22505447048542	$2b$10$W86RysxSxtIo1h9DoDNZkueCc2.FYUXXWxwUETQ4LEwSS47XEWoFa	super_admin	{}	actif	\N	2025-03-20 19:20:58.17385	2025-03-20 19:20:58.17385	false
45	superadmin003@gmail.com	+2250000000000	$2b$10$E2oRcgFPuzqCnwUPtFwD3OyzF1aKwLgPZPBDIftjdf7VzSE6TFWry	super_admin	{}	actif	\N	2025-03-21 14:59:03.831352	2025-03-21 14:59:03.831352	false
\.


--
-- Data for Name: agent_assistance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_assistance (id_agent_assistance, id_admin_gestionnaire, nom, prenom, email, telephone, mdp, statut, date_creation, date_modification, url_photo_agent) FROM stdin;
\.


--
-- Data for Name: annonce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annonce (id_annonce, id_admin_gestionnaire, titre_annonce, description_annonce, date, url_images) FROM stdin;
\.


--
-- Data for Name: assistance_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assistance_categories (id_categorie, titre, description, reponse_automatique) FROM stdin;
\.


--
-- Data for Name: cartes_bancaires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartes_bancaires (id_carte_bancaire, type_carte, banque, alias, numero_carte, date_expiration, statut, kyc_verifie, commande_physique, date_creation, id_compte, id_user) FROM stdin;
\.


--
-- Data for Name: cartes_physiques; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartes_physiques (id_commande, id_utilisateur, id_carte_bancaire, adresse_livraison, statut, date_commande, id_user) FROM stdin;
\.


--
-- Data for Name: cartes_qr_code_dynamique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartes_qr_code_dynamique (id_carte_qr, id_utilisateur, qr_code_unique, date_creation, statut) FROM stdin;
\.


--
-- Data for Name: cartes_qr_code_statique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartes_qr_code_statique (id_carte_qr_statique, id_utilisateur, qr_code_unique, date_creation, statut, id_user) FROM stdin;
\.


--
-- Data for Name: code_verif_otp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.code_verif_otp (id, otp_code, expires_at, is_valid, moyen_envoyer, id_user, id_user_etablissement_sante) FROM stdin;
70	2784	2025-03-21 14:51:39.378	f	telephone	d83e0ecf-e5e5-41c4-9ba0-bb50e9de4e36	\N
71	3001	2025-03-21 15:31:15.288	f	email	a0ede9f8-f6ab-46f7-954d-60205bc3e02a	\N
\.


--
-- Data for Name: commentaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commentaire (id_commentaire, id_publication, id_user, contenu, date_commentaire) FROM stdin;
\.


--
-- Data for Name: compte; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compte (id_compte, solde_compte, solde_bonus, cumule_mensuel, plafond, mode_paiement_preferentiel, type_user, devise, numero_compte, date_creation_compte, date_modification, statut, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: contacts_hostolink; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts_hostolink (id_contact, id_compte_contact, alias_contact, nom_contact, numero_contact, date_ajout, id_user, id_contact_user) FROM stdin;
\.


--
-- Data for Name: discussion_assistant_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discussion_assistant_client (id_discussion, id_agent_assistance, id_etablissement, sujet, statut, date_creation, date_dernier_message, id_categorie_assistance, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: historique_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historique_transactions (id_historique, id_transaction, ancien_statut, nouveau_statut, date_modification, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id_image, date, url_image, motif, type_user, id_user, id_user_etablissement_sante, id_admin_gestionnaire) FROM stdin;
eea9a812-bb50-4d2a-8160-f0d83dea665d	2025-03-21 14:51:33.778098	https://res.cloudinary.com/dhrrk7vsd/image/upload/v1742565093/dossier_hostolink_preset/u835fjrzhsgcjdjkivxt.jpg	photo_profile	utilisateur	d83e0ecf-e5e5-41c4-9ba0-bb50e9de4e36	\N	\N
bff5b32c-3d34-4868-97ce-79cf1bb0cce8	2025-03-21 15:01:44.471305	https://res.cloudinary.com/dhrrk7vsd/image/upload/v1742566039/dossier_hostolink_preset/avatars_admin/admin_44_1742566038173.jpg	avatar_admin	\N	\N	\N	44
5fd09f6c-5a0c-4f90-8f85-27edc417e1b9	2025-03-21 15:07:28.462927	https://res.cloudinary.com/dhrrk7vsd/image/upload/v1742566662/dossier_hostolink_preset/avatars_admin/admin_45_1742566660888.jpg	avatar_admin	\N	\N	\N	45
dad4077e-14da-45bf-b5ea-1ebd0e38ba28	2025-03-21 15:31:06.844735	https://res.cloudinary.com/dhrrk7vsd/image/upload/v1742567465/dossier_hostolink_preset/dzpwcqlvwmsw9xqbux32.jpg	photo_profile	utilisateur	a0ede9f8-f6ab-46f7-954d-60205bc3e02a	\N	\N
\.


--
-- Data for Name: journal_activites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_activites (id_activite, id_user, id_admin_gestionnaire, action, details, date_heure) FROM stdin;
\.


--
-- Data for Name: liste_numero_vert_etablissement_sante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liste_numero_vert_etablissement_sante (id_liste_num_etablissement_sante, id_admin_gestionnaire, nom_etablissement, contact, image, presentation, adresse, latitude, longitude, type_etablissement, site_web) FROM stdin;
\.


--
-- Data for Name: message_assistant_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_assistant_client (id_message, id_discussion, expediteur, id_expediteur, contenu, type_message, url_fichier, date_envoi, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: message_reseau_social; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_reseau_social (id_message, id_thematique, type_user, contenu_message, url_image, nbre_like, status_reponse, date, id_user) FROM stdin;
\.


--
-- Data for Name: notification_broadcast; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_broadcast (id_notification_broadcast, id_admin_gestionnaire, cible, titre, message, statut, date_envoi, id_user_etablissement_sante) FROM stdin;
\.


--
-- Data for Name: notification_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_transaction (id_notification_transaction, id_transaction, identif_transaction, type_notification, contenu, montant, date_envoi, statut, is_lu, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: partage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partage (id_partage, id_publication, id_user, date_partage, lien_partage, plateforme_partage, nombre_clics, id_user_etablissement_sante) FROM stdin;
\.


--
-- Data for Name: partage_appli; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partage_appli (id_partage_appli, lien_partage, plateforme_partage, nombre_clics, bonus_recu, date_partage, id_user) FROM stdin;
\.


--
-- Data for Name: publication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publication (id_publication, titre_publication, contenu, image, date_publication, compteur_like, id_user_etablissement_sante, id_admin_gestionnaire, id_user) FROM stdin;
\.


--
-- Data for Name: publicite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publicite (id_pub, id_admin_gestionnaire, titre, descript_pub, url_image_pub, date_debut_pub, date_fin_pub, statuts) FROM stdin;
\.


--
-- Data for Name: qr_code_paiement_dynamique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.qr_code_paiement_dynamique (id_qrcode, id_utilisateur, qr_code_valeur, date_creation, date_expiration, statut, token_securite, type_qrcode, historique, transaction_id, utilise, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Data for Name: qr_code_paiement_statique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.qr_code_paiement_statique (id_qrcode, id_utilisateur, qr_code_data, date_creation, statut, id_user_etablissement_sante) FROM stdin;
\.


--
-- Data for Name: reclamations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reclamations (id_reclamation, id_transaction, sujet, description, statut, date_ouverture, motif, id_user_etablissement_sante, id_admin_gestionnaire, id_user) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: thematiques; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thematiques (id_thematique_discussion, id_admin_gestionnaire, titre_thematique, sous_titre, image, description, nbre_expert, date_ajout) FROM stdin;
\.


--
-- Data for Name: transaction_externe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_externe (id_transaction_externe, id_utilisateur, montant, frais_transaction, statut, devise, type_transaction, moyen_paiement, reference_externe, date_transaction, motif, id_compte, id_moyen_paiement, id_transaction) FROM stdin;
\.


--
-- Data for Name: transaction_interne; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_interne (id_transaction, id_compte_expediteur, id_utilisateur_recepteur, id_etablissement_recepteur, montant, frais_transaction, statut, devise_transaction, type_transaction, date_transaction, id_qrcode, id_compte_recepteur, id_user_etablissement_sante) FROM stdin;
\.


--
-- Data for Name: transactions_bancaires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions_bancaires (id_transaction, id_carte_bancaire, montant, devise, statut, date_transaction, description) FROM stdin;
\.


--
-- Data for Name: transactions_frais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions_frais (id_frais, id_transaction, montant_frais, type_transaction, mode_paiement, date_creation) FROM stdin;
\.


--
-- Data for Name: user_etablissement_sante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_etablissement_sante (id_user_etablissement_sante, nom, telephone, categorie, adresse, creat_at, latitude, longitude, geom, specialites, email, mot_de_passe) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (date_inscription, "position", email, telephone, mdp, nom, prenom, pays, raison_banni, id_user, compte_verifier, dernier_otp_envoye, actif) FROM stdin;
2025-03-21 14:42:49.966	\N	cyber10email@gmail.com	+2250544704854	$2b$10$UdphganPqNjDGqla0UNBnu5p8KIzVIpHNN3z.TLb4BcZR/DvfSouS	N'guessan	Kouadio david	Côte d'Ivoire	R.A.S	d83e0ecf-e5e5-41c4-9ba0-bb50e9de4e36	t	\N	t
2025-03-21 15:25:48.038	\N	cyber101email@gmail.com	+22505447048541	$2b$10$3uSNUW/AcRP2MlFbIJp8TehwiBMuwhNRRbiOxzUXhwBcVnEJXb0Qa	N'guessan	Kouadio david	Côte d'Ivoire	R.A.S	a0ede9f8-f6ab-46f7-954d-60205bc3e02a	t	\N	t
\.


--
-- Data for Name: verification_kyc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification_kyc (id_kyc, id_utilisateur, type_document, url_document_recto, url_document_verso, selfie_url, statut, date_soumission, id_user_etablissement_sante, id_user) FROM stdin;
\.


--
-- Name: administrateurs_id_admin_gestionnaire_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrateurs_id_admin_gestionnaire_seq', 45, true);


--
-- Name: agent_assistance_id_agent_assistance_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agent_assistance_id_agent_assistance_seq', 1, false);


--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annonce_id_annonce_seq', 1, false);


--
-- Name: assistance_categories_id_categorie_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assistance_categories_id_categorie_seq', 1, false);


--
-- Name: cartes_bancaires_id_carte_bancaire_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartes_bancaires_id_carte_bancaire_seq', 1, false);


--
-- Name: cartes_physiques_id_commande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartes_physiques_id_commande_seq', 1, false);


--
-- Name: cartes_qr_code_id_carte_qr_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartes_qr_code_id_carte_qr_seq', 1, false);


--
-- Name: cartes_qr_code_statique_id_carte_qr_statique_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartes_qr_code_statique_id_carte_qr_statique_seq', 1, false);


--
-- Name: code_verif_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.code_verif_otp_id_seq', 71, true);


--
-- Name: compte_id_compte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compte_id_compte_seq', 1, false);


--
-- Name: contacts_hostolink_id_contact_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_hostolink_id_contact_seq', 1, false);


--
-- Name: discussion_assistant_client_id_discussion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discussion_assistant_client_id_discussion_seq', 1, false);


--
-- Name: historique_transactions_id_historique_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historique_transactions_id_historique_seq', 1, false);


--
-- Name: journal_activites_id_activite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journal_activites_id_activite_seq', 1, false);


--
-- Name: liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq', 1, false);


--
-- Name: message_assistant_client_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_assistant_client_id_message_seq', 1, false);


--
-- Name: message_reseau_social_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_reseau_social_id_message_seq', 1, false);


--
-- Name: notification_broadcast_id_notification_broadcast_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_broadcast_id_notification_broadcast_seq', 1, false);


--
-- Name: partage_appli_id_partage_appli_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partage_appli_id_partage_appli_seq', 1, false);


--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qr_code_paiement_id_qrcode_seq', 1, false);


--
-- Name: qr_code_paiement_statique_id_qrcode_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qr_code_paiement_statique_id_qrcode_seq', 1, false);


--
-- Name: reclamations_id_reclamation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reclamations_id_reclamation_seq', 1, false);


--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thematiques_id_thematique_discussion_seq', 1, false);


--
-- Name: transaction_externe_id_transaction_externe_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_externe_id_transaction_externe_seq', 1, false);


--
-- Name: transaction_interne_id_transaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_interne_id_transaction_seq', 4, true);


--
-- Name: transactions_bancaires_id_transaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_bancaires_id_transaction_seq', 1, false);


--
-- Name: transactions_frais_id_frais_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_frais_id_frais_seq', 1, false);


--
-- Name: user_etablissement_sante_id_user_etablissement_sante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_etablissement_sante_id_user_etablissement_sante_seq', 1, false);


--
-- Name: verification_kyc_id_kyc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_kyc_id_kyc_seq', 1, false);


--
-- Name: administrateurs administrateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_email_key UNIQUE (email);


--
-- Name: administrateurs administrateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_pkey PRIMARY KEY (id_admin_gestionnaire);


--
-- Name: administrateurs administrateurs_telephone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_telephone_key UNIQUE (telephone);


--
-- Name: agent_assistance agent_assistance_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_assistance
    ADD CONSTRAINT agent_assistance_email_key UNIQUE (email);


--
-- Name: agent_assistance agent_assistance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_assistance
    ADD CONSTRAINT agent_assistance_pkey PRIMARY KEY (id_agent_assistance);


--
-- Name: annonce annonce_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_pkey PRIMARY KEY (id_annonce);


--
-- Name: assistance_categories assistance_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assistance_categories
    ADD CONSTRAINT assistance_categories_pkey PRIMARY KEY (id_categorie);


--
-- Name: cartes_bancaires cartes_bancaires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_bancaires
    ADD CONSTRAINT cartes_bancaires_pkey PRIMARY KEY (id_carte_bancaire);


--
-- Name: cartes_physiques cartes_physiques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_physiques
    ADD CONSTRAINT cartes_physiques_pkey PRIMARY KEY (id_commande);


--
-- Name: cartes_qr_code_dynamique cartes_qr_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_qr_code_dynamique
    ADD CONSTRAINT cartes_qr_code_pkey PRIMARY KEY (id_carte_qr);


--
-- Name: cartes_qr_code_statique cartes_qr_code_statique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_qr_code_statique
    ADD CONSTRAINT cartes_qr_code_statique_pkey PRIMARY KEY (id_carte_qr_statique);


--
-- Name: compte compte_numero_compte_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_numero_compte_key UNIQUE (numero_compte);


--
-- Name: compte compte_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_pkey PRIMARY KEY (id_compte);


--
-- Name: contacts_hostolink contacts_hostolink_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT contacts_hostolink_pkey PRIMARY KEY (id_contact);


--
-- Name: discussion_assistant_client discussion_assistant_client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT discussion_assistant_client_pkey PRIMARY KEY (id_discussion);


--
-- Name: historique_transactions historique_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT historique_transactions_pkey PRIMARY KEY (id_historique);


--
-- Name: journal_activites journal_activites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_activites
    ADD CONSTRAINT journal_activites_pkey PRIMARY KEY (id_activite);


--
-- Name: liste_numero_vert_etablissement_sante liste_numero_vert_etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT liste_numero_vert_etablissement_sante_pkey PRIMARY KEY (id_liste_num_etablissement_sante);


--
-- Name: message_assistant_client message_assistant_client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT message_assistant_client_pkey PRIMARY KEY (id_message);


--
-- Name: message_reseau_social message_reseau_social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reseau_social
    ADD CONSTRAINT message_reseau_social_pkey PRIMARY KEY (id_message);


--
-- Name: notification_broadcast notification_broadcast_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT notification_broadcast_pkey PRIMARY KEY (id_notification_broadcast);


--
-- Name: partage_appli partage_appli_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage_appli
    ADD CONSTRAINT partage_appli_pkey PRIMARY KEY (id_partage_appli);


--
-- Name: qr_code_paiement_dynamique qr_code_paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT qr_code_paiement_pkey PRIMARY KEY (id_qrcode);


--
-- Name: qr_code_paiement_statique qr_code_paiement_statique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT qr_code_paiement_statique_pkey PRIMARY KEY (id_qrcode);


--
-- Name: reclamations reclamations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT reclamations_pkey PRIMARY KEY (id_reclamation);


--
-- Name: thematiques thematiques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT thematiques_pkey PRIMARY KEY (id_thematique_discussion);


--
-- Name: transaction_externe transaction_externe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT transaction_externe_pkey PRIMARY KEY (id_transaction_externe);


--
-- Name: transaction_externe transaction_externe_reference_externe_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT transaction_externe_reference_externe_key UNIQUE (reference_externe);


--
-- Name: transaction_interne transaction_interne_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT transaction_interne_pkey PRIMARY KEY (id_transaction);


--
-- Name: transactions_bancaires transactions_bancaires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_bancaires
    ADD CONSTRAINT transactions_bancaires_pkey PRIMARY KEY (id_transaction);


--
-- Name: transactions_frais transactions_frais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_frais
    ADD CONSTRAINT transactions_frais_pkey PRIMARY KEY (id_frais);


--
-- Name: transactions_frais unique_id_transaction; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_frais
    ADD CONSTRAINT unique_id_transaction UNIQUE (id_transaction);


--
-- Name: user_etablissement_sante user_etablissement_sante_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_etablissement_sante
    ADD CONSTRAINT user_etablissement_sante_email_key UNIQUE (email);


--
-- Name: user_etablissement_sante user_etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_etablissement_sante
    ADD CONSTRAINT user_etablissement_sante_pkey PRIMARY KEY (id_user_etablissement_sante);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_user);


--
-- Name: verification_kyc verification_kyc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT verification_kyc_pkey PRIMARY KEY (id_kyc);


--
-- Name: annonce fk_annonce_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT fk_annonce_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: cartes_bancaires fk_cartes_bancaires_compte; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_bancaires
    ADD CONSTRAINT fk_cartes_bancaires_compte FOREIGN KEY (id_compte) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: cartes_bancaires fk_cartes_bancaires_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_bancaires
    ADD CONSTRAINT fk_cartes_bancaires_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: cartes_physiques fk_cartes_physiques_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_physiques
    ADD CONSTRAINT fk_cartes_physiques_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: cartes_qr_code_statique fk_cartes_qr_code_statique_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartes_qr_code_statique
    ADD CONSTRAINT fk_cartes_qr_code_statique_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: code_verif_otp fk_code_verif_otp_user_etablissement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_verif_otp
    ADD CONSTRAINT fk_code_verif_otp_user_etablissement FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: code_verif_otp fk_code_verif_otp_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_verif_otp
    ADD CONSTRAINT fk_code_verif_otp_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: compte fk_compte_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT fk_compte_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: compte fk_compte_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT fk_compte_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_hostolink fk_contacts_hostolink_contact; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT fk_contacts_hostolink_contact FOREIGN KEY (id_contact_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_hostolink fk_contacts_hostolink_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT fk_contacts_hostolink_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: discussion_assistant_client fk_discussion_assistant_client_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT fk_discussion_assistant_client_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: discussion_assistant_client fk_discussion_assistant_client_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT fk_discussion_assistant_client_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: historique_transactions fk_historique_transactions_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT fk_historique_transactions_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: historique_transactions fk_historique_transactions_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT fk_historique_transactions_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: images fk_images_administrateurs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_administrateurs FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: images fk_images_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: images fk_images_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_users FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: journal_activites fk_journal_activites_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_activites
    ADD CONSTRAINT fk_journal_activites_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: liste_numero_vert_etablissement_sante fk_liste_numero_vert_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT fk_liste_numero_vert_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: message_assistant_client fk_message_assistant_client_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT fk_message_assistant_client_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: message_assistant_client fk_message_assistant_client_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT fk_message_assistant_client_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: message_reseau_social fk_message_reseau_social_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reseau_social
    ADD CONSTRAINT fk_message_reseau_social_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: notification_broadcast fk_notification_broadcast_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT fk_notification_broadcast_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: notification_broadcast fk_notification_broadcast_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT fk_notification_broadcast_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: notification_transaction fk_notification_transaction_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_transaction
    ADD CONSTRAINT fk_notification_transaction_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: notification_transaction fk_notification_transaction_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_transaction
    ADD CONSTRAINT fk_notification_transaction_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: partage_appli fk_partage_appli_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage_appli
    ADD CONSTRAINT fk_partage_appli_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: partage fk_partage_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage
    ADD CONSTRAINT fk_partage_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: publication fk_publication_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: publication fk_publication_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: publication fk_publication_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: publicite fk_publicite_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT fk_publicite_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: qr_code_paiement_dynamique fk_qr_code_paiement_dynamique_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_paiement_dynamique_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: qr_code_paiement_statique fk_qr_code_paiement_statique_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT fk_qr_code_paiement_statique_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: qr_code_paiement_dynamique fk_qr_code_paiement_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_paiement_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: reclamations fk_reclamations_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: reclamations fk_reclamations_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: reclamations fk_reclamations_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: thematiques fk_thematiques_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT fk_thematiques_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- Name: transaction_externe fk_transaction_externe_compte; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT fk_transaction_externe_compte FOREIGN KEY (id_compte) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction_externe fk_transaction_externe_moyen_paiement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT fk_transaction_externe_moyen_paiement FOREIGN KEY (id_moyen_paiement) REFERENCES public.transactions_bancaires(id_transaction) ON DELETE CASCADE;


--
-- Name: transaction_externe fk_transaction_externe_transactions_frais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT fk_transaction_externe_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;


--
-- Name: transaction_interne fk_transaction_interne_expediteur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_expediteur FOREIGN KEY (id_compte_expediteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction_interne fk_transaction_interne_recepteur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_recepteur FOREIGN KEY (id_compte_recepteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction_interne fk_transaction_interne_transactions_frais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;


--
-- Name: transaction_interne fk_transaction_interne_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: transactions_bancaires fk_transactions_bancaires_transactions_frais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions_bancaires
    ADD CONSTRAINT fk_transactions_bancaires_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;


--
-- Name: verification_kyc fk_verification_kyc_user_etablissement_sante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT fk_verification_kyc_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;


--
-- Name: verification_kyc fk_verification_kyc_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT fk_verification_kyc_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

