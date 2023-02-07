/*
index.js : Point d'entrée
data.js : Requête API + gestion des données (chargement, ajout, suppression des données de l'API)
gallery.js : Manipulation du DOM pour afficher et filtrer la gallerie sur la page d'accueil
edit.js : Manipulation du DOM pour afficher le mode édition
modale.js : Manipulation du DOM pour afficher la modale
*/

import { showEditModeIfNecessary } from "./edit.js";
import { loadGalleryFromAPI } from "./data.js";

// Charge les données depuis l'API et les affiche dans la gallerie
loadGalleryFromAPI();

// Affiche le mode édition si l'utilisateur est identifié
showEditModeIfNecessary();