import { works, deleteWork, loadCategoriesFromAPI, sendNewWork } from "./data.js";
import { displayWorks, createWorkCard } from "./gallery.js";

// Récupère dans le DOM l'emplacement des éléments
const modaleDiv = document.querySelector(".modale");
const modaleContentElem = document.querySelector(".modale-content");
const modaleAddPhotoElem = document.querySelector(".modale-addphoto");
const modaleMainElem = document.querySelector(".modale-main");
const errorMessageElem = document.querySelector(".error-message");
const addImageInput = document.getElementById("image");
const addTitleInput = document.getElementById("title");
const categorySelectElem = document.getElementById("category");
const addPhotoForm = document.getElementById("addphoto-form");

addModaleListeners();

// MARK: - MODALES

/**
 * Créer les actions sur la modale
 */
function addModaleListeners() {

    // Ajoute la fonction au click sur la croix de fermeture
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", hideModale);
    
    // Ajoute la fonction au click sur la modale (partie grisé)
    modaleDiv.addEventListener("click", hideModale);

    // Empêche qu'un click sur la modale-content se propage à d'autres éléments
    modaleContentElem.addEventListener("click", stopPropagation);

    // Ajoute la fonction au click sur le bouton "Ajouter une photo"
    const addPhotoButton = document.querySelector(".add-button");
    addPhotoButton.addEventListener("click", showModaleAddPhoto);

    // Ajoute la fonction au click sur l'icone (fleche) de retour
    const backButton = document.querySelector(".back-button");
    backButton.addEventListener("click", hideModaleAddPhoto);

    // Ajout la fonction à la soumission du formulaire "ajout de projet"
    addPhotoForm.addEventListener("submit", submitFormAddPhoto);

    // Ajout des listeners pour effacer le message d'erreur
    addImageInput.addEventListener("change", function () {
        hideMessageError();
        previewPhoto();
        checkFormAddPhoto();
    });
    addTitleInput.addEventListener("focus", hideMessageError);
    addTitleInput.addEventListener("input", checkFormAddPhoto);
    categorySelectElem.addEventListener("change", function () {
        hideMessageError();
        checkFormAddPhoto();
    });
}

// MARK: - 1ère MODALE

/**
 * Permet d'afficher la modale
 */
export function showModale() {
    // Ajoute l'animation de fondu enchainé
    modaleDiv.classList.add("modale-animation");
    // Enlève la classe hidden de la modale
    modaleDiv.classList.remove("hidden");
    // Ferme la modale "ajout de projet"
    hideModaleAddPhoto();
    // Affiche la gallerie dans la modale
    displayWorksModale();
}

/**
 * Permet de fermer la modale
 */
function hideModale() {
    // Ajoute la classe hidden à la modale
    modaleDiv.classList.add("hidden");
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
function displayWorksModale() {
    // Récupère dans le DOM l'emplacement de la gallerie
    const modaleGalleryElem = document.querySelector(".modale-gallery");
    // Efface le contenu de la gallerie de la modale
    modaleGalleryElem.innerHTML = "";

    // Crée dans le DOM les cards et ajoute les petits icones déplacement (pour le 1er élément) et suppression
    works.forEach(function (work, index) {

        const figureElem = document.createElement("figure");
        
        // Crée l'image du projet
        const imageElem = document.createElement("img");
        imageElem.crossOrigin = "anonymous";
        imageElem.src = work.imageUrl;
        imageElem.alt = work.title;
        figureElem.appendChild(imageElem);

        if (index === 0) {
            // Ajoute l'icône se déplacer pour le premier projet de la liste.    
            const aMoveElem = document.createElement("a");
            aMoveElem.href = "#";
            aMoveElem.classList.add("modale-icon", "icon-move");
        
            const imageIconMoveElem = document.createElement("img");
            imageIconMoveElem.src = "./assets/icons/Move.png";
            imageIconMoveElem.srcset = "./assets/icons/Move@2x.png 2x";
            aMoveElem.appendChild(imageIconMoveElem);
            figureElem.appendChild(aMoveElem);
        }

        // Ajoute l'icône de la suppression du projet
        const aDeleteElem = document.createElement("a");
        aDeleteElem.addEventListener("click", function (event){
            event.preventDefault();
            deleteWork(work.id, index).then(success => {
                if (success) {
                    // Rafraichit l'affichage de la modale et de la gallerie
                    displayWorks();
                    displayWorksModale();
                }
            })
        });
        aDeleteElem.href = "#";
        aDeleteElem.classList.add("modale-icon", "icon-delete");
        
        const imageIconDeleteElem = document.createElement("img");
        imageIconDeleteElem.src = "./assets/icons/Trash.png";
        imageIconDeleteElem.srcset = "./assets/icons/Trash@2x.png 2x";
        aDeleteElem.appendChild(imageIconDeleteElem);
        figureElem.appendChild(aDeleteElem);

        // Ajoute un lien d'édition non fonctionnel
        const figcaptionElem = document.createElement("figcaption");
        const aFigcaptionElem = document.createElement("a");
        aFigcaptionElem.href = "#";
        aFigcaptionElem.innerText = "éditer";
        figcaptionElem.appendChild(aFigcaptionElem);
        figureElem.appendChild(figcaptionElem);

        modaleGalleryElem.appendChild(figureElem);

    });
}

// MARK: - 2ème Modale

/**
 * Affiche la modale d'ajout de projet
 */
function showModaleAddPhoto() {
    // Masque le message d'erreur
    hideMessageError();
    // Remise à 0 du formulaire
    addTitleInput.value = "";
    addImageInput.value = "";
    document.querySelector(".image-selected").classList.add("hidden");
    document.querySelector(".image-unselected").classList.remove("hidden");

    // switch l'affichage des deux modales
    modaleAddPhotoElem.classList.remove("hidden");
    modaleMainElem.classList.add("hidden");
    // affiche la fleche "retour en arrière"
    document.querySelector(".back-button").classList.remove("hidden");
    // Recharge les catégories dans la liste déroulante
    displayCategoriesModale();

}

/**
 * Masque la modale d'ajout de projet
 */
function hideModaleAddPhoto() {
    modaleAddPhotoElem.classList.add("hidden");
    modaleMainElem.classList.remove("hidden");
    document.querySelector(".back-button").classList.add("hidden");
}

/**
 * Affiche les catégories dans la liste déroulante
 */
async function displayCategoriesModale() {
    // récupère la liste des catégories depuis l'API
    const categories = await loadCategoriesFromAPI();
    // Vide le contenu de la liste déroulante
    categorySelectElem.innerHTML = "";
    // Ajout d'une option vide
    const emptyOptionElem = document.createElement("option");
    categorySelectElem.appendChild(emptyOptionElem);
    // Ajout des catégories dans la liste déroulante
    for (let category of categories) {
        const optionElem = document.createElement("option");
        optionElem.value = category.id;
        optionElem.innerText = category.name;
        categorySelectElem.appendChild(optionElem);
    }
}

/**
 * Vérifie si le formulaire est correctement complété par l'utilisateur et change la couleur du bouton "valider" en conséquence
 */
function checkFormAddPhoto() {
    const validateButton = document.querySelector(".validate-button");
    if (addImageInput.value !== "" && addTitleInput.value !== "" && categorySelectElem.value !== "") {
        validateButton.classList.remove("disabled");
    } else {
        validateButton.classList.add("disabled");
    }

}

/**
 * Envoi du formulaire "ajout de photo"
 * @param {Event} event Evenement généré par le DOM
 * @returns 
 */
function submitFormAddPhoto(event) {
    // Empeche le rechargement de la page à la soumission du formulaire
    event.preventDefault();
    // Vérifie que l'utilisateur à renseigné tous les champs
    if (addImageInput.value === "" || addTitleInput.value === "" || categorySelectElem.value === "") {
        showMessageError("Veuillez remplir tous les champs.");
        return;
    }
    // Envoi des données à l'API
    sendNewWork(event.target).then(newWork => {
        if (newWork === undefined) {
            showMessageError("Erreur d'envoi du formulaire");
            return;
        }
        hideModale();
        createWorkCard(newWork);
    });
}

/**
 * Affiche un message d'erreur
 * @param {String} message 
 */
function showMessageError(message) {
    errorMessageElem.innerText = message;
    errorMessageElem.classList.remove("hidden");
}

/**
 * Masque le message d'erreur
 */
function hideMessageError() {
    errorMessageElem.classList.add("hidden");
}

/**
 * Affiche une prévisualisation de la photo sélectionnée par l'utilisateur
 */
function previewPhoto() {
    
    // récupère l'ensemble des fichiers selectionnés (tableau de File)
    const files = addImageInput.files;
    // Concerve uniquement le premier fichier
    const firstFile = files[0];
    if (firstFile) {
        if (firstFile.size < 4194304) {
            // Si le fichier existe, assigne le fichier en source de l'image
            const imageSelectedElem = document.querySelector(".image-selected");
            imageSelectedElem.src = URL.createObjectURL(firstFile);
            // Masque le selecteur d'image et affiche la previsualisation à la place
            const imageUnselectedElem = document.querySelector(".image-unselected");
            imageUnselectedElem.classList.add("hidden");
            imageSelectedElem.classList.remove("hidden");
        } else {
            showMessageError("Fichier trop volumineux");
        }
    }
}


