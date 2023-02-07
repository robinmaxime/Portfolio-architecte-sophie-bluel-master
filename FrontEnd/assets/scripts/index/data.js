import { displayFilter, displayWorks } from "./gallery.js";
import { isUserLogged } from "./edit.js";
import { displayWorksModale } from "./modale.js";

// Contient l'ensemble des objets que nous retourera l'API
export let works = [];



// MARK: - CHARGEMENT DES DONNÉES DEPUIS L'API


/**
 * Récupere la liste de tous les projets du portfolio et les convertit en format JS
 */
export async function loadGalleryFromAPI() {
    try {
        // Execution de la requête GET
        const response = await fetch('http://localhost:5678/api/works');
        if (response.status === 200) {
            // stockage de la réponse au format JS
            works = await response.json();
            
            if (!isUserLogged()) {
                // Si l'utilisateur n'est pas identifié, affichage des boutons fitres
                displayFilter();
            }
            // Affichage de la gallerie
            displayWorks();
        } else {
            // Affichage d'un message d'erreur
            document.querySelector(".filter").innerText = `Impossible de charger le contenu (code : ${response.status}).`;
        }
    } catch(error) {
        document.querySelector(".filter").innerText = "Impossible de charger le contenu.";
    }
}



// MARK: - SUPPRESSION DES DONNÉES DEPUIS L'API

/**
 * Supprime dans l'API le projet désigné et raffraichit l'interface
 * @param {Number} workId : l'id du projet dans l'API
 * @param {Number} workIndex : l'index du projet dans le tableau works
 */
export async function deleteWork(workId, workIndex) {

    try {
        // Récupère le token dans le sessionStorage et vérifie qu'il ne soit pas null
        const token = window.sessionStorage.getItem("token");
        if (token === null) {
            console.log("Pas de token trouvé");
            return;
        } 
        // Execution de la requête DELETE avec le token en headers
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        })
        // si l'API retourne OK, on supprime le projet dans le tableau WORKS
        if (response.ok) {
            // Supprime l'objet dans le tableau WORKS à l'index indiqué
            works.splice(workIndex, 1);
            // Rafraichit l'affichage de la modale et de la gallerie
            displayWorks();
            displayWorksModale();

        } else {
            console.log(`erreur : ${response.status}`);
        }

    } catch(error) {
        console.log(error);
    }
}