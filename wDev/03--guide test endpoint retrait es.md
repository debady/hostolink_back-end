# 🌊 Guide - Système OTP Wave automatisé

## 🚀 **Workflow automatique complet :**

### **1. Configuration numéro Wave + Envoi OTP**
```http
POST http://localhost:3000/wave-payout/configure-wave/47
Content-Type: application/json

{
  "numero_wave": "+2250544704854"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Configuration Wave mise à jour et OTP envoyé",
  "data": {
    "message": "Numéro Wave configuré. Un code de vérification a été envoyé par email.",
    "numero_wave": "+2250544704854",
    "wave_verified": false,
    "otp_sent": true,
    "expires_in_minutes": 10
  }
}
```

### **2. Vérification du code OTP (4 chiffres reçus par email)**
```http
POST http://localhost:3000/wave-payout/verify-otp/47
Content-Type: application/json

{
  "otp_code": "1234"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Compte Wave vérifié et activé avec succès",
  "data": {
    "message": "Compte Wave vérifié et activé avec succès",
    "numero_wave": "+2250544704854",
    "wave_verified": true
  }
}
```

### **3. Maintenant possible de faire des retraits**
```http
POST http://localhost:3000/wave-payout/withdraw/47
Content-Type: application/json

{
  "amount": 500,
  "numero_wave": "+2250544704854"
}
```

---

## 📧 **Emails automatiques envoyés :**

### **Email 1 : Code de vérification OTP**
- ✉️ Sujet : "🌊 Vérification compte Wave - Hostolink"
- 🔢 Contient le code OTP à 4 chiffres
- ⏰ Valable 10 minutes
- 🎨 Design responsive avec branding Hostolink

### **Email 2 : Confirmation d'activation**
- ✉️ Sujet : "✅ Compte Wave activé - Hostolink"
- 🎉 Confirme l'activation du compte Wave
- 📋 Liste des fonctionnalités disponibles
- 💡 Conseils de sécurité

---

## 🔄 **Endpoints supplémentaires :**

### **Renvoyer un OTP (si expiré/perdu)**
```http
POST http://localhost:3000/wave-payout/resend-otp/47
```

**Réponse :**
```json
{
  "success": true,
  "message": "Nouveau code OTP envoyé par email",
  "data": {
    "message": "Code OTP envoyé par email",
    "expires_in_minutes": 10
  }
}
```

---

## ⚠️ **Gestion des erreurs :**

### **Code OTP invalide :**
```json
{
  "success": false,
  "message": "Code OTP invalide",
  "error": "Code OTP invalide"
}
```

### **Code OTP expiré :**
```json
{
  "success": false,
  "message": "Code OTP expiré",
  "error": "Code OTP expiré"
}
```

### **Compte déjà vérifié :**
```json
{
  "success": false,
  "message": "Compte Wave déjà vérifié",
  "error": "Compte Wave déjà vérifié"
}
```

---

## 📊 **Avantages du système automatisé :**

✅ **Plus d'intervention admin manuelle**
✅ **Vérification instantanée par email**
✅ **Sécurité renforcée avec OTP temporaire**
✅ **Emails de confirmation automatiques**
✅ **Expérience utilisateur fluide**
✅ **Traçabilité complète en base**

---

## 🔧 **Configuration requise :**

1. **Email SMTP configuré** (Hostinger déjà OK)
2. **Entité OTP** (déjà existante)
3. **Base données** tables mises à jour
4. **Modules importés** dans app.module.ts

---

## 📱 **Ordre de test recommandé :**

1. ✅ Configurer numéro Wave (reçoit OTP)
2. ✅ Vérifier email reçu avec code
3. ✅ Valider OTP dans l'app
4. ✅ Confirmer activation par email
5. ✅ Tester retrait Wave
6. ✅ Tester cas d'erreurs (mauvais OTP, expiré, etc.)

**🎯 Le système est maintenant 100% automatisé !**