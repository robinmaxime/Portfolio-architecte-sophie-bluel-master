import { callApi, showEditModeIfNecessary } from "./gallery.js";


// On récupère l'eventuel token qui est présent dans le sessionStorage
const token = window.sessionStorage.getItem("token");
// Si le token est présent, on considère l'utilisateur comme loggé
export const isUserLogged = token !== null; 



callApi();
showEditModeIfNecessary();



// MARK: - FONCTIONS


