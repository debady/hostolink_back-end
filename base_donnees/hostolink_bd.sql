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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_gestionnaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_gestionnaire (
    id_role_permission integer NOT NULL,
    role character varying(100) NOT NULL,
    permission text NOT NULL,
    description_role text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_gestionnaire OWNER TO postgres;

--
-- Name: annonce; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annonce (
    id_annonce integer NOT NULL,
    titre_annonce character varying(255) NOT NULL,
    description_annonce text,
    date date NOT NULL,
    id_role_permission integer,
    image character varying(255) DEFAULT 'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740240611/hostolink/eka2tnnq53o4bk7acvmg.jpg'::character varying
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
-- Name: carte_bancaire; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.carte_bancaire OWNER TO postgres;

--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carte_bancaire_id_carte_bancaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carte_bancaire_id_carte_bancaire_seq OWNER TO postgres;

--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carte_bancaire_id_carte_bancaire_seq OWNED BY public.carte_bancaire.id_carte_bancaire;


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
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commentaire_id_commentaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commentaire_id_commentaire_seq OWNER TO postgres;

--
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commentaire_id_commentaire_seq OWNED BY public.commentaire.id_commentaire;


--
-- Name: compte; Type: TABLE; Schema: public; Owner: postgres
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
-- Name: contacts_enregistres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts_enregistres (
    id_contact integer NOT NULL,
    id_user integer NOT NULL,
    id_contact_user integer NOT NULL,
    nom_contact character varying(255),
    numero_contact character varying(20),
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contacts_enregistres OWNER TO postgres;

--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_enregistres_id_contact_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_enregistres_id_contact_seq OWNER TO postgres;

--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_enregistres_id_contact_seq OWNED BY public.contacts_enregistres.id_contact;


--
-- Name: etablissement_sante; Type: TABLE; Schema: public; Owner: dev_sohapigroup
--

CREATE TABLE public.etablissement_sante (
    id_etablissement integer NOT NULL,
    nom character varying(255) NOT NULL,
    telephone character varying(20),
    categorie character varying(100),
    adresse text NOT NULL,
    creat_at timestamp without time zone DEFAULT now() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    geom public.geometry(Point,4326) NOT NULL
);


ALTER TABLE public.etablissement_sante OWNER TO dev_sohapigroup;

--
-- Name: etablissement_sante_id_etablissement_seq1; Type: SEQUENCE; Schema: public; Owner: dev_sohapigroup
--

CREATE SEQUENCE public.etablissement_sante_id_etablissement_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etablissement_sante_id_etablissement_seq1 OWNER TO dev_sohapigroup;

--
-- Name: etablissement_sante_id_etablissement_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_sohapigroup
--

ALTER SEQUENCE public.etablissement_sante_id_etablissement_seq1 OWNED BY public.etablissement_sante.id_etablissement;


--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id_image uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    url_image character varying NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: liste_numero_etablissement_sante; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.liste_numero_etablissement_sante OWNER TO postgres;

--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq OWNER TO postgres;

--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq OWNED BY public.liste_numero_etablissement_sante.id_liste_num_etablissement_sante;


--
-- Name: message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message (
    id_message integer NOT NULL,
    id_user integer,
    id_thematique integer,
    contenu_message text,
    date timestamp without time zone
);


ALTER TABLE public.message OWNER TO postgres;

--
-- Name: message_id_message_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_id_message_seq OWNER TO postgres;

--
-- Name: message_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_id_message_seq OWNED BY public.message.id_message;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_notification_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_notification_seq OWNER TO postgres;

--
-- Name: notification_id_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_notification_seq OWNED BY public.notification.id_notification;


--
-- Name: otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp (
    id integer NOT NULL,
    user_id integer NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_valid boolean DEFAULT true NOT NULL
);


ALTER TABLE public.otp OWNER TO postgres;

--
-- Name: otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_id_seq OWNER TO postgres;

--
-- Name: otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_id_seq OWNED BY public.otp.id;


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
    nombre_clics integer DEFAULT 0
);


ALTER TABLE public.partage OWNER TO postgres;

--
-- Name: partages_id_partage_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partages_id_partage_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partages_id_partage_seq OWNER TO postgres;

--
-- Name: partages_id_partage_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partages_id_partage_seq OWNED BY public.partage.id_partage;


--
-- Name: publication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publication (
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    titre_publication character varying(255) NOT NULL,
    contenu text NOT NULL,
    image character varying(255),
    date_publication timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    compteur_like integer DEFAULT 0
);


ALTER TABLE public.publication OWNER TO postgres;

--
-- Name: publication_id_publication_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publication_id_publication_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_id_publication_seq OWNER TO postgres;

--
-- Name: publication_id_publication_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publication_id_publication_seq OWNED BY public.publication.id_publication;


--
-- Name: publicite; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.publicite OWNER TO postgres;

--
-- Name: publicite_id_pub_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publicite_id_pub_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicite_id_pub_seq OWNER TO postgres;

--
-- Name: publicite_id_pub_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publicite_id_pub_seq OWNED BY public.publicite.id_pub;


--
-- Name: qr_code_paiement; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.qr_code_paiement OWNER TO postgres;

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

ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNED BY public.qr_code_paiement.id_qrcode;


--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_permission_id_role_permission_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permission_id_role_permission_seq OWNER TO postgres;

--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_permission_id_role_permission_seq OWNED BY public.admin_gestionnaire.id_role_permission;


--
-- Name: thematiques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thematiques (
    id_thematique_discussion integer NOT NULL,
    titre_thematique character varying(255) NOT NULL,
    image character varying(255),
    description text NOT NULL,
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
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.transaction OWNER TO postgres;

--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_id_transaction_seq OWNER TO postgres;

--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_id_transaction_seq OWNED BY public.transaction.id_transaction;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id_user integer NOT NULL,
    date_inscription timestamp without time zone DEFAULT now() NOT NULL,
    code_confirmation character varying(10),
    "position" public.geometry(Point,4326),
    email character varying(255),
    telephone character varying(20),
    mdp character varying(255),
    nom character varying(255),
    prenom character varying(255),
    pays character varying(100),
    photo_profile character varying(255)
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_user_seq OWNER TO postgres;

--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_user_seq OWNED BY public.utilisateur.id_user;


--
-- Name: admin_gestionnaire id_role_permission; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_gestionnaire ALTER COLUMN id_role_permission SET DEFAULT nextval('public.role_permission_id_role_permission_seq'::regclass);


--
-- Name: annonce id_annonce; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce ALTER COLUMN id_annonce SET DEFAULT nextval('public.annonce_id_annonce_seq'::regclass);


--
-- Name: carte_bancaire id_carte_bancaire; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_bancaire ALTER COLUMN id_carte_bancaire SET DEFAULT nextval('public.carte_bancaire_id_carte_bancaire_seq'::regclass);


--
-- Name: commentaire id_commentaire; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaire ALTER COLUMN id_commentaire SET DEFAULT nextval('public.commentaire_id_commentaire_seq'::regclass);


--
-- Name: compte id_compte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte ALTER COLUMN id_compte SET DEFAULT nextval('public.compte_id_compte_seq'::regclass);


--
-- Name: contacts_enregistres id_contact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_enregistres ALTER COLUMN id_contact SET DEFAULT nextval('public.contacts_enregistres_id_contact_seq'::regclass);


--
-- Name: etablissement_sante id_etablissement; Type: DEFAULT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante ALTER COLUMN id_etablissement SET DEFAULT nextval('public.etablissement_sante_id_etablissement_seq1'::regclass);


--
-- Name: liste_numero_etablissement_sante id_liste_num_etablissement_sante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante ALTER COLUMN id_liste_num_etablissement_sante SET DEFAULT nextval('public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq'::regclass);


--
-- Name: message id_message; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message ALTER COLUMN id_message SET DEFAULT nextval('public.message_id_message_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: notification id_notification; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id_notification SET DEFAULT nextval('public.notification_id_notification_seq'::regclass);


--
-- Name: otp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp ALTER COLUMN id SET DEFAULT nextval('public.otp_id_seq'::regclass);


--
-- Name: partage id_partage; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage ALTER COLUMN id_partage SET DEFAULT nextval('public.partages_id_partage_seq'::regclass);


--
-- Name: publication id_publication; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication ALTER COLUMN id_publication SET DEFAULT nextval('public.publication_id_publication_seq'::regclass);


--
-- Name: publicite id_pub; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicite ALTER COLUMN id_pub SET DEFAULT nextval('public.publicite_id_pub_seq'::regclass);


--
-- Name: qr_code_paiement id_qrcode; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_id_qrcode_seq'::regclass);


--
-- Name: thematiques id_thematique_discussion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thematiques ALTER COLUMN id_thematique_discussion SET DEFAULT nextval('public.thematiques_id_thematique_discussion_seq'::regclass);


--
-- Name: transaction id_transaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id_transaction SET DEFAULT nextval('public.transaction_id_transaction_seq'::regclass);


--
-- Name: utilisateur id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id_user SET DEFAULT nextval('public.utilisateur_id_user_seq'::regclass);


--
-- Data for Name: admin_gestionnaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_gestionnaire (id_role_permission, role, permission, description_role, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: annonce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annonce (id_annonce, titre_annonce, description_annonce, date, id_role_permission, image) FROM stdin;
\.


--
-- Data for Name: carte_bancaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carte_bancaire (id_carte_bancaire, id_user, numero_carte, date_expiration, cvv, type_bancaire, status_bancaire) FROM stdin;
\.


--
-- Data for Name: commentaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commentaire (id_commentaire, id_publication, id_user, contenu, date_commentaire) FROM stdin;
\.


--
-- Data for Name: compte; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compte (id_compte, id_user, type_compte, solde_compte, devise, numero_compte, date_creation_compte, statut) FROM stdin;
\.


--
-- Data for Name: contacts_enregistres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts_enregistres (id_contact, id_user, id_contact_user, nom_contact, numero_contact, date_ajout) FROM stdin;
\.


--
-- Data for Name: etablissement_sante; Type: TABLE DATA; Schema: public; Owner: dev_sohapigroup
--

COPY public.etablissement_sante (id_etablissement, nom, telephone, categorie, adresse, creat_at, latitude, longitude, geom) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id_image, date, url_image) FROM stdin;
\.


--
-- Data for Name: liste_numero_etablissement_sante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liste_numero_etablissement_sante (id_liste_num_etablissement_sante, id_role_permission, nom_etablissement, contact, image, presentation, emplacement) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message (id_message, id_user, id_thematique, contenu_message, date) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id_notification, id_transaction, id_role_permission, contenu, montant, date_envoi, statut) FROM stdin;
\.


--
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp (id, user_id, otp_code, expires_at, is_valid) FROM stdin;
\.


--
-- Data for Name: partage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partage (id_partage, id_publication, id_user, date_partage, lien_partage, plateforme_partage, nombre_clics) FROM stdin;
\.


--
-- Data for Name: publication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publication (id_publication, id_user, titre_publication, contenu, image, date_publication, compteur_like) FROM stdin;
\.


--
-- Data for Name: publicite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publicite (id_pub, id_role_permission, titre, descript_pub, image_pub, date_debut_pub, date_fin_pub, statuts) FROM stdin;
\.


--
-- Data for Name: qr_code_paiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.qr_code_paiement (id_qrcode, id_user, montant, devise, qr_code_data, statut_qrcode, date_creation, expiration_qrcode) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: thematiques; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thematiques (id_thematique_discussion, titre_thematique, image, description, date_ajout) FROM stdin;
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction (id_transaction, id_compte_recepteur, id_compte_expediteur, id_etablissement, id_carte_bancaire, montant, statut, devise_transaction, type_transaction, date_transaction) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (id_user, date_inscription, code_confirmation, "position", email, telephone, mdp, nom, prenom, pays, photo_profile) FROM stdin;
\.


--
-- Name: annonce_id_annonce_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annonce_id_annonce_seq', 1, false);


--
-- Name: carte_bancaire_id_carte_bancaire_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carte_bancaire_id_carte_bancaire_seq', 1, false);


--
-- Name: commentaire_id_commentaire_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commentaire_id_commentaire_seq', 15, true);


--
-- Name: compte_id_compte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compte_id_compte_seq', 1, false);


--
-- Name: contacts_enregistres_id_contact_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_enregistres_id_contact_seq', 1, false);


--
-- Name: etablissement_sante_id_etablissement_seq1; Type: SEQUENCE SET; Schema: public; Owner: dev_sohapigroup
--

SELECT pg_catalog.setval('public.etablissement_sante_id_etablissement_seq1', 2, true);


--
-- Name: liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liste_numero_etablissement_sa_id_liste_num_etablissement_sa_seq', 1, false);


--
-- Name: message_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_id_message_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: notification_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_notification_seq', 1, false);


--
-- Name: otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_id_seq', 9, true);


--
-- Name: partages_id_partage_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partages_id_partage_seq', 2, true);


--
-- Name: publication_id_publication_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publication_id_publication_seq', 14, true);


--
-- Name: publicite_id_pub_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publicite_id_pub_seq', 1, false);


--
-- Name: qr_code_paiement_id_qrcode_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qr_code_paiement_id_qrcode_seq', 1, false);


--
-- Name: role_permission_id_role_permission_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permission_id_role_permission_seq', 1, false);


--
-- Name: thematiques_id_thematique_discussion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thematiques_id_thematique_discussion_seq', 1, false);


--
-- Name: transaction_id_transaction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_id_transaction_seq', 1, false);


--
-- Name: utilisateur_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_user_seq', 1, false);


--
-- Name: etablissement_sante PK_28872ffe39dc5f7355edde5b1cb; Type: CONSTRAINT; Schema: public; Owner: dev_sohapigroup
--

ALTER TABLE ONLY public.etablissement_sante
    ADD CONSTRAINT "PK_28872ffe39dc5f7355edde5b1cb" PRIMARY KEY (id_etablissement);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: utilisateur UQ_80273015241cbddf8152908bd5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "UQ_80273015241cbddf8152908bd5b" UNIQUE (telephone);


--
-- Name: utilisateur UQ_e1136325a6b28e2a02b81b2f5e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "UQ_e1136325a6b28e2a02b81b2f5e1" UNIQUE (email);


--
-- Name: annonce annonce_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_pkey PRIMARY KEY (id_annonce);


--
-- Name: carte_bancaire carte_bancaire_numero_carte_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_numero_carte_key UNIQUE (numero_carte);


--
-- Name: carte_bancaire carte_bancaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_pkey PRIMARY KEY (id_carte_bancaire);


--
-- Name: commentaire commentaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_pkey PRIMARY KEY (id_commentaire);


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
-- Name: contacts_enregistres contacts_enregistres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_pkey PRIMARY KEY (id_contact);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id_image);


--
-- Name: liste_numero_etablissement_sante liste_numero_etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante
    ADD CONSTRAINT liste_numero_etablissement_sante_pkey PRIMARY KEY (id_liste_num_etablissement_sante);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id_message);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id_notification);


--
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (id);


--
-- Name: publication publication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_pkey PRIMARY KEY (id_publication);


--
-- Name: publicite publicite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT publicite_pkey PRIMARY KEY (id_pub);


--
-- Name: qr_code_paiement qr_code_paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement
    ADD CONSTRAINT qr_code_paiement_pkey PRIMARY KEY (id_qrcode);


--
-- Name: admin_gestionnaire role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_gestionnaire
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (id_role_permission);


--
-- Name: thematiques thematiques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT thematiques_pkey PRIMARY KEY (id_thematique_discussion);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id_transaction);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_user);


--
-- Name: otp FK_258d028d322ea3b856bf9f12f25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY (user_id) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: annonce annonce_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES public.admin_gestionnaire(id_role_permission);


--
-- Name: carte_bancaire carte_bancaire_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_bancaire
    ADD CONSTRAINT carte_bancaire_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: commentaire commentaire_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;


--
-- Name: commentaire commentaire_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaire
    ADD CONSTRAINT commentaire_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: compte compte_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_enregistres contacts_enregistres_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: contacts_enregistres contacts_enregistres_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts_enregistres
    ADD CONSTRAINT contacts_enregistres_ibfk_2 FOREIGN KEY (id_contact_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: liste_numero_etablissement_sante fk_rolepermission_listetablissement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_etablissement_sante
    ADD CONSTRAINT fk_rolepermission_listetablissement FOREIGN KEY (id_role_permission) REFERENCES public.admin_gestionnaire(id_role_permission);


--
-- Name: message message_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user);


--
-- Name: message message_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_ibfk_2 FOREIGN KEY (id_thematique) REFERENCES public.thematiques(id_thematique_discussion);


--
-- Name: notification notification_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_ibfk_1 FOREIGN KEY (id_transaction) REFERENCES public.transaction(id_transaction) ON DELETE CASCADE;


--
-- Name: notification notification_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_ibfk_2 FOREIGN KEY (id_role_permission) REFERENCES public.admin_gestionnaire(id_role_permission) ON DELETE CASCADE;


--
-- Name: partage partages_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage
    ADD CONSTRAINT partages_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;


--
-- Name: partage partages_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partage
    ADD CONSTRAINT partages_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: publication publication_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: publicite publicite_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT publicite_ibfk_1 FOREIGN KEY (id_role_permission) REFERENCES public.admin_gestionnaire(id_role_permission) ON DELETE CASCADE;


--
-- Name: qr_code_paiement qr_code_paiement_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement
    ADD CONSTRAINT qr_code_paiement_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_1 FOREIGN KEY (id_compte_recepteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_2 FOREIGN KEY (id_compte_expediteur) REFERENCES public.compte(id_compte) ON DELETE CASCADE;


--
-- Name: transaction transaction_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_ibfk_3 FOREIGN KEY (id_carte_bancaire) REFERENCES public.carte_bancaire(id_carte_bancaire) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

