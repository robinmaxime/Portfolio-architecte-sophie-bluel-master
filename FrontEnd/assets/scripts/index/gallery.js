import { works } from "./data.js";

// Récupère dans le DOM l'emplacement des éléments
const galleryElem = document.querySelector(".gallery");
const filterElem = document.querySelector(".filter");



// MARK: - FILTRAGE DES DONNÉES


/**
 * Affiche les bouttons filtre sur la page
 */
export function displayFilter() {

    // 1. On rajoute un bouton "tous"
    createButtonFilter("Tous", undefined, true);

    // 2. On rajoute les boutons avec le nom des catégories.
    // 2-1. On récupère le tableau de catégories uniques
    const categoriesUniques = generateUniqueCategories();

    // 2-2. À chaque tour de boucle on rajoute un bouton au nom de la catégorie
    for (let category of categoriesUniques) {
        createButtonFilter(category.name, category.id, false);
    }
}

/**
 * Créer un boutton de filtre, paramètre un évenement et l'ajoute sur la page
 * @param {String} name texte affiché dans le bouton
 * @param {Number} categoryId l'id de la catégorie (undefined pour le bouton "tous")
 * @param {Boolean} isSelected permet d'ajouter la class selected (qui colore le bouton)
 */
function createButtonFilter(name, categoryId, isSelected) {
    // 1. Crée le boutton dans le DOM
    const buttonElem = document.createElement("button");
    buttonElem.innerText = name;

    if (isSelected) {
        buttonElem.classList.add("selected");
    }
    filterElem.appendChild(buttonElem);

    // 2. Ajoute la fonction button click
    buttonElem.addEventListener("click", function (event) {
        // attribue l'apparence "selected" au boutton clické dans le DOM
        changeColorButton(event.target);
        // l'ID peut être undefined notamment pour le bouton "tous"
        displayWorks(categoryId);
    });
}

/**
 * attribue l'apparence "selected" au boutton passé en paramètre
 * @param {Element} button réference au bouton cliqué 
 */
function changeColorButton(buttonTarget) {
    // Supprime la classe selected à tous les boutons
    const buttonsElem = document.querySelectorAll(".filter button");
    for (let buttonElem of buttonsElem) {
        buttonElem.classList.remove("selected");
    }
    // Ajoute la classe selected au bouton cliqué
    buttonTarget.classList.add("selected");
}

/**
 * Crée un tableau de catégorie unique
 * @returns un tableau de catégorie unique (name, Id)
 */
function generateUniqueCategories() {
    // On crée un tableau vide de d'objet catégorie sans doublon
    let categoriesUniques = [];

    for (let work of works) {
        //on cherche une categorie dans le tableau categoriesUniques qui aurait le même ID que le work actuellement itéré
        const result = categoriesUniques.find(function (category) {
            return category.id === work.categoryId;
        });
        //si la fonction .find ne trouve rien, alors on rajoute l'objet catégorie dans notre tableau
        if (result === undefined) {
            categoriesUniques.push(work.category);
        }
    }
    return categoriesUniques;
}



// MARK: - AFFICHAGE DES DONNÉES


/**
 * Affiche l'ensemble des projets en les filtrant éventuellement avec la catégoryId
 * @param {Number} categoryId l'id de la catégorie (undefined pour tout afficher) 
 */
export function displayWorks(categoryId) {

    // 1. Efface le contenu de gallery
    galleryElem.innerHTML = "";

    //2. On appelle la fonction filterWorks pour qu'elle nous retourne le tableau filtré.
    const filteredWorks = filterWorks(categoryId);

    // 3. Affiche les cards précedemment filtré (ou non) en les créant dans le DOM
    for (let work of filteredWorks) {
        createWorkCard(work);
    }
}

/**
 * Filtre les projets selon le numéro de catégorie indiqué
 * @param {Number} categoryId l'id de la catégorie à filtrer ou undefined pour ne pas filtrer 
 * @returns le tableau filtré
 */
function filterWorks(categoryId) {
    let filteredWorks;

    if (categoryId === undefined) {
        filteredWorks = works;
    } else {
        filteredWorks = works.filter(function (work) {
            return categoryId === work.categoryId;
        });
    }
    return filteredWorks;   
}

/**
 * Crée un projet dans le DOM de la gallerie
 * @param {Object} work Le projet au format de l'API
 */
export function createWorkCard(work) {
    const figureElem = document.createElement("figure");

    const imageElem = document.createElement("img");
    imageElem.src = work.imageUrl;
    imageElem.alt = work.title;
    /* crossOrigin pour que les images puissent s'afficher sinon renvoi une erreur empechant le chargement d'images depuis un serveur externe */
    imageElem.crossOrigin = "anonymous";
    figureElem.appendChild(imageElem);

    const figcaptionElem = document.createElement("figcaption");
    figcaptionElem.innerText = work.title;
    figureElem.appendChild(figcaptionElem);

    galleryElem.appendChild(figureElem);
}