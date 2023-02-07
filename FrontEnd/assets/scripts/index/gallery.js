import { works } from "./data.js";

// Récupère dans le DOM l'emplacement des éléments
const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");



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
    const button = document.createElement("button");
    button.innerText = name;

    if (isSelected) {
        button.classList.add("selected");
    }
    filter.appendChild(button);

    // 2. Ajoute l'évenement button click
    const buttonClick = function buttonClick(event) {
        // attribue l'apparence "selected" au boutton clické dans le DOM
        changeColorButton(event.target);
        // l'ID peut être undefined notamment pour le bouton "tous"
        displayWorks(categoryId);
    };

    button.addEventListener("click", buttonClick);
}

/**
 * attribue l'apparence "selected" au boutton passé en paramètre
 * @param {Element} button réference au bouton cliqué 
 */
function changeColorButton(button) {
    // Supprime tout la classe selected à tout les boutons
    const buttons = document.querySelectorAll(".filter button");
    for (let button of buttons) {
        button.classList.remove("selected");
    }
    // Ajoute la classe selected au bouton cliqué
    button.classList.add("selected");
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
            return category.id === work.category.id;
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
    gallery.innerHTML = "";

    //2. On appelle la fonction filterWorks pour qu'elle nous retourne le tableau filtré.
    const filteredWorks = filterWorks(categoryId);

    // 3. Affiche les cards précedemment filtré (ou non) en les créant dans le DOM
    for (let work of filteredWorks) {

        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        /* crossOrigin pour que les images puissent s'afficher sinon renvoi une erreur empechant le chargement d'images depuis un serveur externe */
        image.crossOrigin = "anonymous";
        figure.appendChild(image);

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;
        figure.appendChild(figcaption);

        gallery.appendChild(figure);

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
        filteredWorks = works.filter(function (work){
        return categoryId === work.categoryId;
        });
    }
    return filteredWorks;   
}