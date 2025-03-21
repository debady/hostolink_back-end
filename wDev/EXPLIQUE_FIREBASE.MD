CREER UNE CLE PRIVE,TELECHARGER ,RENOME ,PLACER DANS 
    /config
    ajouter FIREBASE_CREDENTIALS=config/firebase-admin-sdk.json dans .env

INSTALLER LA DEPENDANCE POUR ENVOI 
    npm install firebase-admin

CREER firebase.service.ts DANS config/ 
    et ajouter son code
    on ajouter son module dans app.module
    lancer le server 





    ---------------------
     

     ### 🚀 **Correction du problème d'installation de Google Cloud SDK**
Ton installation de **Google Cloud SDK** n'est pas reconnue dans le terminal. Voici comment résoudre ça :

---

### **1️⃣ Vérifier si Google Cloud SDK est bien installé**
Ouvre l'Explorateur de fichiers et va dans :
```
C:\Program Files (x86)\Google\Cloud SDK
```
Si le dossier **Cloud SDK** est présent, l’installation est correcte.

---

### **2️⃣ Ajouter `gcloud` au PATH manuellement**
Si `gcloud` n'est pas reconnu, il faut l'ajouter à la variable d'environnement **PATH**.

#### **🔹 Méthode 1 : Via la ligne de commande**
Dans **PowerShell**, exécute cette commande :
```powershell
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files (x86)\Google\Cloud SDK\bin", [System.EnvironmentVariableTarget]::Machine)
```
Ensuite, ferme et rouvre **PowerShell** et teste :
```powershell
gcloud --version
```

---

#### **🔹 Méthode 2 : Via les Paramètres Windows**
Si la méthode 1 ne marche pas :
1. **Ouvre le menu Démarrer** et cherche **"Variables d'environnement"**.
2. **Clique sur "Modifier les variables d'environnement du système"**.
3. **Dans "Variables système", cherche "Path"**, sélectionne-le et clique sur **Modifier**.
4. **Ajoute ce chemin** :
   ```
   C:\Program Files (x86)\Google\Cloud SDK\bin
   ```
5. **Valide, ferme et redémarre ton PC**.

---

### **3️⃣ Tester `gcloud` à nouveau**
Rouvre **PowerShell** et tape :
```powershell
gcloud --version
```
Si ça marche, tu devrais voir la version du SDK affichée.

---

### **4️⃣ Finaliser l'installation**
Si tout fonctionne, connecte-toi avec :
```powershell
gcloud auth login
```
Puis, restaure ton projet avec :
```powershell
gcloud projects undelete hostolink-2b120
```

Essaie ça et dis-moi si tu rencontres encore un souci ! 🚀