import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig.jsx";
import "./Authentification.css";

const Authentification = () => {
	const [matricule, setMatricule] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("info");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const currentYear = new Date().getFullYear();

	const handleSubmit = (e) => {
		e.preventDefault();
		handleLogin();
	};

	const handleLogin = async () => {
		setLoading(true);
		setMessage("");

		try {
			const response = await axios.post(
				"http://localhost:8080/api/auth/login",
				{ matricule, password },
				{
					headers: {
						"Content-Type": "application/json",
						//withCredentials: true
					},
				}
			);

			if (response.status === 200) {
				const role = response.data;

				localStorage.setItem("role", role);
				localStorage.setItem("matricule", matricule);
				localStorage.setItem("motDePasse", password);

				console.log("Connexion réussie avec le rôle :", role);

				setMessage("Connexion réussie !");
				setSeverity("success");

				// ✅ Redirection immédiate après connexion réussie
				if (role === "ADMIN_USER") {
					navigate("/dashboard", { replace: true });
				} else if (role === "ADMIN_FUNCTIONAL") {
					navigate("/controle-factures", { replace: true });
				} else if (role === "EMPLOYEE") {
					navigate("/acceuil", { replace: true });
				} else {
					setMessage("Rôle non reconnu");
					setSeverity("error");
				}
			}
		} catch (error) {
			console.error("Erreur login :", error);
			setSeverity("error");

			if (error.response) {
				setMessage(error.response.data.message || "Erreur de connexion");
			} else if (error.request) {
				setMessage("Erreur de connexion au serveur");
			} else {
				setMessage("Erreur inattendue");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			{/* Left Column */}
			<div className="left-column">
				<div className="left-content">
					<h1 className="welcome-title">Bienvenue !</h1>

					<p className="welcome-text">
						Connectez-vous pour accéder à votre espace personnel et gérer vos
						opérations bancaires en toute sécurité.
					</p>

					<div className="copyright">
						© {currentYear} Attijari Bank - Tous droits réservés
					</div>
				</div>
			</div>

			{/* Right Column */}
			<div className="right-column">
				<div className="logo-container">
					<img
						src="assetsss/logo/logo-1.jpg"
						alt="Attijari Bank Logo"
						width={120}
						height={60}
						className="logo"
					/>
				</div>

				<div className="login-form-container">
					<h2 className="login-title">Connectez-vous</h2>

					{message && (
						<div
							className={`message-alert ${
								severity === "error" ? "error" : "success"
							}`}
						>
							{message}
						</div>
					)}

					<form onSubmit={handleSubmit} className="login-form">
						<div className="form-group">
							<input
								type="text"
								id="matricule"
								value={matricule}
								onChange={(e) => setMatricule(e.target.value)}
								placeholder="Adresse mail"
								required
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Mot de passe"
								required
								className="form-input"
							/>
							<div className="forgot-password-container">
								<a href="#" className="forgot-password">
									Mot de passe oublié?
								</a>
							</div>
						</div>

						<button type="submit" className="login-button" disabled={loading}>
							{loading ? (
								<div className="loading-container">
									<div className="loading-spinner"></div>
									<span>Connexion en cours...</span>
								</div>
							) : (
								"Connexion"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Authentification;
