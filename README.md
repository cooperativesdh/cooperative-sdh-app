# Cooperative SDH - Application de Gestion Immobilière

Système complet de gestion des coopératives immobilières avec multi-coopératives, adhésions, versements et génération automatique de décharges PDF signées.

## 🎯 Fonctionnalités

- ✅ Gestion multi-coopératives (5+ coopératives)
- ✅ Formulaire d'adhésion complet
- ✅ Recherche rapide d'adhérents
- ✅ Enregistrement versements mensuels
- ✅ **Génération PDF de décharges signées**
- ✅ **Export Excel automatique**
- ✅ Dashboard statistiques
- ✅ Authentification sécurisée (JWT)
- ✅ Gestion des responsables par coopérative

## 📋 Stack Technologique

- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL
- **PDF** : PDFKit + Signature numérique
- **Auth** : JWT
- **Export** : ExcelJS

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Installation

```bash
# Cloner le repo
git clone https://github.com/cooperativesdh/cooperative-sdh-app.git
cd cooperative-sdh-app

# Installer dépendances backend
cd backend
npm install

# Installer dépendances frontend
cd ../frontend
npm install
```

### Configuration

1. **Backend** - Créer `.env` dans `backend/` :
```
DATABASE_URL=postgresql://user:password@localhost:5432/cooperative_sdh
JWT_SECRET=votre_secret_jwt_complexe
NODE_ENV=development
PORT=5000
```

2. **Frontend** - Créer `.env.local` dans `frontend/` :
```
REACT_APP_API_URL=http://localhost:5000
```

### Lancer l'application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

L'app s'ouvre sur http://localhost:3000

## 📁 Structure du Projet

```
cooperative-sdh-app/
├── backend/
│   ├── src/
│   │   ├── models/         # Modèles DB
│   │   ├── routes/         # Routes API
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Auth, validation
│   │   ├── services/       # Services (PDF, Excel)
│   │   ├── utils/          # Utilitaires
��   │   └── index.ts        # Point d'entrée
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Pages
│   │   ├── components/     # Composants
│   │   ├── services/       # Appels API
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🔐 Authentification

Administrateurs se connectent avec Email + Mot de passe.
Accès limité à leurs coopératives.

## 📊 Génération de Décharges

1. Recherchez un adhérent
2. Entrez montant + date versement
3. Cliquez "Générer Décharge"
4. PDF signé téléchargé

**Signataires** : Benoît Célestin DIATTA ou Serge Olivier DIATTA

## 📈 Export Excel

Export mensuel/annuel des versements avec tous les détails.

## 🌐 Déploiement

- **Frontend** : Vercel (gratuit)
- **Backend** : Railway (gratuit)

---

**Version** : 1.0.0