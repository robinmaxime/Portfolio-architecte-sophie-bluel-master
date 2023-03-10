import { showModale } from "./modale.js";

// MARK: - AFFICHAGE DU MODE ÉDITION


export function showEditModeIfNecessary () {
    // si l'utilisateur est connecté, on modifie la page index.html
    if (isUserLogged()) {
        const loginElem = document.getElementById("log");
        // transforme le contenu de l'élément du DOM de "login" en "logout"
        loginElem.innerText = "logout";
        loginElem.addEventListener("click", function (event){
            // Empêche le comportement par défaut (rediriger vers la page login.html) 
            event.preventDefault();
            // Supprime du session storage le token
            window.sessionStorage.removeItem("token");
            // raffraichit la page
            document.location.reload();
        })
        // On récupère l'emplacement des élements qui ont la classe hidden dans le DOM
        const hiddenElements = document.querySelectorAll(".edit.hidden, .modify.hidden");
        for (let element of hiddenElements) {
            // Affiche les boutons "modifier" et le block noir "mode édition"
            element.classList.remove("hidden");
        }

        // On ajoute la fonction d'affichage de la modale sur le bouton modifier de "mes projets"
        const modifyProjectButton = document.querySelector("#portfolio .modify");
        // Crée un eventListener au click du bouton modifier (mes projets)
        modifyProjectButton.addEventListener("click", function (event){
            event.preventDefault();
            showModale();
        });
    }
}

/**
 * Vérifie si l'utilisateur est identifié
 * @returns un booleen
 */
export function isUserLogged() {
    // On récupère l'eventuel token qui est présent dans le sessionStorage
    const token = window.sessionStorage.getItem("token");
    // Si le token est présent, on considère l'utilisateur comme loggé
    return token !== null; 
}