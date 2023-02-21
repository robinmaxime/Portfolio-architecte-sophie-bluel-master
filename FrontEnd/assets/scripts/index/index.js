/*
index.js : Point d'entrée
data.js : Requête API + gestion des données (chargement, ajout, suppression des données de l'API)
gallery.js : Manipulation du DOM pour afficher et filtrer la gallerie sur la page d'accueil
edit.js : Manipulation du DOM pour afficher le mode édition
modale.js : Manipulation du DOM pour afficher la modale
*/

import { showEditModeIfNecessary, isUserLogged } from "./edit.js";
import { loadGalleryFromAPI } from "./data.js";
import { displayFilter, displayWorks } from "./gallery.js";

// Charge les données depuis l'API et les affiche dans la gallerie
loadGalleryFromAPI().then(success => {
    if (success) {
        if (!isUserLogged()) {
            // Si l'utilisateur n'est pas identifié, affichage des boutons fitres
            displayFilter();
        }
        // Affichage de la gallerie
        displayWorks();
        
    } else {
        // Affichage d'un message d'erreur
        document.querySelector(".filter").innerText = "Impossible de charger le contenu.";
    }
})

// Affiche le mode édition si l'utilisateur est identifié
showEditModeIfNecessary();