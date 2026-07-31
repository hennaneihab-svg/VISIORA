# VISIORA — Agence Créative Premium

VISIORA est le site vitrine haut de gamme et responsive d'une agence créative spécialisée dans la production de vidéos de marque, de photographie d'art et d'identités visuelles au positionnement cinématographique.

Le site est entièrement statique (HTML5, CSS3, JavaScript vanilla) et intègre des animations cinématiques sophistiquées via la bibliothèque **GSAP (GreenSock) + ScrollTrigger**.

---

## 📁 Structure du Projet

```text
VISIORA/
│
├── index.html                   # Page d'accueil (avec intro loader animé)
├── about.html                   # Page "À propos" (mise en page éditoriale magazine)
├── services.html                # Page Services (détail des 7 expertises)
├── portfolio.html               # Page Portfolio (galerie filtrable JS + lightbox)
├── process.html                 # Page Processus (timeline verticale de collaboration)
├── testimonials.html            # Page Témoignages (carrousel avec swipe mobile)
├── contact.html                 # Page Contact (formulaire Web3Forms + Google Maps)
├── template.html                # Template HTML de structure commune
├── .gitignore                   # Fichier d'exclusion Git
└── README.md                    # Documentation du projet
│
├── components/                  # Éléments réutilisables chargés dynamiquement
│   ├── header.html              # En-tête de navigation responsive avec menu burger
│   └── footer.html              # Pied de page avec coordonnées, itinéraire et réseaux
│
└── assets/
    ├── css/
    │   ├── style.css            # Styles globaux, variables :root, header & footer
    │   ├── home.css             # Styles de la page d'accueil
    │   ├── about.css            # Styles de la page À propos
    │   ├── services.css         # Styles de la page Services
    │   ├── portfolio.css        # Styles de la galerie et de la lightbox
    │   ├── process.css          # Styles de la timeline
    │   ├── testimonials.css     # Styles du carrousel de témoignages
    │   └── contact.css          # Styles du formulaire et de la carte
    │
    └── js/
        ├── main.js              # Injecteur de composants, transitions, menu burger
        ├── home.js              # Animations page d'accueil (compteurs, timeline)
        ├── about.js             # Animations page À propos (effets asymétriques)
        ├── services.js          # Glissements horizontaux de la page Services
        ├── portfolio.js         # Filtres de galerie JS et lightbox média
        ├── process.js           # Ligne de progression ScrollTrigger vertical
        ├── testimonials.js      # Carrousel interactif auto-play & touch swipe
        └── contact.js           # Validation locale et envoi AJAX Web3Forms
```

---

## 🚀 Lancement en Local

Le site utilise des requêtes asynchrones `fetch` pour charger l'en-tête (`header.html`) et le pied de page (`footer.html`) sur toutes les pages. En raison des restrictions de sécurité des navigateurs (CORS), vous devez utiliser un serveur local pour exécuter le site (l'ouverture directe du fichier `index.html` via double-clic dans le navigateur bloquera l'injection du header/footer).

### Méthode conseillée :
1. **VS Code Live Server** :
   - Installez l'extension **Live Server** dans VS Code.
   - Ouvrez le dossier `VISIORA` dans votre éditeur.
   - Cliquez sur le bouton **Go Live** en bas à droite de votre écran.

2. **Serveur HTTP ultra-rapide (NodeJS)** :
   Si vous avez NodeJS installé, lancez cette commande dans votre terminal au sein du dossier du projet :
   ```bash
   npx serve .
   ```
   ou
   ```bash
   npx http-server .
   ```

---

## 📦 Déploiement sur GitHub Pages

Le projet est conçu pour être hébergé gratuitement et en toute sécurité sur GitHub Pages.

### Commandes Git à exécuter en local :
Pour lier votre dossier local à votre dépôt distant et y pousser le code, ouvrez un terminal dans le dossier du projet et saisissez :

```bash
# 1. Initialiser le dépôt local
git init

# 2. Lier le dépôt distant (URL de votre dépôt)
git remote add origin https://github.com/hennaneihab-svg/VISIORA.git

# 3. Ajouter tous les fichiers au suivi
git add .

# 4. Effectuer le premier commit
git commit -m "Initial commit - site VISIORA"

# 5. Définir la branche principale sur main
git branch -M main

# 6. Pousser le code vers la branche distante
git push -u origin main
```

---

## ⚙️ Activation de GitHub Pages (Dépôt distant)

Une fois le code envoyé sur votre dépôt GitHub :

1. Rendez-vous sur votre dépôt en ligne : `https://github.com/hennaneihab-svg/VISIORA`.
2. Cliquez sur l'onglet ⚙️ **Settings** (Paramètres) en haut de la page.
3. Dans la barre latérale gauche (section *Code and automation*), cliquez sur 📄 **Pages**.
4. Dans la partie **Build and deployment** :
   - **Source** : Laissez sur `Deploy from a branch`.
   - **Branch** : Sélectionnez la branche `main` et le dossier `/ (root)` (à la racine).
   - Cliquez sur le bouton **Save**.
5. Attendez environ 1 à 2 minutes. GitHub va exécuter un workflow automatique de déploiement.
6. L'adresse de publication de votre site sera :
   👉 **[https://hennaneihab-svg.github.io/VISIORA/](https://hennaneihab-svg.github.io/VISIORA/)**

---

## ✉️ Formulaire de contact (Web3Forms)
Le formulaire de contact utilise le service gratuit **Web3Forms** pour recevoir les messages directement par email sans serveur de backend.
Pour le rendre fonctionnel :
1. Rendez-vous sur [web3forms.com](https://web3forms.com/) et créez une clé d'accès gratuite en renseignant votre adresse email.
2. Ouvrez le fichier `contact.html`.
3. Remplacez la valeur du champ caché `access_key` :
   ```html
   <input type="hidden" name="access_key" value="VOTRE_CLE_ICI">
   ```
