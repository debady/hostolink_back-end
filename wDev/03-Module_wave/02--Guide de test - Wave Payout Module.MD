# 🧪 Guide de test - Wave Payout Module

## 📋 **Prérequis avant les tests**

1. **Vérifiez que l'établissement ID 47 existe :**
```sql
SELECT * FROM user_etablissement_sante WHERE id_user_etablissement_sante = 47;
```

2. **Vérifiez qu'il a un compte :**
```sql
SELECT * FROM compte WHERE id_user_etablissement_sante = 47 AND type_user = 'etablissement';
```

3. **Donnez-lui un solde pour tester :**
```sql
UPDATE compte 
SET solde_compte = 100000 
WHERE id_user_etablissement_sante = 47 AND type_user = 'etablissement';
```

---

## 🔧 **1. Configuration du numéro Wave**

**POST** `http://localhost:3000/wave-payout/configure-wave/47`

```json
{
  "numero_wave": "+2250544704854"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Configuration Wave mise à jour",
  "data": {
    "message": "Numéro Wave mis à jour avec succès",
    "numero_wave": "+2250544704854",
    "wave_verified": false
  }
}
```

---

## 💰 **2. Vérification du solde**

**GET** `http://localhost:3000/wave-payout/balance/47`

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Solde récupéré avec succès",
  "data": {
    "solde_disponible": 100000,
    "limite_journaliere": 500000,
    "deja_retire_aujourd_hui": 0,
    "limite_restante_jour": 500000,
    "retrait_mensuel_cumule": 0,
    "plafond_mensuel": 2000000,
    "devise": "XOF"
  }
}
```

---

## 🔍 **3. Vérification des limites**

**GET** `http://localhost:3000/wave-payout/limits/47`

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Limites récupérées avec succès",
  "data": {
    "limite_journaliere": 500000,
    "limite_restante_jour": 500000,
    "deja_retire_aujourd_hui": 0,
    "retrait_mensuel_cumule": 0,
    "plafond_mensuel": 2000000,
    "montant_minimum": 100,
    "montant_maximum_par_transaction": 500000,
    "devise": "XOF"
  }
}
```

---

## 🚀 **4. Test de retrait Wave**

**POST** `http://localhost:3000/wave-payout/withdraw/47`

```json
{
  "amount": 5000,
  "numero_wave": "+2250544704854"
}
```

**Réponse attendue (si succès) :**
```json
{
  "success": true,
  "message": "Retrait Wave initié avec succès",
  "data": {
    "payoutId": "pt-1ye2wkdzg21ht",
    "idempotencyKey": "uuid-generated",
    "amount": "5000",
    "currency": "XOF",
    "mobile": "+2250544704854",
    "status": "succeeded",
    "createdAt": "2025-07-02T..."
  }
}
```

**Possible erreur si pas de numéro Wave configuré :**
```json
{
  "success": false,
  "message": "Numéro Wave non configuré",
  "error": "Numéro Wave non configuré"
}
```

---

## 📜 **5. Historique des retraits**

**GET** `http://localhost:3000/wave-payout/history/47`

**Réponse après un retrait :**
```json
{
  "success": true,
  "message": "Historique récupéré avec succès",
  "data": [
    {
      "id": 1,
      "id_user_etablissement_sante": 47,
      "idempotency_key": "uuid-generated",
      "currency": "XOF",
      "receive_amount": "5000",
      "name": "Nom de l'établissement",
      "mobile": "+2250544704854",
      "wave_payout_id": "pt-1ye2wkdzg21ht",
      "wave_fee": "2",
      "wave_status": "succeeded",
      "wave_timestamp": "2025-07-02T...",
      "created_at": "2025-07-02T...",
      "updated_at": "2025-07-02T..."
    }
  ]
}
```

---

## 📊 **6. Statut d'un retrait spécifique**

**GET** `http://localhost:3000/wave-payout/status/pt-1ye2wkdzg21ht`

**Réponse :**
```json
{
  "success": true,
  "data": {
    "payoutId": "pt-1ye2wkdzg21ht",
    "status": "succeeded",
    "amount": "5000",
    "currency": "XOF",
    "waveStatus": "succeeded",
    "waveFee": "2",
    "waveTimestamp": "2025-07-02T...",
    "isCompleted": true
  }
}
```

---

## ⚠️ **Cas d'erreurs à tester**

### **Montant insuffisant :**
```json
{
  "amount": 200000,
  "numero_wave": "+2250544704854"
}
```

### **Montant trop petit :**
```json
{
  "amount": 50,
  "numero_wave": "+2250544704854"
}
```

### **Numéro Wave invalide :**
```json
{
  "amount": 5000,
  "numero_wave": "0544704854"
}
```

---

## 🔧 **Pour activer les vrais retraits Wave**

1. **Ajoutez votre token Wave dans `.env` :**
```bash
WAVE_API_TOKEN=your_real_wave_token_here
```

2. **Activez la vérification Wave :**
```sql
UPDATE user_etablissement_sante 
SET wave_verified = true 
WHERE id_user_etablissement_sante = 47;
```

