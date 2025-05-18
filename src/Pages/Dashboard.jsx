import "./Dashboard.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();

	useEffect(() => {
		const role = localStorage.getItem("role");
		if (role !== "ADMIN_USER") {
			navigate("/acceuil");
		}
	}, [navigate]);

	return (
		<div className="dashboard-container">
			<h1 className="dashboard-title">Espace Administrateur</h1>
			<div className="dashboard-buttons">
				<button onClick={() => navigate("/acceuil")}>Retour à l'accueil</button>
				<button onClick={() => navigate("/utilisateurs")}>Gérer Users</button>
			</div>
		</div>
	);
}
