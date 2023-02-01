// Récupère dans le DOM l'emplacement des éléments
const errorMessage = document.querySelector(".error-message");
const loginForm = document.querySelector("#login form");
const emailInput = document.getElementById("user-email");
const passwordInput = document.getElementById("user-password");

// Ajoute un écouteur d'évènement lorsque l'utilisateur focus l'input
emailInput.addEventListener("focus", hideMessageError);
passwordInput.addEventListener("focus", hideMessageError);

// Ajoute un écouteur d'évènement lorsque le formulaire est soumis
loginForm.addEventListener("submit", checkLogin);


// MARK: - FONCTIONS

/**
 * Affiche le message d'erreur
 * @param {"String"} message indiquer le message d'erreur visible par l'utilisateur 
 */
function showMessageError (message) {
    errorMessage.innerText = message;
    errorMessage.classList.remove("hidden");
}

/**
 * Masque le message d'erreur
 */
function hideMessageError() {
    errorMessage.classList.add("hidden");
}

/**
 * Vérifie les identifiants saisis par l'utilisateur lorsque le formulaire est soumis.
 * @param {Event} event l'évènement généré par le DOM 
 * @returns 
 */
async function checkLogin (event){

    // Empeche le comportement par défaut du nagivateur (rechargement de la page)
    event.preventDefault();
    
    // Stocke les données saisie par l'utilisateur
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;
    
    // On verifie que l'adresse mail et le mot de passe sont remplis. 
    if (userEmail === "" || userPassword === "") {
        showMessageError("Veuillez entrer un email et un mot de passe.");
        return;
    }
    
    // Crée le body du fetch en respectant le format de l'API
    const user = {
        email: userEmail,
        password: userPassword
    };

    try {
        // Crée la requête POST pour l'API qui nous retourne notamment un statut OK ou pas OK
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json;charset=utf-8"}, 
            body: JSON.stringify(user)
        });
        
        if (response.ok) {
            // Si la response.ok est true, on transforme au format JS
            let result = await response.json();
            // On vérifie si on a bien obtenu un token
            if (result.token !== undefined) {
                //On stocke dans le sessionStorage
                window.sessionStorage.setItem("token", result.token);
                //On redirige vers la page index.html
                document.location.href = "index.html";
            } else {
                showMessageError("Erreur innatendue (token non présent).");
            }
        } else {
            /* Si la response.ok est false, on affiche un message d'erreur 
            l'API peut retourner 401 ou 404 */
            showMessageError("Erreur dans l'identifiant ou le mot de passe");
        }
    } catch(error) {
        showMessageError("Communication impossible avec le serveur");
        console.log(error);
    }
}