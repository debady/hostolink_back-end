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

--
-- Data for Name: etablissement_sante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etablissement_sante (id_etablissement, nom, telephone, categorie, adresse, creat_at, latitude, longitude, geom) FROM stdin;
4	Clinique Santé Plus	+2250102030405	chu	Abidjan, Cocody	2025-03-07 12:50:01.795437	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
5	rtrtghgghgh	+0000000000000000000	chu	Abidjan, chuine	2025-03-07 12:50:37.578837	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
10	rtrtghgghgh	+0000000000000000000	chu	Abidjan, chuine	2025-03-07 14:04:28.474484	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
11	rtrtghgghgh	+0000000000000000000	chu	Abidjan, chuine	2025-03-07 14:06:57.137415	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
12	rtrtghgghgh	+0000000000000000000	chu	Abidjan, chuine	2025-03-07 14:40:22.993151	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
13	rtrtghgghgh	+0000000000000000000	chu	Abidjan, chuine	2025-03-07 16:12:36.194461	0.3567	-1.8976	0101000020E6100000CD3B4ED1915CFEBFC0EC9E3C2CD4D63F
2	Clinique Santé Pro	+00000000	Clinique	Abidjan, Marcory	2025-03-07 12:48:40.237089	888.3345	-1.9923	0101000020E6100000FF21FDF675E0FFBF1904560EADC28B40
\.


--
-- Name: etablissement_sante_id_etablissement_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etablissement_sante_id_etablissement_seq', 13, true);


--
-- PostgreSQL database dump complete
--

