# Guide d'Utilisation - Cooperative SDH App

## 🚀 Démarrage

### Première utilisation
1. Accédez à l'application
2. Cliquez sur "S'inscrire"
3. Remplissez :
   - Nom complet
   - Nom de la coopérative
   - Email
   - Mot de passe
4. Confirmez

## 📊 Tableau de Bord

Affiche en temps réel :
- Nombre d'adhérents
- Nombre de versements
- Total collecté (F CFA)

Actions rapides :
- ➕ Ajouter un adhérent
- ➕ Enregistrer un versement

## 👥 Gestion des Adhérents

### Ajouter un adhérent
1. Cliquez sur "Adhérents"
2. Cliquez sur "Ajouter"
3. Remplissez le formulaire :
   - Prénom
   - Nom
   - Date de naissance
   - Lieu de naissance
   - Nationalité
   - N° CNI
   - Adresse
   - Profession
   - Téléphone
   - Email
4. Cliquez "Ajouter l'adhérent"

### Rechercher un adhérent
1. Utilisez la barre de recherche
2. Tapez le nom ou prénom
3. Résultats en temps réel

## 💰 Gestion des Versements

### Enregistrer un versement
1. Cliquez sur "Versements"
2. Cherchez l'adhérent dans la barre de recherche
3. Sélectionnez-le
4. Entrez :
   - Montant (en F CFA)
   - Date du versement
   - Motif (liste déroulante)
   - Signataire (Serge Olivier ou Benoît Célestin)
5. Cliquez "Enregistrer le versement"

### Générer une décharge (PDF)
1. Effectuez l'enregistrement du versement (étapes ci-dessus)
2. Ou cliquez directement sur "Générer la décharge (PDF)"
3. Le PDF se télécharge automatiquement
4. Imprimez et conservez l'original

**Contenu du PDF :**
- Nom du responsable
- Nom et CNI du bénéficiaire
- Montant en chiffres et en lettres
- Motif du versement
- Date et lieu
- Signature (à imprimer et signer)

## 📈 Export Excel

*(Fonctionnalité à ajouter)*

Permettrait d'exporter tous les versements d'un mois en format Excel.

## 🔐 Sécurité

- Chaque administrateur n'accède qu'à sa coopérative
- Les tokens JWT expirent après 7 jours
- Les mots de passe sont hashés en base de données
- Déconnexion automatique après inactivité (recommandé)

## 💡 Conseils d'utilisation

1. **Sauvegarde régulière** :
   - Exportez vos données mensuellement
   - Conservez les PDFs archivés

2. **Données à jour** :
   - Mettez à jour les informations des adhérents régulièrement
   - Enregistrez les versements immédiatement après réception

3. **Responsables** :
   - Un responsable par coopérative
   - Signature obligatoire sur les décharges
   - Archivage des PDFs signés

## ❓ FAQ

**Q: Puis-je modifier les informations d'un adhérent ?**
R: Pas encore dans cette version. Prochainement!

**Q: Combien d'adhérents peut accueillir l'app ?**
R: Illimité! Peut gérer 200+ adhérents facilement.

**Q: Peut-on gérer plusieurs coopératives ?**
R: Chaque admin gère sa coopérative. Pour gérer plusieurs, créez plusieurs comptes.

**Q: Comment imprimer les décharges ?**
R: Les PDFs générés peuvent être imprimés directement.

## 🆘 Support

En cas de problème :
1. Vérifiez votre connexion Internet
2. Rafraîchissez la page
3. Essayez un autre navigateur
4. Contactez l'administrateur système

---

**Dernière mise à jour** : Décembre 2024
