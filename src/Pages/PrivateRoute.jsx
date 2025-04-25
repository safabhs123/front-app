// PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role'); // Assure-toi que c'est bien "role"
  console.log("Vérification du rôle dans PrivateRoute :", role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/acceuil" replace />;
  }

  return children;
}
