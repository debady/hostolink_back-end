--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

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
-- Name: compte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compte (
    id_compte integer NOT NULL,
    solde_compte integer DEFAULT 0,
    solde_bonus integer DEFAULT 0,
    cumule_mensuel integer DEFAULT 0,
    plafond integer DEFAULT 100000,
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
-- Name: compte id_compte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compte ALTER COLUMN id_compte SET DEFAULT nextval('public.compte_id_compte_seq'::regclass);


--
-- Name: qr_code_paiement_dynamique id_qrcode; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_id_qrcode_seq'::regclass);


--
-- Name: qr_code_paiement_statique id_qrcode; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_statique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_statique_id_qrcode_seq'::regclass);


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
-- Name: qr_code_paiement_dynamique fk_qr_code_dynamique_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_dynamique_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


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
-- Name: qr_code_paiement_statique fk_qr_code_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT fk_qr_code_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

