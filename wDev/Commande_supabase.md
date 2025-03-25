VOIR TOUTES LES TABLES
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';

SUPPRIMER TOUTES LES TABLES
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'spatial_ref_sys') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
        END LOOP;
    END $$;