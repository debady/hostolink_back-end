
- recup taff autres branches 
- regler les conflits et pusher sur la branches master 
- enoyer les new tables de la bd sur supaabse 
- regler les conflits 
- tester les endpoints en lignes
- voir le doc réçu 

- se baser dessus et faire  le programme de la semaine prochaine 

Inserer des utilisateur dans la table supabase 

    INSERT INTO public.utilisateur (email, telephone, mdp, nom, prenom, pays, compte_verifier)
    VALUES 
    ('mohamed.traore@example.com', '2234567890', '1234', 'Traore', 'Mohamed', 'Mali', true),
    ('fatou.diallo@example.com', '2212345678', '5678', 'Diallo', 'Fatou', 'Sénégal', true),
    ('kofi.adu@example.com', '2334567890', '9101', 'Adu', 'Kofi', 'Ghana', true),
    ('linda.nkosi@example.com', '2712345678', '1213', 'Nkosi', 'Linda', 'Afrique du Sud', true),
    ('ahmed.benali@example.com', '2161234567', '1415', 'Benali', 'Ahmed', 'Tunisie', true),
    ('sara.oumar@example.com', '2271234567', '1617', 'Oumar', 'Sara', 'Niger', true),
    ('peter.nyaga@example.com', '2541234567', '1819', 'Nyaga', 'Peter', 'Kenya', true),
    ('nina.mutiso@example.com', '2547654321', '2021', 'Mutiso', 'Nina', 'Kenya', true),
    ('youssef.elhaj@example.com', '2121234567', '2223', 'Elhaj', 'Youssef', 'Maroc', true),
    ('aisha.mohammed@example.com', '2511234567', '2425', 'Mohammed', 'Aisha', 'Éthiopie', true);