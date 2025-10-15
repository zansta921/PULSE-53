# PULSE-53

PULSE-53 est un visuel interactif / vitrine créé par Bryan Maison. Il combine une double hélice d'ADN 3D, des particules fluorescentes représentant le p53, un logo lumineux et un titre en style néon. L'objectif est d'obtenir un rendu futuriste, classe, et immersif, avec un fond noir, une orientation diagonale de l'ADN et des animations subtiles.

---

Fonctionnalités principales
- Fond noir animé (Three.js) pour un rendu épuré.
- Double hélice d'ADN verte/bleue en 3D, orientée en diagonale (haut-gauche → bas-droite).
- Hélice qui tourne lentement et a un léger "breath" (pulsation).
- Particules fluorescentes s'échappant de l'ADN (représentent p53), avec dissipation et effet de brillance.
- Logo lumineux placé au centre haut, avec un effet de "glow" et fade-in à l'ouverture.
- Titre "PULSE-53" en style néon, avec dégradé bleu/vert, ombre lumineuse et pulsation.
- Sous-titre élégant, blanc semi-transparent.
- Tous les éléments apparaissent avec un effet de fondu (fade-in).
- Page scrollable : le canvas / animation reste en arrière-plan et on peut descendre pour lire les explications et le contact.
- Mention du concept : inspiré par l'éléphant, la tortue et l'axolotl.

Contact
- Créateur : Bryan Maison
- Email : maisonbryan92@gmail.com

---

Installation / Déploiement
1. Copier les fichiers du dépôt (index.html, styles.css, main.js, README.md).
2. Héberger sur GitHub Pages ou tout autre serveur statique.
   - Pour GitHub Pages : simplement pousser dans la branche `gh-pages` ou activer Pages depuis `main`/`master` dans les paramètres GitHub.
3. Ouvrir la page : l'animation se lance automatiquement. Le logo et l'ADN sont obligatoirement visibles dans le hero.

Remarques techniques
- Le rendu utilise Three.js (importé via CDN).
- Les particules sont gérées par un système simple en CPU pour compatibilité et facilité d'édition.
- Si vous voulez plus de performances ou d'effets avancés (bloom, shaders de glow), il est recommandé d'ajouter des passes post-processing (EffectComposer) et des shaders personnalisés.

Licence & crédits
- Créateur : Bryan Maison
- Ce dépôt contient une démonstration visuelle — adaptez et réutilisez selon vos besoins.

Merci d'avoir visité PULSE-53 ✨
