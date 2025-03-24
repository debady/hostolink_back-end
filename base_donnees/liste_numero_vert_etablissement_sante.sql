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
    site_web character varying(255),
    categorie character varying(50) DEFAULT 'Autre'::character varying NOT NULL
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
-- Name: liste_numero_vert_etablissement_sante id_liste_num_etablissement_sante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante ALTER COLUMN id_liste_num_etablissement_sante SET DEFAULT nextval('public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq'::regclass);


--
-- Name: liste_numero_vert_etablissement_sante liste_numero_vert_etablissement_sante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT liste_numero_vert_etablissement_sante_pkey PRIMARY KEY (id_liste_num_etablissement_sante);


--
-- Name: liste_numero_vert_etablissement_sante fk_liste_numero_vert_admin_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT fk_liste_numero_vert_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

