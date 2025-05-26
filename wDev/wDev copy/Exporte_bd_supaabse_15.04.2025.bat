@echo off
:: Format de la date AAAA-MM-JJ
for /f %%i in ('wmic os get localdatetime ^| find "."') do set datetime=%%i
set today=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

:: Nom du fichier de dump avec date
set filename=dump_supabase_%today%.sql

:: Dossier de destination
set folder=C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink-pack\hostolink_back-end\wDev
set fullpath=%folder%\%filename%

:: Exporter la base
pg_dump --host=aws-0-eu-west-3.pooler.supabase.com --port=5432 --username=postgres.skwupmsitzsxukbmnkwv --dbname=postgres --file="%fullpath%" --no-password --format=plain --encoding=UTF8 --verbose


:: en cas de demande de mdp 6640ywfeiQqiBMM5
echo ✅ Export terminé : %fullpath%
pause
