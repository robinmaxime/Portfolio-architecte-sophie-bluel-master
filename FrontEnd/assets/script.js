/* Récupere la liste de tout les projets du portfolio et les convertis en format JS*/
const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

const gallery = document.querySelector(".gallery");

displayWorks();
displayFilter();






/**
 * Affiche l'ensemble des projets en les filtrant éventuellement avec la catégoryId
 * @param {Number} categoryId l'id de la catégorie (undefined pour tout afficher) 
 */
function displayWorks(categoryId) {

    // 1. Efface le contenu de gallery
    gallery.innerHTML = "";

    // 2. Crée un tableau filtré ou non filtré
    let filteredWorks;
    if (categoryId === undefined) {
        //ne pas filtrer
        filteredWorks = works;
    } else {
        //filtrer par catégories
        filteredWorks = works.filter(function (work) {
            return work.categoryId === categoryId;
        }) ;
    }

    // 3. Affiche les cards précedemment filtré (ou non) en les créant dans le HTML
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
 * Créer un boutton de filtre, paramètre un évenement et l'ajoute sur la page
 * @param {String} name texte affiché dans le bouton
 * @param {Number} categoryId l'id de la catégorie passé en dataset (undefined pour le bouton "tous")
 * @param {Element} parentElement l'élement du DOM dans lequel le bouton doit être ajouté
 * @param {Boolean} isSelected permet d'ajouter la class selected (qui colore le bouton)
 */
function addButtonFilter(name, categoryId, parentElement, isSelected) {
    // 1. Crée le boutton
    const button = document.createElement("button");
    button.innerText = name;
    if (categoryId !== undefined) {
        button.dataset.categoryId = categoryId;
    }
    if (isSelected) {
        button.classList.add("selected");
    }
    parentElement.appendChild(button);

    // 2. Ajoute l'évenement
    button.addEventListener("click", function (event) {

        // Supprime tout les classList "selected" de tous les boutons
        const children = parentElement.children;
        for (let child of children) {
            child.classList.remove("selected");
        }

        // Ajoute le classList "selected" au bouton
        event.target.classList.add("selected");

        // Filtre : on récupère la catégorieID et on le passe en paramètre (on verifie s'il est défini et on le met en entier et plus en string)
        // l'ID peut être undefined notament pour le bouton "tous"
        const id = event.target.dataset.categoryId ? parseInt(event.target.dataset.categoryId) : undefined; 
        displayWorks(id);
    });
}



/**
 * Affiche les bouttons filtre sur la page
 */
function displayFilter() {

    // 1. On récupère la liste de tous les noms de catégories
    let categoriesNames = [];
    let categoriesIds = [];

    for (let work of works) {
        if (categoriesIds.includes(work.category.id) === false ) {
            categoriesIds.push(work.category.id);
            categoriesNames.push(work.category.name);
        }
    }

    // 2. Récupère la reference à la div filter
    const filter = document.querySelector(".filter");

    // 3. On efface le contenu de la div filter
    filter.innerHTML = "";

    // 4. On rajoute un bouton "tous"
    addButtonFilter("Tous", undefined, filter, true);

    // 5. À chaque tour de boucle on rajoute un bouton au nom de la catégorie
    for (let i = 0 ; i < categoriesIds.length ; i++ ) {
        addButtonFilter(categoriesNames[i], categoriesIds[i], filter, false);
    }
}

