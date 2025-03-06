DROP TABLE IF EXISTS public.commentaire CASCADE;
DROP TABLE IF EXISTS public.partage CASCADE;
DROP TABLE IF EXISTS public.publication CASCADE;


CREATE TABLE public.commentaire (
    id_commentaire bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_publication bigint NOT NULL,
    id_user bigint NOT NULL,
    contenu text NOT NULL,
    date_commentaire timestamp with time zone DEFAULT CURRENT_TIMESTAMP
) WITH (OIDS=FALSE);

CREATE TABLE public.partage (
    id_partage bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_publication bigint NOT NULL,
    id_user bigint NOT NULL,
    date_partage timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    lien_partage text,
    plateforme_partage text,
    nombre_clics integer DEFAULT 0
) WITH (OIDS=FALSE);

CREATE TABLE public.publication (
    id_publication bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_user bigint NOT NULL,
    titre_publication text NOT NULL,
    contenu text NOT NULL,
    image text,
    date_publication timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    compteur_like integer DEFAULT 0
) WITH (OIDS=FALSE);

ALTER TABLE public.commentaire 
    ADD CONSTRAINT commentaire_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;

ALTER TABLE public.commentaire 
    ADD CONSTRAINT commentaire_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE public.partage 
    ADD CONSTRAINT partages_ibfk_1 FOREIGN KEY (id_publication) REFERENCES public.publication(id_publication) ON DELETE CASCADE;

ALTER TABLE public.partage 
    ADD CONSTRAINT partages_ibfk_2 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE public.publication 
    ADD CONSTRAINT publication_ibfk_1 FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE public.commentaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication ENABLE ROW LEVEL SECURITY;


INSERT INTO public.publication (id_user, titre_publication, contenu, image, date_publication, compteur_like) VALUES
(110, 'Ma première publication.', 'Ceci est le contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-04 16:24:49.114', 0),
(110, 'Ma première publication.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-04 16:26:56.218', 0),
(110, 'Ma première publication.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 10:12:07.632', 0),
(109, 'Ma première publication.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 10:18:01.229', 0),
(110, 'Ma première publication 110.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 11:27:20.937', 2),
(108, 'Ma première publication.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 09:41:53.309', 3),
(109, 'Ma première publication.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 10:17:17.855', 1),
(114, 'Titre de ma publication', 'Contenu détaillé de la publication', 'http://example.com/image.jpg', '2025-03-05 09:52:24.183', 4),
(110, 'Ma première publication 110.', 'Ceci est contenu de ma première publication.', 'http://example.com/image.jpg', '2025-03-05 12:04:23.486', 0);

INSERT INTO public.commentaire (id_publication, id_user, contenu, date_commentaire) VALUES
(18, 110, 'C''est moi utilisateur 110', '2025-03-05 09:03:04.226237'),
(18, 110, 'C''est pas moi utilisateur 110', '2025-03-05 09:06:19.710216'),
(18, 110, 'non je rigole c''est moi le 110', '2025-03-05 09:06:48.891168'),
(18, 110, 'je suis sur la publication 4', '2025-03-05 09:08:03.295399'),
(18, 110, 'moi 105 je suis sur la publication 4', '2025-03-05 09:09:08.139871'),
(18, 110, 'moi 105 je suis sur la publication 5', '2025-03-05 09:09:21.759208'),
(18, 110, 'Ceci est un commentaire sur la publication', '2025-03-05 09:48:13.602408'),
(18, 110, 'Mon commentaire sur cette publication spécifique', '2025-03-05 09:57:50.761033'),
(18, 110, 'moi 110 je suis sur la publication 5', '2025-03-05 11:28:19.21156'),
(18, 110, 'Mon commentaire sur cette publication 5', '2025-03-05 11:29:31.523845'),
(18, 110, 'Mon commentaire sur cette publication 11', '2025-03-05 11:29:43.853643');


INSERT INTO public.partage (id_publication, id_user, date_partage, lien_partage, plateforme_partage, nombre_clics) VALUES
(18, 110, '2025-03-05 12:43:13.007666', 'undefined/shared/9e9ae8c6-e0b9-4b22-bfa3-fe118327fd60', 'Facebook', 0);

CREATE SEQUENCE public.partages_id_partage_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.partages_id_partage_seq OWNED BY public.partage.id_partage;