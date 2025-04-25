import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/api/utilisateurs';

export const getUtilisateurs = () => axios.get(API_URL);
export const getUtilisateur = (matricule) => axios.get(`${API_URL}/${matricule}`);
export const ajouterUtilisateur = (data) => axios.post(API_URL, data);
export const modifierUtilisateur = (matricule, data) => axios.put(`${API_URL}/${matricule}`, data);
export const supprimerUtilisateur = (matricule) => axios.delete(`${API_URL}/${matricule}`);
