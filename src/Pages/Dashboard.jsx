import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le rôle depuis le localStorage avec la clé correcte
    const role = localStorage.getItem('role'); // Utilise 'role' ici, pas 'userRole'

    if (role !== 'ADMIN') {
      navigate('/acceuil'); // Redirige vers la page d'accueil si le rôle n'est pas ADMIN
    }
  }, [navigate]);

  return (
    <div>
      <h1>Espace Administrateur</h1>
      <button onClick={() => navigate('/acceuil')}>Retour à l'accueil</button>
      <button onClick={() => navigate('/utilisateurs')}>Gérer Users</button>
    </div>
  );
}
