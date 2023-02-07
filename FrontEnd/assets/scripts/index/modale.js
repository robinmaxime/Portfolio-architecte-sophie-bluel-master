import { works } from "./data.js";
import { deleteWork } from "./data.js";

// Récupère dans le DOM l'emplacement des éléments
const modaleDiv = document.querySelector(".modale");
const modaleContent = document.querySelector(".modale-content");

// MARK: - MODALE

/**
 * Permet d'afficher la modale
 */
export function showModale() {
    // Ajoute l'animation de fondu enchainé
    modaleDiv.classList.add("modale-animation");
    // Enlève la classe hidden de la modale
    modaleDiv.classList.remove("hidden");
    // Ajoute l'action de fermeture de la modale
    addModaleCloseListeners();
}

/**
 * Permet de fermer la modale
 */
function hideModale(event) {
    event.preventDefault();
    // Ajoute la classe hidden à la modale
    modaleDiv.classList.add("hidden");
    // Supprime l'action de fermeture de la modale
    removeModaleCloseListeners();
}

/**
 * Crée 2 actions pour fermer la modale au click de la croix et en dehors de la modale
 */
function addModaleCloseListeners() {

    // Ajoute la fonction au click sur la croix
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", hideModale);
    
    // Ajoute la fonction au click sur la modale (partie grisé)
    modaleDiv.addEventListener("click", hideModale);

    // Empêche qu'un click sur le modele-content se propage à d'autres éléments
    modaleContent.addEventListener("click", stopPropagation);
}

/**
 * Retire les 2 actions pour fermer la modale au click de la croix et en dehors de la modale
 */
function removeModaleCloseListeners() {
    // Retire la fonction au click sur la croix
    const closeButton = document.querySelector(".close-button");
    closeButton.removeEventListener("click", hideModale);

    // Retire la fonction au click sur la modale (partie grisé)
    modaleDiv.removeEventListener("click", hideModale);

    // Retire l'event listener ajouté dans addModalCloseAction
    modaleContent.removeEventListener("click", stopPropagation);
}

/**
 * Empêche la propagation des evenements à d'autres éléments
 * @param {Event} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Affiche l'ensemble des projets dans la modale-content
 */
export function displayWorksModale() {
    // Récupère dans le DOM l'emplacement de la gallerie
    const modaleGallery = document.querySelector(".modale-gallery");
    // Efface le contenu de la gallerie de la modale
    modaleGallery.innerHTML = "";

    // Crée dans le DOM les cards et ajoute les petits icones déplacement (pour le 1er élément) et suppression
    works.forEach(function (work, index) {

        const figure = document.createElement("figure");
        
        // Crée l'image du projet
        const image = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = work.imageUrl;
        image.alt = work.title;
        figure.appendChild(image);

        if (index === 0) {
            // Ajoute l'icône se déplacer pour le premier projet de la liste.    
            const aMove = document.createElement("a");
            aMove.href = "#";
            aMove.classList.add("modale-icon");
            aMove.classList.add("icon-move")
        
            const imageIconMove = document.createElement("img");
            imageIconMove.src = "./assets/icons/Move.png";
            imageIconMove.srcset = "./assets/icons/Move@2x.png 2x";
            aMove.appendChild(imageIconMove);
            figure.appendChild(aMove);
        }

        // Ajoute l'icône de la suppression du projet
        const aDelete = document.createElement("a");
        aDelete.addEventListener("click", function (event){
            event.preventDefault();
            deleteWork(work.id, index);
        });
        aDelete.href = "#";
        aDelete.classList.add("modale-icon");
        aDelete.classList.add("icon-delete");
        
        const imageIconDelete = document.createElement("img");
        imageIconDelete.src = "./assets/icons/Trash.png";
        imageIconDelete.srcset = "./assets/icons/Trash@2x.png 2x";
        aDelete.appendChild(imageIconDelete);
        figure.appendChild(aDelete);

        // Ajoute un lien d'édition non fonctionnel
        const figcaption = document.createElement("figcaption");
        const aFigcaption = document.createElement("a");
        aFigcaption.href = "#";
        aFigcaption.innerText = "éditer";
        figcaption.appendChild(aFigcaption);
        figure.appendChild(figcaption);

        modaleGallery.appendChild(figure);

    });
}

