# Guide de Déploiement - Cooperative SDH App

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Compte Railway (gratuit)
- Node.js 18+
- PostgreSQL 12+ (local ou cloud)

## 🗄️ Étape 1 : Configurer PostgreSQL

### Option 1 : PostgreSQL Local
```bash
# Créer la base de données
createdb cooperative_sdh

# Charger le schéma
psql cooperative_sdh < backend/src/utils/database.sql
```

### Option 2 : Railway PostgreSQL (Recommandé pour production)
1. Aller sur https://railway.app
2. Se connecter avec GitHub
3. Créer un nouveau projet
4. Ajouter PostgreSQL
5. Copier l'URL de connexion

## 🔧 Étape 2 : Configuration Backend

### Local
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos variables
npm install
npm run dev
```

### Production (Railway)
1. Créer un nouveau service Railway
2. Connecter à GitHub (ce repo)
3. Configurer les variables d'environnement :
   - DATABASE_URL (depuis PostgreSQL service)
   - JWT_SECRET
   - NODE_ENV=production
   - PORT=5000
4. Déployer

## 🎨 Étape 3 : Déploiement Frontend (Vercel)

```bash
# Depuis la racine du projet
cd frontend
npm run build
```

### Sur Vercel
1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Importer ce repo
4. Configurer :
   - Framework: Create React App
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Ajouter variable d'environnement :
     - REACT_APP_API_URL=<votre_api_railway_url>
5. Déployer

## 🌐 URLs Finales

- Frontend: https://votre-app.vercel.app
- Backend API: https://votre-api.railway.app

## 🐛 Troubleshooting

### Erreur: "Cannot find module"
```bash
cd backend
rm -rf node_modules
npm install
```

### Erreur de connexion DB
- Vérifier DATABASE_URL est correcte
- Vérifier que PostgreSQL est en marche
- Vérifier le firewall (Railway)

### CORS errors
- Vérifier REACT_APP_API_URL dans frontend .env
- Vérifier CLIENT_URL dans backend .env

## 📈 Monitoring

Railway et Vercel offrent des dashboards pour :
- Logs des erreurs
- Performance
- Trafic

---

**Besoin d'aide ?** Consultez la documentation :
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- PostgreSQL: https://www.postgresql.org/docs
