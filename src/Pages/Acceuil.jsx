import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig.jsx";
import "./Accueil.css"; // Import du CSS
import {
	Bell,
	ChevronDown,
	FileText,
	Home,
	LogOut,
	Menu,
	PieChart,
	Search,
	User,
	X,
	CreditCard,
	Calendar,
	DollarSign,
	ArrowUpRight,
	ArrowDownRight,
	Clock,
} from "lucide-react";
function Acceuil() {
	const navigate = useNavigate();
	const role = localStorage.getItem("userRole");
	const [profil, setProfil] = useState({});

	useEffect(() => {
		const matricule = localStorage.getItem("matricule");
		if (matricule) {
			axios
				.get(`http://localhost:8080/api/utilisateur/profil/${matricule}`)
				.then((res) => setProfil(res.data))
				.catch((err) =>
					console.error("Erreur lors de la récupération du profil :", err)
				);
		}
	}, []);

	const [showProfil, setShowProfil] = useState(false);
	const handleProfilClick = () => {
		setShowProfil(!showProfil);
	};
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [userName, setUserName] = useState("");
	const [userRole, setUserRole] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [currentDate, setCurrentDate] = useState("");

	useEffect(() => {
		// Get user info from localStorage
		const matricule = localStorage.getItem("matricule") || "";
		const role = localStorage.getItem("role") || "";

		setUserName(matricule);
		setUserRole(role);

		// Format current date in French
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const today = new Date();
		setCurrentDate(today.toLocaleDateString("fr-FR", options));
	}, []);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
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
							<a href="/acceuil">
								<Home size={20} />
								<span>Tableau de bord</span>
							</a>
						</li>
						<li>
							<a href="/factures">
								<FileText size={20} />
								<span>Factures</span>
							</a>
						</li>
						<li>
							<a href="/caisse">
								<CreditCard size={20} />
								<span>Caisse</span>
							</a>
						</li>
						<li>
							<a href="/rapports">
								<PieChart size={20} />
								<span>Rapports</span>
							</a>
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
				<header className="dashboard-header">
					<div className="header-left">
						<button className="menu-toggle" onClick={toggleSidebar}>
							<Menu size={24} />
						</button>
						<div className="search-container">
							<Search size={20} className="search-icon" />
							<input
								type="text"
								placeholder="Rechercher..."
								className="search-input"
							/>
						</div>
					</div>

					<div className="header-right">
						<button className="notification-button">
							<Bell size={20} />
							<span className="notification-badge">3</span>
						</button>

						<div className="user-menu">
							<button className="user-menu-button" onClick={toggleMobileMenu}>
								<div className="user-avatar">
									<User size={20} />
								</div>
								<div className="user-info">
									<span className="user-name">{userName}</span>
									<span className="user-role">{userRole}</span>
								</div>
								<ChevronDown size={16} />
							</button>

							{mobileMenuOpen && (
								<div className="user-dropdown">
									<Link to="/profil" onClick={handleProfilClick}>
										<User size={16} />
										<span>Mon profil</span>
									</Link>

									<button onClick={handleLogout}>
										<LogOut size={16} />
										<span>Déconnexion</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Dashboard Content */}
				<div className="dashboard-content">
					<div className="page-header">
						<div>
							<h1>Tableau de bord</h1>
							<p className="date-display">{currentDate}</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="stats-grid">
						<div className="stats-card">
							<div className="stats-card-header">
								<h3>Total des factures</h3>
								<div className="stats-icon blue">
									<FileText size={20} />
								</div>
							</div>
							<div className="stats-card-content">
								<p className="stats-value">1,254</p>
								<div className="stats-trend positive">
									<ArrowUpRight size={16} />
									<span>+12.5%</span>
								</div>
							</div>
							<p className="stats-period">Depuis le mois dernier</p>
						</div>

						<div className="stats-card">
							<div className="stats-card-header">
								<h3>Montant total</h3>
								<div className="stats-icon green">
									<DollarSign size={20} />
								</div>
							</div>
							<div className="stats-card-content">
								<p className="stats-value">45,250 DT</p>
								<div className="stats-trend positive">
									<ArrowUpRight size={16} />
									<span>+8.2%</span>
								</div>
							</div>
							<p className="stats-period">Depuis le mois dernier</p>
						</div>

						<div className="stats-card">
							<div className="stats-card-header">
								<h3>Factures en attente</h3>
								<div className="stats-icon orange">
									<Clock size={20} />
								</div>
							</div>
							<div className="stats-card-content">
								<p className="stats-value">28</p>
								<div className="stats-trend negative">
									<ArrowDownRight size={16} />
									<span>-3.1%</span>
								</div>
							</div>
							<p className="stats-period">Depuis le mois dernier</p>
						</div>

						<div className="stats-card">
							<div className="stats-card-header">
								<h3>Transactions du jour</h3>
								<div className="stats-icon purple">
									<Calendar size={20} />
								</div>
							</div>
							<div className="stats-card-content">
								<p className="stats-value">32</p>
								<div className="stats-trend positive">
									<ArrowUpRight size={16} />
									<span>+4.8%</span>
								</div>
							</div>
							<p className="stats-period">Par rapport à hier</p>
						</div>
					</div>

					{/* Recent Invoices */}
					<div className="content-section">
						<div className="section-header">
							<h2>Factures récentes</h2>
							<a href="/factures" className="view-all">
								Voir tout
							</a>
						</div>

						<div className="table-container">
							<table className="data-table">
								<thead>
									<tr>
										<th>N° Facture</th>
										<th>Client</th>
										<th>Date</th>
										<th>Montant</th>
										<th>Statut</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>FAC-2023-001</td>
										<td>Société ABC</td>
										<td>03/05/2023</td>
										<td>1,250.00 DT</td>
										<td>
											<span className="status-badge paid">Payée</span>
										</td>
										<td>
											<button className="action-button">Détails</button>
										</td>
									</tr>
									<tr>
										<td>FAC-2023-002</td>
										<td>Entreprise XYZ</td>
										<td>02/05/2023</td>
										<td>3,450.75 DT</td>
										<td>
											<span className="status-badge pending">En attente</span>
										</td>
										<td>
											<button className="action-button">D��tails</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="content-section">
						<div className="section-header">
							<h2>Actions rapides</h2>
						</div>

						<div className="quick-actions">
							<a href="/factures/nouvelle" className="quick-action-card">
								<div className="quick-action-icon">
									<FileText size={24} />
								</div>
								<h3>Nouvelle facture</h3>
								<p>Créer une nouvelle facture</p>
							</a>

							<a href="/caisse/transaction" className="quick-action-card">
								<div className="quick-action-icon">
									<CreditCard size={24} />
								</div>
								<h3>Transaction caisse</h3>
								<p>Enregistrer une transaction</p>
							</a>

							<a href="/rapports/generer" className="quick-action-card">
								<div className="quick-action-icon">
									<PieChart size={24} />
								</div>
								<h3>Générer rapport</h3>
								<p>Créer un nouveau rapport</p>
							</a>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default Acceuil;
