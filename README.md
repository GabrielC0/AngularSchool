# 📚 Course Management App - Projet Angular M2

## 🎯 Présentation du Projet

Application de gestion de cours développée avec **Angular 20+** dans le cadre du Master 2. Cette application démontre l'utilisation des dernières fonctionnalités d'Angular incluant les **Standalone Components**, les **Signals**, et l'architecture **Domain-Driven Design (DDD)**.

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Autorisation
- **Système de connexion** : Login/Register avec formulaires réactifs
- **Gestion des rôles** : Étudiants et Administrateurs
- **Protection des routes** : Guards personnalisés (AuthGuard, AdminGuard, StudentGuard)
- **Persistance de session** : Stockage localStorage sécurisé

### 📖 Gestion des Cours
- **CRUD complet** : Création, lecture, modification, suppression des cours
- **Planning étudiant** : Vue personnalisée pour les étudiants
- **Gestion des professeurs** : Attribution et suivi
- **Présence** : Système de suivi des présences

### 🎨 Interface Utilisateur
- **Design moderne** : Interface responsive avec Tailwind CSS
- **UX optimisée** : Navigation intuitive et feedback utilisateur
- **Accessibilité** : Respect des bonnes pratiques d'accessibilité
- **Thème cohérent** : Design system uniforme

### ⚡ Architecture Technique
- **Standalone Components** : Architecture moderne sans NgModules
- **Signals** : Gestion d'état réactive avec Angular 20+
- **Lazy Loading** : Chargement à la demande des modules
- **Interceptors HTTP** : Gestion centralisée des erreurs et du loading
- **TypeScript strict** : Typage fort et qualité de code

## 🏗️ Architecture

```
📁 course-management-app/
├── 📁 src/app/
│   ├── 📁 components/          # Composants partagés
│   ├── 📁 features/            # Modules métier (DDD)
│   │   ├── 📁 auth/           # Authentification
│   │   ├── 📁 courses/        # Gestion des cours
│   │   ├── 📁 student/        # Espace étudiant
│   │   └── 📁 admin/          # Espace administrateur
│   ├── 📁 shared/             # Services et utilitaires
│   │   ├── 📁 guards/         # Protection des routes
│   │   ├── 📁 interceptors/   # Intercepteurs HTTP
│   │   ├── 📁 pipes/          # Pipes personnalisés
│   │   └── 📁 directives/     # Directives personnalisées
│   └── 📁 app.routes.ts       # Configuration du routing
├── 📁 api/                    # Backend Express.js
└── 📄 package.json           # Dépendances du projet
```

## 🚀 Technologies Utilisées

- **Frontend** : Angular 20+, TypeScript, Tailwind CSS
- **Backend** : Express.js, Node.js
- **Tests** : Jasmine, Karma
- **Qualité** : ESLint, TypeScript strict
- **Architecture** : Domain-Driven Design (DDD)

## 📊 Métriques de Qualité

- ✅ **0 erreur ESLint** - Code de qualité professionnelle
- ✅ **Build réussi** - Compilation sans erreur
- ✅ **Tests unitaires** - Couverture des composants critiques
- ✅ **TypeScript strict** - Typage fort et sécurisé
- ✅ **Architecture DDD** - Séparation claire des responsabilités

## 🎓 Objectifs Pédagogiques

Ce projet démontre la maîtrise de :
- **Angular moderne** (20+) avec les dernières fonctionnalités
- **Architecture DDD** et séparation des responsabilités
- **Gestion d'état** avec Signals
- **Qualité de code** avec ESLint et TypeScript strict
- **Tests unitaires** et bonnes pratiques de développement
- **UX/UI moderne** avec Tailwind CSS

## 📝 Note

Ce projet a été développé dans le cadre d'un projet final de Master 2, démontrant l'utilisation des technologies et patterns modernes en développement web avec Angular.

---

**Développé avec ❤️ en Angular 20+**