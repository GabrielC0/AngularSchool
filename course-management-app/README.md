# 🎓 Course Management App

Application de gestion de cours développée avec **Angular 20+** utilisant l'architecture **Domain-Driven Design (DDD)** et les dernières fonctionnalités d'Angular.

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** (version 18+)
- **npm** ou **yarn**
- **Angular CLI** (version 20+)

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd course-management-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

### Démarrage du Backend (API)

```bash
# Dans un terminal séparé
cd api
npm install
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
# Développement
npm start              # Démarre le serveur de développement
npm run build          # Compile l'application pour la production
npm run build:ssr      # Compile avec Server-Side Rendering

# Tests
npm test               # Lance les tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:ci        # Tests pour CI/CD

# Qualité de code
npm run lint           # Vérifie le code avec ESLint
npm run lint:fix       # Corrige automatiquement les erreurs ESLint
npm run format         # Formate le code avec Prettier

# Analyse
npm run analyze        # Analyse la taille du bundle
npm run lighthouse     # Audit de performance
```

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
src/
├── app/
│   ├── components/           # Composants partagés
│   │   └── home/            # Page d'accueil
│   ├── features/            # Modules métier (DDD)
│   │   ├── auth/           # Authentification
│   │   │   ├── auth.component.ts
│   │   │   └── auth.routes.ts
│   │   ├── courses/        # Gestion des cours
│   │   │   ├── components/ # Composants spécifiques
│   │   │   ├── models/     # Modèles de données
│   │   │   ├── services/   # Services métier
│   │   │   └── courses.routes.ts
│   │   ├── student/        # Espace étudiant
│   │   └── admin/          # Espace administrateur
│   ├── shared/             # Services et utilitaires partagés
│   │   ├── components/     # Composants réutilisables
│   │   ├── directives/     # Directives personnalisées
│   │   ├── guards/         # Protection des routes
│   │   ├── interceptors/   # Intercepteurs HTTP
│   │   ├── models/         # Modèles partagés
│   │   ├── pipes/          # Pipes personnalisés
│   │   └── services/       # Services globaux
│   ├── app.config.ts       # Configuration de l'application
│   ├── app.routes.ts       # Routes principales
│   └── app.ts              # Composant racine
├── assets/                 # Ressources statiques
├── styles.scss            # Styles globaux
└── index.html             # Point d'entrée HTML
```

## 🔐 Authentification

### Comptes de Test

**Administrateur :**
- Username: `admin`
- Password: `admin123`

**Étudiant :**
- Username: `testuser`
- Password: `password123`

### Système de Rôles

- **Admin** : Accès complet à toutes les fonctionnalités
- **Student** : Accès limité à son espace personnel et planning

## 🛠️ Technologies Utilisées

### Frontend
- **Angular 20+** - Framework principal
- **TypeScript** - Langage de programmation
- **Tailwind CSS** - Framework CSS
- **RxJS** - Programmation réactive
- **Angular Signals** - Gestion d'état réactive

### Backend
- **Express.js** - Serveur Node.js
- **CORS** - Configuration cross-origin
- **JSON** - Format de données

### Outils de Développement
- **Angular CLI** - Outils de développement
- **ESLint** - Analyse de code
- **Jasmine/Karma** - Tests unitaires
- **Git** - Contrôle de version

## 📋 Fonctionnalités Détaillées

### 🔐 Authentification
- **Login/Register** : Formulaires réactifs avec validation
- **Guards** : Protection des routes selon les rôles
- **Session** : Persistance avec localStorage
- **Validation** : Validation en temps réel

### 📚 Gestion des Cours
- **CRUD Complet** : Création, lecture, modification, suppression
- **Planning** : Gestion des horaires et salles
- **Professeurs** : Attribution et gestion
- **Présence** : Suivi des présences étudiants

### 🎨 Interface Utilisateur
- **Responsive Design** : Compatible mobile et desktop
- **Thème moderne** : Interface utilisateur intuitive
- **Feedback utilisateur** : Messages de succès/erreur
- **Accessibilité** : Respect des standards WCAG

## 🧪 Tests

### Tests Unitaires
```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Tests d'Intégration
- Tests des composants avec TestBed
- Tests des services avec mocks
- Tests des pipes et directives
- Tests des guards et interceptors

## 🔧 Configuration

### ESLint
Configuration stricte pour maintenir la qualité du code :
- Règles TypeScript strictes
- Règles Angular spécifiques
- Formatage automatique

### TypeScript
- Configuration stricte activée
- Pas d'utilisation de `any`
- Typage fort pour tous les composants

### Tailwind CSS
- Configuration personnalisée
- Classes utilitaires
- Design system cohérent

## 📊 Métriques de Qualité

- ✅ **0 erreur ESLint** - Code de qualité professionnelle
- ✅ **TypeScript strict** - Typage fort et sécurisé
- ✅ **Build réussi** - Compilation sans erreur
- ✅ **Tests unitaires** - Couverture des composants critiques
- ✅ **Architecture DDD** - Séparation claire des responsabilités

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

### Variables d'Environnement
Créer un fichier `src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.com'
};
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est développé dans le cadre d'un projet académique de Master 2.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation Angular
2. Consulter les issues GitHub
3. Contacter l'équipe de développement

---

**Développé avec ❤️ en Angular 20+**