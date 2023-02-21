// Contient l'ensemble des projet de la gallerie
export let works = [];



// MARK: - CHARGEMENT DES DONNÉES DEPUIS L'API


/**
 * Récupere la liste de tous les projets du portfolio et les convertit en format JS
 * @returns une promesse au format Booleen (true si les données sont chargées depuis l'API)
 */
export async function loadGalleryFromAPI() {
    try {
        // Execution de la requête GET
        const response = await fetch('http://localhost:5678/api/works');
        if (response.status === 200) {
            // stockage de la réponse au format JS
            works = await response.json();
            return true;
        }
    } catch(error) {
        console.log(error);
    }
    return false;
}



// MARK: - SUPPRESSION DES DONNÉES DEPUIS L'API

/**
 * Supprime dans l'API le projet désigné et raffraichit l'interface
 * @param {Number} workId : l'id du projet dans l'API
 * @param {Number} workIndex : l'index du projet dans le tableau works
 * @returns retourne True si la suppression est un succès
 */
export async function deleteWork(workId, workIndex) {

    try {
        // Récupère le token dans le sessionStorage et vérifie qu'il ne soit pas null
        const token = window.sessionStorage.getItem("token");
        if (token === null) {
            console.log("Pas de token trouvé");
            return false;
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
            return true;

        } else {
            console.log(`erreur : ${response.status}`);
        }

    } catch(error) {
        console.log(error);
    }
    return false;
}

// MARK: - CHARGEMENT DES DONNÉES DEPUIS L'API

/**
 * Charge depuis l'API les catégories
 * @returns un tableau contenant les catégories
 */
export async function loadCategoriesFromAPI() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (response.status === 200) {
            const categories = await response.json();
            return categories;
        }
    } catch(error) {
        console.log(error);
    }
    return [];
}

// MARK: - ENVOI DE DONNÉES VERS L'API

/**
 * Envoi les données d'un formulaire à l'API pour créer un nouveau projet
 * @param {Element} form Élement du dom à passer en paramètre
 * @returns Le nouveau projet crée par l'API
 */
export async function sendNewWork(form) {
    try {
        // Récupère le token dans le sessionStorage et vérifie qu'il ne soit pas null
        const token = window.sessionStorage.getItem("token");
        if (token === null) {
            console.log("Pas de token trouvé");
            return undefined;
        } 

        // envoi de la requête POST avec un body FormData 
        // (ici on passe le formulaire du dom en paramètre pour qu'il puisse construire automatiquement le FormData)
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            // Penser à ne pas passer de content type sinon erreur "Multipart: Boundary not found"
            headers: {"Authorization": `Bearer ${token}`},
            body: new FormData(form)
        });
        if (response.ok) {
            const newWork = await response.json();
            works.push(newWork);
            return newWork;
        }


    } catch(error) {
        console.log(error);
    }
    return undefined;
}