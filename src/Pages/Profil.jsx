import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	Edit,
	Mail,
	Phone,
	Calendar,
	Building,
	User,
	Shield,
	LogOut,
	Menu,
	X,
	Home,
	FileText,
	CreditCard,
	PieChart,
} from "lucide-react";
import "./Profil.css";
import { Link } from "react-router-dom";
import axios from "axios";
const Profil = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [userData, setUserData] = useState({
		matricule: "",
		nom: "",
		prenom: "",
		role: "",
		email: "utilisateur@attijaribank.com",
		telephone: "+216 71 123 456",
		dateDebut: "01/01/2022",
		departement: "Finance",
		agence: "Tunis Centre",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({});
	const role = localStorage.getItem("userRole");
	const [profil, setProfil] = useState({});
	const matricule = localStorage.getItem("matricule");
	const getProfil = async () => {
		if (matricule) {
			axios
				.get(`http://localhost:8080/api/utilisateur/profil/${matricule}`)
				.then((res) => { console.log(res.data);setProfil(res.data)})
				.catch((err) =>
					console.error("Erreur lors de la récupération du profil :", err)
				);
		}
	};

	useEffect(() => {
		// Get user info from localStorage
		const matricule = localStorage.getItem("matricule") || "";
		const role = localStorage.getItem("role") || "";
		if (matricule && role) {
			getProfil();
		}
		if (profil) {
			setUserData({
				matricule: profil.matricule,
				nom: profil.nom,
				prenom: profil.prenom,
				role: profil.role,
				email: profil.email,
				telephone: profil.telephone,
				dateDebut: profil.dateDebut,
				departement: profil.departement,
				agence: profil.agence,
			});
		} else {
			setUserData({
				matricule: matricule,
				nom: "Doe",
				prenom: "John",
				role: role,
				email: "j.doe@attijaribank.com",
				telephone: "+216 71 123 456",
				dateDebut: "01/01/2022",
				departement: "Finance",
				agence: "Tunis Centre",
			});
		}
	}, []);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem("role");
		localStorage.removeItem("matricule");
		localStorage.removeItem("motDePasse");
		window.location.href = "/";
	};

	const handleEditClick = () => {
		setIsEditing(true);
		setEditData({ ...userData });
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const handleSaveEdit = () => {
		setUserData({ ...editData });
		setIsEditing(false);
		// In a real app, you would send the updated data to your API here
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditData({
			...editData,
			[name]: value,
		});
	};

	return (
		<div className="dashboard-container">
			{/* Sidebar */}
			<aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
				<div className="sidebar-header">
					<img
						src="assetsss/logo/logo-full.png"
						alt="Attijari Bank Logo"
						width={120}
						height={60}
						className="sidebar-logo"
					/>
					<button className="close-sidebar" onClick={toggleSidebar}>
						<X size={20} />
					</button>
				</div>

				<nav className="sidebar-nav">
					<ul>
						<li className="active">
							<Link to="/accueil">
								<Home size={20} />
								<span>Tableau de bord</span>
							</Link>
						</li>
						<li>
							<Link to="/controle-factures">
								<FileText size={20} />
								<span>Factures</span>
							</Link>
						</li>
						<li>
							<Link to="/caisse">
								<CreditCard size={20} />
								<span>Caisse</span>
							</Link>
						</li>
						<li>
							<Link to="/rapports">
								<PieChart size={20} />
								<span>Rapports</span>
							</Link>
						</li>
					</ul>
				</nav>

				<div className="sidebar-footer">
					<button className="logout-button" onClick={handleLogout}>
						<LogOut size={20} />
						<span>Déconnexion</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main
				className={`main-content ${
					sidebarOpen ? "sidebar-open" : "sidebar-closed"
				}`}
			>
				{/* Header */}
				<header className="profile-header">
					<div className="header-left">
						<button className="menu-toggle" onClick={toggleSidebar}>
							<Menu size={24} />
						</button>
						<Link to="/accueil" className="back-link">
							<ArrowLeft size={20} />
							<span>Retour au tableau de bord</span>
						</Link>
					</div>
				</header>

				{/* Profile Content */}
				<div className="profile-content">
					<div className="profile-container">
						<div className="profile-header-section">
							<h1>Profil Utilisateur</h1>
							{!isEditing && (
								<button
									className="edit-profile-button"
									onClick={handleEditClick}
								>
									<Edit size={16} />
									<span>Modifier</span>
								</button>
							)}
						</div>

						<div className="profile-card">
							<div className="profile-avatar-section">
								<div className="profile-avatar">
									<User size={40} />
								</div>
								<div className="profile-name">
									{isEditing ? (
										<>
											<input
												type="text"
												name="prenom"
												value={editData.prenom}
												onChange={handleInputChange}
												className="edit-input"
											/>
											<input
												type="text"
												name="nom"
												value={editData.nom}
												onChange={handleInputChange}
												className="edit-input"
											/>
										</>
									) : (
										<h2>{`${userData?.prenom} ${userData?.nom}`}</h2>
									)}
									<div className="profile-role">
										<Shield size={16} />
										<span>{userData.role}</span>
									</div>
								</div>
							</div>

							<div className="profile-details">
								<div className="profile-section">
									<h3>Informations personnelles</h3>
									<div className="profile-info-grid">
										<div className="profile-info-item">
											<div className="info-label">
												<User size={16} />
												<span>Matricule</span>
											</div>
											<div className="info-value">{userData?.matricule}</div>
										</div>

										<div className="profile-info-item">
											<div className="info-label">
												<Mail size={16} />
												<span>Email</span>
											</div>
											<div className="info-value">
												{isEditing ? (
													<input
														type="email"
														name="email"
														value={editData.email}
														onChange={handleInputChange}
														className="edit-input"
													/>
												) : (
													userData.email
												)}
											</div>
										</div>

										<div className="profile-info-item">
											<div className="info-label">
												<Phone size={16} />
												<span>Téléphone</span>
											</div>
											<div className="info-value">
												{isEditing ? (
													<input
														type="tel"
														name="telephone"
														value={editData.telephone}
														onChange={handleInputChange}
														className="edit-input"
													/>
												) : (
													userData?.telephone
												)}
											</div>
										</div>

										<div className="profile-info-item">
											<div className="info-label">
												<Calendar size={16} />
												<span>Date de début</span>
											</div>
											<div className="info-value">
												{isEditing ? (
													<input
														type="text"
														name="dateDebut"
														value={editData.dateDebut}
														onChange={handleInputChange}
														className="edit-input"
													/>
												) : (
													userData?.dateDebut
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="profile-section">
									<h3>Informations professionnelles</h3>
									<div className="profile-info-grid">
										<div className="profile-info-item">
											<div className="info-label">
												<Building size={16} />
												<span>Département</span>
											</div>
											<div className="info-value">
												{isEditing ? (
													<input
														type="text"
														name="departement"
														value={editData.departement}
														onChange={handleInputChange}
														className="edit-input"
													/>
												) : (
													userData.departement
												)}
											</div>
										</div>

										<div className="profile-info-item">
											<div className="info-label">
												<Building size={16} />
												<span>Agence</span>
											</div>
											<div className="info-value">
												{isEditing ? (
													<input
														type="text"
														name="agence"
														value={editData.agence}
														onChange={handleInputChange}
														className="edit-input"
													/>
												) : (
													userData.agence
												)}
											</div>
										</div>
									</div>
								</div>

								{isEditing && (
									<div className="edit-actions">
										<button
											className="cancel-button"
											onClick={handleCancelEdit}
										>
											Annuler
										</button>
										<button className="save-button" onClick={handleSaveEdit}>
											Enregistrer
										</button>
									</div>
								)}
							</div>
						</div>

						<div className="profile-actions">
							<button className="action-button danger" onClick={handleLogout}>
								<LogOut size={16} />
								<span>Déconnexion</span>
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profil;
