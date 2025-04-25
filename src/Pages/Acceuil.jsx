import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from '../api/axiosConfig.jsx';
import Profil from '../Pages/Profil';
import './Acceuil.css';  // Import du CSS

function Acceuil() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const [profil, setProfil] = useState({});

  useEffect(() => {
    const matricule = localStorage.getItem('matricule');
    if (matricule) {
      axios.get(`http://localhost:8080/api/utilisateur/profil/${matricule}`)
        .then(res => setProfil(res.data))
        .catch(err => console.error("Erreur lors de la récupération du profil :", err));
    }
  }, []);

  const [showProfil, setShowProfil] = useState(false);
  const handleProfilClick = () => {
    setShowProfil(!showProfil);
  };

  return (
    <div className="AcceuilContainer">
      <h1>Bienvenue dans l'accueil</h1>

      {role === 'ADMIN' && (
        <button 
          onClick={() => navigate('/dashboard')}
          className="DashboardButton"
        >
          Accéder au Dashboard
        </button>
      )}

      <div className="button-container">
        <Button variant="contained" color="primary" onClick={handleProfilClick}>
          {showProfil ? 'Masquer Profil' : 'Afficher Profil'}
        </Button>
      </div>

      {showProfil && profil && (
        <Profil
          nom={profil.nom}
          prenom={profil.prenom}
          role={profil.role}
          date={profil.dateDebutTravail}
        />
      )}

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
        className="LogoutButton"
      >
        Déconnexion
      </button>

      <button
        onClick={() => navigate('/controle-factures')}
        className="FacturesButton"
      >
        Contrôle des factures du Transporteur
      </button>
    </div>
  );
}

export default Acceuil;
