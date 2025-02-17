--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: annonce; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.annonce (
    id_annonce integer NOT NULL,
    titre_annonce character varying(255) NOT NULL,
    description_annonce text,
    date date NOT NULL,
    id_role_permission integer
);


ALTER TABLE public.annonce OWNER TO dev_sohapigroup;

--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.annonce_id_annonce_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.annonce_id_annonce_seq OWNER TO dev_sohapigroup;

--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.annonce_id_annonce_seq OWNED BY public.annonce.id_annonce;


--
-- Name: carte_bancaire; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.carte_bancaire (
    id_carte_bancaire integer NOT NULL,
    id_user integer NOT NULL,
    numero_carte character varying(20) NOT NULL,
    date_expiration date NOT NULL,
    cvv character varying(4) NOT NULL,
    type_bancaire character varying(20) NOT NULL,
    status_bancaire character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.carte_bancaire OWNER TO dev_sohapigroup;

--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.carte_bancaire_id_carte_bancaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carte_bancaire_id_carte_bancaire_seq OWNER TO dev_sohapigroup;

--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.carte_bancaire_id_carte_bancaire_seq OWNED BY public.carte_bancaire.id_carte_bancaire;


--
-- Name: commentaire; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.commentaire (
    id_commentaire integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    contenu_commentaire text NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.commentaire OWNER TO dev_sohapigroup;

--
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.commentaire_id_commentaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commentaire_id_commentaire_seq OWNER TO dev_sohapigroup;

--
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.commentaire_id_commentaire_seq OWNED BY public.commentaire.id_commentaire;


--
-- Name: compte; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.compte (
    id_compte integer NOT NULL,
    id_user integer NOT NULL,
    type_compte character varying(20) NOT NULL,
    solde_compte numeric(15,2) DEFAULT 0.00,
    devise character varying(10) NOT NULL,
    numero_compte character varying(50) NOT NULL,
    date_creation_compte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.compte OWNER TO dev_sohapigroup;

--
-- Name: compte_id_compte_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.compte_id_compte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compte_id_compte_seq OWNER TO dev_sohapigroup;

--
-- Name: compte_id_compte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.compte_id_compte_seq OWNED BY public.compte.id_compte;


--
-- Name: contacts_enregistres; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.contacts_enregistres (
    id_contact integer NOT NULL,
    id_user integer NOT NULL,
    id_contact_user integer NOT NULL,
    nom_contact character varying(255),
    numero_contact character varying(20),
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contacts_enregistres OWNER TO dev_sohapigroup;

--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.contacts_enregistres_id_contact_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_enregistres_id_contact_seq OWNER TO dev_sohapigroup;

--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.contacts_enregistres_id_contact_seq OWNED BY public.contacts_enregistres.id_contact;


--
-- Name: etablissement_sante; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.etablissement_sante (
    id_etablissement integer NOT NULL,
    telephone_etablissement_sante character varying(20) NOT NULL,
    nom_etablissement_sante character varying(255) NOT NULL,
    adresse_etablissement_sante text NOT NULL,
    type_etablissement character varying(100) NOT NULL,
    email_etablissement_sante character varying(255),
    mdp character varying(255) NOT NULL,
    id_localisation integer
);


ALTER TABLE public.etablissement_sante OWNER TO dev_sohapigroup;

--
-- Name: etablissement_sante_id_etablissement_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.etablissement_sante_id_etablissement_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etablissement_sante_id_etablissement_seq OWNER TO dev_sohapigroup;

--
-- Name: etablissement_sante_id_etablissement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.etablissement_sante_id_etablissement_seq OWNED BY public.etablissement_sante.id_etablissement;


--
-- Name: liker; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.liker (
    id_like integer NOT NULL,
    id_post_liker integer NOT NULL,
    id_user integer NOT NULL,
    date_liker timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.liker OWNER TO dev_sohapigroup;

--
-- Name: liker_id_like_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.liker_id_like_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liker_id_like_seq OWNER TO dev_sohapigroup;

--
-- Name: liker_id_like_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.liker_id_like_seq OWNED BY public.liker.id_like;


--
-- Name: liste_numero_etablissement_sante; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.liste_numero_etablissement_sante (
    id_liste_num_etablissement_sante integer NOT NULL,
    id_role_permission integer,
    nom_etablissement character varying(255) NOT NULL,
    contact character varying(20) NOT NULL,
    image character varying(255),
    presentation text NOT NULL,
    emplacement character varying(255) NOT NULL
);


ALTER TABLE public.liste_numero_etablissement_sante OWNER TO dev_sohapigroup;

--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq OWNER TO dev_sohapigroup;

--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq OWNED BY public.liste_numero_etablissement_sante.id_liste_num_etablissement_sante;


--
-- Name: localisation; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.localisation (
    id_localisation integer NOT NULL,
    longitude numeric(10,8) NOT NULL,
    latitude numeric(10,8) NOT NULL,
    altitude numeric(10,8)
);


ALTER TABLE public.localisation OWNER TO dev_sohapigroup;

--
-- Name: localisation_id_localisation_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.localisation_id_localisation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.localisation_id_localisation_seq OWNER TO dev_sohapigroup;

--
-- Name: localisation_id_localisation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.localisation_id_localisation_seq OWNED BY public.localisation.id_localisation;


--
-- Name: message; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.message (
    id_message integer NOT NULL,
    id_user integer,
    id_thematique integer,
    contenu_message text,
    date timestamp without time zone
);


ALTER TABLE public.message OWNER TO dev_sohapigroup;

--
-- Name: message_id_message_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.message_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_id_message_seq OWNER TO dev_sohapigroup;

--
-- Name: message_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.message_id_message_seq OWNED BY public.message.id_message;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.notification (
    id_notification integer NOT NULL,
    id_transaction integer NOT NULL,
    id_role_permission integer NOT NULL,
    contenu text NOT NULL,
    montant numeric(15,2),
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'envoyÃ©'::character varying
);


ALTER TABLE public.notification OWNER TO dev_sohapigroup;

--
-- Name: notification_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.notification_id_notification_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_notification_seq OWNER TO dev_sohapigroup;

--
-- Name: notification_id_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.notification_id_notification_seq OWNED BY public.notification.id_notification;


--
-- Name: partages; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.partages (
    id_partage integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    date_partage timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partages OWNER TO dev_sohapigroup;

--
-- Name: partages_id_partage_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.partages_id_partage_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partages_id_partage_seq OWNER TO dev_sohapigroup;

--
-- Name: partages_id_partage_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.partages_id_partage_seq OWNED BY public.partages.id_partage;


--
-- Name: publication; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.publication (
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    titre_publication character varying(255) NOT NULL,
    contenu text NOT NULL,
    image character varying(255),
    date_publication timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.publication OWNER TO dev_sohapigroup;

--
-- Name: publication_id_publication_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.publication_id_publication_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_id_publication_seq OWNER TO dev_sohapigroup;

--
-- Name: publication_id_publication_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.publication_id_publication_seq OWNED BY public.publication.id_publication;


--
-- Name: publicite; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.publicite (
    id_pub integer NOT NULL,
    id_role_permission integer NOT NULL,
    titre character varying(255) NOT NULL,
    descript_pub text NOT NULL,
    image_pub character varying(255),
    date_debut_pub date NOT NULL,
    date_fin_pub date NOT NULL,
    statuts character varying(20) DEFAULT 'actif'::character varying
);


ALTER TABLE public.publicite OWNER TO dev_sohapigroup;

--
-- Name: publicite_id_pub_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.publicite_id_pub_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicite_id_pub_seq OWNER TO dev_sohapigroup;

--
-- Name: publicite_id_pub_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.publicite_id_pub_seq OWNED BY public.publicite.id_pub;


--
-- Name: qr_code_paiement; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.qr_code_paiement (
    id_qrcode integer NOT NULL,
    id_user integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    devise character varying(10) NOT NULL,
    qr_code_data text NOT NULL,
    statut_qrcode character varying(20) DEFAULT 'actif'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expiration_qrcode timestamp without time zone
);


ALTER TABLE public.qr_code_paiement OWNER TO dev_sohapigroup;

--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.qr_code_paiement_id_qrcode_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNER TO dev_sohapigroup;

--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNED BY public.qr_code_paiement.id_qrcode;


--
-- Name: role_permission; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.role_permission (
    id_role_permission integer NOT NULL,
    role character varying(100) NOT NULL,
    permission text NOT NULL,
    description_role text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.role_permission OWNER TO dev_sohapigroup;

--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.role_permission_id_role_permission_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permission_id_role_permission_seq OWNER TO dev_sohapigroup;

--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.role_permission_id_role_permission_seq OWNED BY public.role_permission.id_role_permission;


--
-- Name: thematiques; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.thematiques (
    id_thematique_discussion integer NOT NULL,
    titre_thematique character varying(255) NOT NULL,
    image character varying(255),
    description text NOT NULL,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.thematiques OWNER TO dev_sohapigroup;

--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.thematiques_id_thematique_discussion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNER TO dev_sohapigroup;

--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNED BY public.thematiques.id_thematique_discussion;


--
-- Name: transaction; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.transaction (
    id_transaction integer NOT NULL,
    id_compte_recepteur integer NOT NULL,
    id_compte_expediteur integer NOT NULL,
    id_etablissement integer,
    id_carte_bancaire integer,
    montant numeric(15,2) NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    devise_transaction character varying(10) NOT NULL,
    type_transaction character varying(100) NOT NULL,
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transaction OWNER TO dev_sohapigroup;

--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.transaction_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_id_transaction_seq OWNER TO dev_sohapigroup;

--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.transaction_id_transaction_seq OWNED BY public.transaction.id_transaction;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.utilisateur (
    id_user integer NOT NULL,
    date_inscription timestamp without time zone DEFAULT now(),
    derniere_connexion timestamp without time zone DEFAULT now(),
    nom character varying,
    prenom character varying,
    email character varying,
    telephone character varying,
    pays character varying,
    photo_profile character varying,
    mdp character varying
);


ALTER TABLE public.utilisateur OWNER TO dev_sohapigroup;

--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.utilisateur_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_user_seq OWNER TO dev_sohapigroup;

--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.utilisateur_id_user_seq OWNED BY public.utilisateur.id_user;


--
-- Name: verification_compte; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.verification_compte (
    id_verif_compte integer NOT NULL,
    id_user integer NOT NULL,
    email character varying(191) NOT NULL,
    numero_telephone character varying(20) NOT NULL,
    date_verification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'non vÃ©rifiÃ©'::character varying
);


ALTER TABLE public.verification_compte OWNER TO dev_sohapigroup;

--
-- Name: verification_compte_id_verif_compte_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.verification_compte_id_verif_compte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_compte_id_verif_compte_seq OWNER TO dev_sohapigroup;

--
-- Name: verification_compte_id_verif_compte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.verification_compte_id_verif_compte_seq OWNED BY public.verification_compte.id_verif_compte;


--
-- Name: verification_identite; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.verification_identite (
    id_verification integer NOT NULL,
    id_user integer NOT NULL,
    type_verification character varying(100) NOT NULL,
    statut_verification character varying(20) DEFAULT 'en attente'::character varying,
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_validation timestamp without time zone
);


ALTER TABLE public.verification_identite OWNER TO dev_sohapigroup;

--
-- Name: verification_identite_id_verification_seq; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.verification_identite_id_verification_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_identite_id_verification_seq OWNER TO dev_sohapigroup;

--
-- Name: verification_identite_id_verification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.verification_identite_id_verification_seq OWNED BY public.verification_identite.id_verification;


--
-- Name: annonce id_annonce; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.annonce ALTER COLUMN id_annonce SET DEFAULT nextval('public.annonce_id_annonce_seq'::regclass);


--
-- Name: carte_bancaire id_carte_bancaire; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.carte_bancaire ALTER COLUMN id_carte_bancaire SET DEFAULT nextval('public.carte_bancaire_id_carte_bancaire_seq'::regclass);


--
-- Name: commentaire id_commentaire; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.commentaire ALTER COLUMN id_commentaire SET DEFAULT nextval('public.commentaire_id_commentaire_seq'::regclass);


--
-- Name: compte id_compte; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.compte ALTER COLUMN id_compte SET DEFAULT nextval('public.compte_id_compte_seq'::regclass);


--
-- Name: contacts_enregistres id_contact; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.contacts_enregistres ALTER COLUMN id_contact SET DEFAULT nextval('public.contacts_enregistres_id_contact_seq'::regclass);


--
-- Name: etablissement_sante id_etablissement; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante ALTER COLUMN id_etablissement SET DEFAULT nextval('public.etablissement_sante_id_etablissement_seq'::regclass);


--
-- Name: liker id_like; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liker ALTER COLUMN id_like SET DEFAULT nextval('public.liker_id_like_seq'::regclass);


--
-- Name: liste_numero_etablissement_sante id_liste_num_etablissement_sante; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante ALTER COLUMN id_liste_num_etablissement_sante SET DEFAULT nextval('public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq'::regclass);


--
-- Name: localisation id_localisation; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.localisation ALTER COLUMN id_localisation SET DEFAULT nextval('public.localisation_id_localisation_seq'::regclass);


--
-- Name: message id_message; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.message ALTER COLUMN id_message SET DEFAULT nextval('public.message_id_message_seq'::regclass);


--
-- Name: notification id_notification; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.notification ALTER COLUMN id_notification SET DEFAULT nextval('public.notification_id_notification_seq'::regclass);


--
-- Name: partages id_partage; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.partages ALTER COLUMN id_partage SET DEFAULT nextval('public.partages_id_partage_seq'::regclass);


--
-- Name: publication id_publication; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publication ALTER COLUMN id_publication SET DEFAULT nextval('public.publication_id_publication_seq'::regclass);


--
-- Name: publicite id_pub; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publicite ALTER COLUMN id_pub SET DEFAULT nextval('public.publicite_id_pub_seq'::regclass);


--
-- Name: qr_code_paiement id_qrcode; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.qr_code_paiement ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_id_qrcode_seq'::regclass);


--
-- Name: role_permission id_role_permission; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.role_permission ALTER COLUMN id_role_permission SET DEFAULT nextval('public.role_permission_id_role_permission_seq'::regclass);


--
-- Name: thematiques id_thematique_discussion; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.thematiques ALTER COLUMN id_thematique_discussion SET DEFAULT nextval('public.thematiques_id_thematique_discussion_seq'::regclass);


--
-- Name: transaction id_transaction; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id_transaction SET DEFAULT nextval('public.transaction_id_transaction_seq'::regclass);


--
-- Name: utilisateur id_user; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id_user SET DEFAULT nextval('public.utilisateur_id_user_seq'::regclass);


--
-- Name: verification_compte id_verif_compte; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_compte ALTER COLUMN id_verif_compte SET DEFAULT nextval('public.verification_compte_id_verif_compte_seq'::regclass);


--
-- Name: verification_identite id_verification; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_identite ALTER COLUMN id_verification SET DEFAULT nextval('public.verification_identite_id_verification_seq'::regclass);


--
-- Data for Name: annonce; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.annonce (id_annonce, titre_annonce, description_annonce, date, id_role_permission) FROM stdin;
\.


--
-- Data for Name: carte_bancaire; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.carte_bancaire (id_carte_bancaire, id_user, numero_carte, date_expiration, cvv, type_bancaire, status_bancaire) FROM stdin;
\.


--
-- Data for Name: commentaire; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.commentaire (id_commentaire, id_publication, id_user, contenu_commentaire, date_creation) FROM stdin;
\.


--
-- Data for Name: compte; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.compte (id_compte, id_user, type_compte, solde_compte, devise, numero_compte, date_creation_compte, statut) FROM stdin;
\.


--
-- Data for Name: contacts_enregistres; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.contacts_enregistres (id_contact, id_user, id_contact_user, nom_contact, numero_contact, date_ajout) FROM stdin;
\.


--
-- Data for Name: etablissement_sante; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.etablissement_sante (id_etablissement, telephone_etablissement_sante, nom_etablissement_sante, adresse_etablissement_sante, type_etablissement, email_etablissement_sante, mdp, id_localisation) FROM stdin;
\.


--
-- Data for Name: liker; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.liker (id_like, id_post_liker, id_user, date_liker) FROM stdin;
\.


--
-- Data for Name: liste_numero_etablissement_sante; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.liste_numero_etablissement_sante (id_liste_num_etablissement_sante, id_role_permission, nom_etablissement, contact, image, presentation, emplacement) FROM stdin;
\.


--
-- Data for Name: localisation; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.localisation (id_localisation, longitude, latitude, altitude) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.message (id_message, id_user, id_thematique, contenu_message, date) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.notification (id_notification, id_transaction, id_role_permission, contenu, montant, date_envoi, statut) FROM stdin;
\.


--
-- Data for Name: partages; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.partages (id_partage, id_publication, id_user, date_partage) FROM stdin;
\.


--
-- Data for Name: publication; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.publication (id_publication, id_user, titre_publication, contenu, image, date_publication) FROM stdin;
\.


--
-- Data for Name: publicite; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.publicite (id_pub, id_role_permission, titre, descript_pub, image_pub, date_debut_pub, date_fin_pub, statuts) FROM stdin;
\.


--
-- Data for Name: qr_code_paiement; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.qr_code_paiement (id_qrcode, id_user, montant, devise, qr_code_data, statut_qrcode, date_creation, expiration_qrcode) FROM stdin;
\.


--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.role_permission (id_role_permission, role, permission, description_role, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: thematiques; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.thematiques (id_thematique_discussion, titre_thematique, image, description, date_ajout) FROM stdin;
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.transaction (id_transaction, id_compte_recepteur, id_compte_expediteur, id_etablissement, id_carte_bancaire, montant, statut, devise_transaction, type_transaction, date_transaction) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.utilisateur (id_user, date_inscription, derniere_connexion, nom, prenom, email, telephone, pays, photo_profile, mdp) FROM stdin;
1	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Doe	John	john.doe@example.com	+2250102030405	C“te dIvoire	john.jpg	password123
2	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Smith	Jane	jane.smith@example.com	+2250203040506	S‚n‚gal	jane.jpg	password456
3	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Brown	Robert	robert.brown@example.com	+2250304050607	Mali	robert.jpg	password789
4	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Davis	Emily	emily.davis@example.com	+2250405060708	Togo	emily.jpg	passwordabc
5	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Wilson	Michael	michael.wilson@example.com	+2250506070809	Ghana	michael.jpg	passworddef
6	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Moore	Sarah	sarah.moore@example.com	+2250607080910	B‚nin	sarah.jpg	passwordghi
7	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Anderson	Laura	laura.anderson@example.com	+2250809101112	Cameroun	laura.jpg	passwordmno
8	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Thomas	David	david.thomas@example.com	+2250910111213	Burkina Faso	david.jpg	passwordpqr
9	2025-02-12 22:32:48.05715	2025-02-12 22:32:48.05715	Jackson	Sophia	sophia.jackson@example.com	+2251011121314	Guin‚e	sophia.jpg	passwordstu
10	2025-02-13 09:31:13.960526	\N	blabla	modi	blala.user@example.com	070704470707	italia	\N	\N
15	2025-02-17 15:02:34.097378	\N	koffi	Kkoffi paul	koffi@gmail.com	555555555555555	Côte d'ivoire	koffi.png	mdpkoffi
19	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Koeeeeffi	Paul	koeeeeffi@gmail.com	5555555555	Côte d'Ivoire	koffi.png	mdpkoffi
20	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Doe	John	john.doe@gmail.com	4444444444	USA	john.png	mdpjohn
21	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Traoré	Aminata	aminata.traore@gmail.com	6666666666	Mali	aminata.png	mdpaminata
22	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Nguyen	Linh	linh.nguyen@gmail.com	7777777777	Vietnam	linh.png	mdplinh
23	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Diallo	Mamadou	mamadou.diallo@gmail.com	8888888888	Guinée	mamadou.png	mdpmamadou
24	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Fernandez	Maria	maria.fernandez@gmail.com	9999999999	Espagne	maria.png	mdpmaria
25	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Smith	Alice	alice.smith@gmail.com	3333333333	Canada	alice.png	mdpalice
26	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Wang	Chen	chen.wang@gmail.com	2222222222	Chine	chen.png	mdpchen
27	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Kim	Ji-hoon	jihoon.kim@gmail.com	1111111111	Corée du Sud	jihoon.png	mdpjihoon
28	2025-02-17 15:56:08.573038	2025-02-17 15:56:08.573038	Hassan	Fatima	fatima.hassan@gmail.com	1234567890	Maroc	fatima.png	mdpfatima
\.


--
-- Data for Name: verification_compte; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.verification_compte (id_verif_compte, id_user, email, numero_telephone, date_verification, statut) FROM stdin;
\.


--
-- Data for Name: verification_identite; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.verification_identite (id_verification, id_user, type_verification, statut_verification, date_envoi, date_validation) FROM stdin;
\.


--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.annonce_id_annonce_seq', 1, false);


--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.carte_bancaire_id_carte_bancaire_seq', 1, false);


--
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.commentaire_id_commentaire_seq', 1, false);


--
-- Name: compte_id_compte_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.compte_id_compte_seq', 1, false);


--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.contacts_enregistres_id_contact_seq', 1, false);


--
-- Name: etablissement_sante_id_etablissement_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.etablissement_sante_id_etablissement_seq', 1, false);


--
-- Name: liker_id_like_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.liker_id_like_seq', 1, false);


--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq', 1, false);


--
-- Name: localisation_id_localisation_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.localisation_id_localisation_seq', 1, false);


--
-- Name: message_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.message_id_message_seq', 1, false);


--
-- Name: notification_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.notification_id_notification_seq', 1, false);


--
-- Name: partages_id_partage_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.partages_id_partage_seq', 1, false);


--
-- Name: publication_id_publication_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.publication_id_publication_seq', 1, false);


--
-- Name: publicite_id_pub_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.publicite_id_pub_seq', 1, false);


--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.qr_code_paiement_id_qrcode_seq', 1, false);


--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.role_permission_id_role_permission_seq', 1, false);


--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.thematiques_id_thematique_discussion_seq', 1, false);


--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.transaction_id_transaction_seq', 1, false);


--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.utilisateur_id_user_seq', 28, true);


--
-- Name: verification_compte_id_verif_compte_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.verification_compte_id_verif_compte_seq', 1, false);


--
-- Name: verification_identite_id_verification_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.verification_identite_id_verification_seq', 1, false);


--
-- Name: utilisateur UQ_80273015241cbddf8152908bd5b; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "UQ_80273015241cbddf8152908bd5b" UNIQUE (telephone);


--
-- Name: utilisateur UQ_e1136325a6b28e2a02b81b2f5e1; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "UQ_e1136325a6b28e2a02b81b2f5e1" UNIQUE (email);


--
-- Name: annonce annonce_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_pkey PRIMARY KEY (id_annonce);


--
-- Name: carte_bancaire carte_bancaire_numero_carte_key; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_numero_carte_key UNIQUE (numero_carte);


--
-- Name: carte_bancaire carte_bancaire_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_pkey PRIMARY KEY (id_carte_bancaire);


--
-- Name: commentaire commentaire_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_pkey PRIMARY KEY (id_commentaire);


--
-- Name: compte compte_numero_compte_key; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_numero_compte_key UNIQUE (numero_compte);


--
-- Name: compte compte_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_pkey PRIMARY KEY (id_compte);


--
-- Name: contacts_enregistres contacts_enregistres_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_pkey PRIMARY KEY (id_contact);


--
-- Name: etablissement_sante etablissement_sante_email_etablissement_sante_key; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante
    ADD CONSTRAINT etablissement_sante_email_etablissement_sante_key UNIQUE (email_etablissement_sante);


--
-- Name: etablissement_sante etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante
    ADD CONSTRAINT etablissement_sante_pkey PRIMARY KEY (id_etablissement);


--
-- Name: liker liker_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liker
    ADD CONSTRAINT liker_pkey PRIMARY KEY (id_like);


--
-- Name: liste_numero_etablissement_sante liste_numero_etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante
    ADD CONSTRAINT liste_numero_etablissement_sante_pkey PRIMARY KEY (id_liste_num_etablissement_sante);


--
-- Name: localisation localisation_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.localisation
    ADD CONSTRAINT localisation_pkey PRIMARY KEY (id_localisation);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id_message);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notification);


--
-- Name: partages partages_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.partages
    ADD CONSTRAINT partages_pkey PRIMARY KEY (id_partage);


--
-- Name: publication publication_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_pkey PRIMARY KEY (id_publication);


--
-- Name: publicite publicite_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT publicite_pkey PRIMARY KEY (id_pub);


--
-- Name: qr_code_paiement qr_code_paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.qr_code_paiement
    ADD CONSTRAINT qr_code_paiement_pkey PRIMARY KEY (id_qrcode);


--
-- Name: role_permission role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (id_role_permission);


--
-- Name: thematiques thematiques_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT thematiques_pkey PRIMARY KEY (id_thematique_discussion);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id_transaction);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_user);


--
-- Name: verification_compte verification_compte_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_compte
    ADD CONSTRAINT verification_compte_pkey PRIMARY KEY (id_verif_compte);


--
-- Name: verification_identite verification_identite_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_identite
    ADD CONSTRAINT verification_identite_pkey PRIMARY KEY (id_verification);


--
-- Name: annonce annonce_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES public.role_permission(id_role_permission);


--
-- Name: carte_bancaire carte_bancaire_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: commentaire commentaire_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;


--
-- Name: commentaire commentaire_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: compte compte_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_enregistres contacts_enregistres_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_enregistres contacts_enregistres_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_ibfk_2 FOREIGN KEY (id_contact_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: transaction fk_etablissement; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT fk_etablissement FOREIGN KEY (id_etablissement) REFERENCES public.etablissement_sante(id_etablissement);


--
-- Name: etablissement_sante fk_localisation; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante
    ADD CONSTRAINT fk_localisation FOREIGN KEY (id_localisation) REFERENCES public.localisation(id_localisation);


--
-- Name: liste_numero_etablissement_sante fk_rolepermission_listetablissement; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante
    ADD CONSTRAINT fk_rolepermission_listetablissement FOREIGN KEY (id_role_permission) REFERENCES public.role_permission(id_role_permission);


--
-- Name: liker liker_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liker
    ADD CONSTRAINT liker_ibfk_1 FOREIGN KEY (id_post_liker) REFERENCES public.publication(id_publication) ON DELETE CASCADE;


--
-- Name: liker liker_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.liker
    ADD CONSTRAINT liker_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: message message_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user);


--
-- Name: message message_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_ibfk_2 FOREIGN KEY (id_thematique) REFERENCES public.thematiques(id_thematique_discussion);


--
-- Name: notification notification_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_ibfk_1 FOREIGN KEY (id_transaction) REFERENCES public.transaction(id_transaction) ON DELETE CASCADE;


--
-- Name: notification notification_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_ibfk_2 FOREIGN KEY (id_role_permission) REFERENCES public.role_permission(id_role_permission) ON DELETE CASCADE;


--
-- Name: partages partages_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.partages
    ADD CONSTRAINT partages_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;


--
-- Name: partages partages_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.partages
    ADD CONSTRAINT partages_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: publication publication_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: publicite publicite_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT publicite_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES public.role_permission(id_role_permission) ON DELETE CASCADE;


--
-- Name: qr_code_paiement qr_code_paiement_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.qr_code_paiement
    ADD CONSTRAINT qr_code_paiement_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_1 FOREIGN KEY (id_compte_recepteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_2 FOREIGN KEY (id_compte_expediteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_3 FOREIGN KEY (id_carte_bancaire) REFERENCES public.carte_bancaire(id_carte_bancaire) ON DELETE SET NULL;


--
-- Name: verification_compte verification_compte_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_compte
    ADD CONSTRAINT verification_compte_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: verification_identite verification_identite_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.verification_identite
    ADD CONSTRAINT verification_identite_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

