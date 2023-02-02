import { works } from "./gallery.js";


// Récupère dans le DOM l'emplacement des éléments
const modaleDiv = document.querySelector(".modale");

// MARK: - MODALE

/**
 * Permet d'afficher la modale
 */
export function showModale() {
    modaleDiv.classList.remove("hidden");
}

/**
 * Permet de fermer la modale
 */
function hideModale() {
    modaleDiv.classList.add("hidden");
}

/**
 * Crée 2 actions pour fermer la modale au click de la croix et en dehors de la modale
 */
export function addModaleCloseAction() {

    // Ajoute la fonction au click sur la croix
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", function (event){
        event.preventDefault();
        hideModale();
    })
    
    // Ajoute la fonction au click sur la modale (partie grisé)
    modaleDiv.addEventListener("click", function(event){
        // S'assurer que ce n'est pas un enfant de la modale qui déclenche le hidden
        if (event.target === modaleDiv) {
            modaleDiv.classList.add("hidden");
        }
    });
}

/**
 * Affiche l'ensemble des projets dans la modale-content
 */
export function displayWorksModale() {

    const modaleGallery = document.querySelector(".modale-gallery");
    modaleGallery.innerHTML = "";

    // Crée dans le DOM les cards et ajoute les petits icones déplacement (pour le 1er élément) et suppression
    works.forEach(function (work, index) {

        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = work.imageUrl;
        image.alt = work.title;
        figure.appendChild(image);

        if (index === 0) {
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

        const aDelete = document.createElement("a");
        aDelete.href = "#";
        aDelete.classList.add("modale-icon");
        aDelete.classList.add("icon-delete");
        
        const imageIconDelete = document.createElement("img");
        imageIconDelete.src = "./assets/icons/Trash.png";
        imageIconDelete.srcset = "./assets/icons/Trash@2x.png 2x";
        aDelete.appendChild(imageIconDelete);
        figure.appendChild(aDelete);

        const figcaption = document.createElement("figcaption");
        const aFigcaption = document.createElement("a");
        aFigcaption.href = "#";
        aFigcaption.innerText = "éditer";
        figcaption.appendChild(aFigcaption);
        figure.appendChild(figcaption);

        modaleGallery.appendChild(figure);
    });
}