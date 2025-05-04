// src/Pages/ControleFacture.jsx
import React, { useEffect, useState } from "react";
import {
	Menu,
	X,
	Home,
	FileText,
	CreditCard,
	PieChart,
	LogOut,
	Plus,
	Search,
	ChevronDown,
} from "lucide-react";
import "./Controle-factures.css";
import { Link } from "react-router-dom";
const ControleFacture = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [userName, setUserName] = useState("");
	const [userRole, setUserRole] = useState("");
	const [currentDate, setCurrentDate] = useState("");
	const [factures, setFactures] = useState([
		{
			id: "FAC-2023-001",
			numero: "FAC-2023-001",
			transporteur: "EXPRESS",
			region: "Tunis",
			dateFacture: "2023-05-03",
			montant: 1250.0,
			statut: "Validée",
		},
		{
			id: "FAC-2023-002",
			numero: "FAC-2023-002",
			transporteur: "IBS",
			region: "Sousse",
			dateFacture: "2023-05-02",
			montant: 3450.75,
			statut: "En attente",
		},
		{
			id: "FAC-2023-003",
			numero: "FAC-2023-003",
			transporteur: "YOSR",
			region: "Sfax",
			dateFacture: "2023-05-01",
			montant: 875.5,
			statut: "Validée",
		},
		{
			id: "FAC-2023-004",
			numero: "FAC-2023-004",
			transporteur: "EXPRESS",
			region: "Nabeul",
			dateFacture: "2023-04-30",
			montant: 450.0,
			statut: "Rejetée",
		},
		{
			id: "FAC-2023-005",
			numero: "FAC-2023-005",
			transporteur: "IBS",
			region: "Tunis",
			dateFacture: "2023-04-29",
			montant: 2100.25,
			statut: "Validée",
		},
	]);

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

	const handleLogout = () => {
		localStorage.removeItem("role");
		localStorage.removeItem("matricule");
		localStorage.removeItem("motDePasse");
		window.location.href = "/";
	};

	const handleGererCaisse = () => {
		window.location.href = "/gerer-caisse";
	};

	const handleNouvelleFacture = () => {
		window.location.href = "/formfacture";
	};

	return (
		<div className="dashboard-container">
			{/* Sidebar */}
			<aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
				<div className="sidebar-header">
					<img
						src="/assetsss/logo/logo-full.png"
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
				<header className="dashboard-header">
					<div className="header-left">
						<button className="menu-toggle" onClick={toggleSidebar}>
							<Menu size={24} />
						</button>
						<div className="search-container">
							<Search size={20} className="search-icon" />
							<input
								type="text"
								placeholder="Rechercher une facture..."
								className="search-input"
							/>
						</div>
					</div>

					<div className="header-right">
						<div className="user-info">
							<span className="user-name">{userName}</span>
							<span className="user-role">{userRole}</span>
						</div>
					</div>
				</header>

				{/* Dashboard Content */}
				<div className="dashboard-content">
					<div className="page-header">
						<div>
							<h1>Contrôle des Factures</h1>
							<p className="date-display">{currentDate}</p>
						</div>
						<div className="page-actions">
							<button
								className="action-button secondary"
								onClick={handleGererCaisse}
							>
								<CreditCard size={16} />
								<span>Gérer Caisse</span>
							</button>
							<button
								className="action-button primary"
								onClick={handleNouvelleFacture}
							>
								<Plus size={16} />
								<span>Nouvelle Facture</span>
							</button>
						</div>
					</div>

					{/* Filters */}
					<div className="filters-container">
						<div className="filters-actions">
							<div className="filter">
								<label>Transporteur</label>
								<div className="select-wrapper ">
									<select>
										<option value="">Tous</option>
										<option value="EXPRESS">EXPRESS</option>
										<option value="IBS">IBS</option>
										<option value="YOSR">YOSR</option>
									</select>
									<ChevronDown size={16} className="select-icon" />
								</div>
							</div>

							<div className="filter">
								<label>Région</label>
								<div className="select-wrapper">
									<select>
										<option value="">Toutes</option>
										<option value="Tunis">Tunis</option>
										<option value="Sousse">Sousse</option>
										<option value="Sfax">Sfax</option>
										<option value="Nabeul">Nabeul</option>
									</select>
									<ChevronDown size={16} className="select-icon" />
								</div>
							</div>

							<div className="filter">
								<label>Statut</label>
								<div className="select-wrapper">
									<select>
										<option value="">Tous</option>
										<option value="Validée">Validée</option>
										<option value="En attente">En attente</option>
										<option value="Rejetée">Rejetée</option>
									</select>
									<ChevronDown size={16} className="select-icon" />
								</div>
							</div>

							<div className="filter">
								<label>Date</label>
								<input type="date" className="date-input" />
							</div>
						</div>
					</div>

					{/* Factures Table */}
					<div className="content-section">
						<div className="table-container">
							<table className="data-table">
								<thead>
									<tr>
										<th>N° Facture</th>
										<th>Transporteur</th>
										<th>Région</th>
										<th>Date</th>
										<th>Montant</th>
										<th>Statut</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{factures.map((facture) => (
										<tr key={facture.id}>
											<td>{facture.numero}</td>
											<td>{facture.transporteur}</td>
											<td>{facture.region}</td>
											<td>{facture.dateFacture}</td>
											<td>{facture.montant.toFixed(2)} DT</td>
											<td>
												<span
													className={`status-badge ${
														facture.statut === "Validée"
															? "paid"
															: facture.statut === "En attente"
															? "pending"
															: "overdue"
													}`}
												>
													{facture.statut}
												</span>
											</td>
											<td>
												<div className="table-actions">
													<button className="table-action-button">Voir</button>
													<button className="table-action-button">
														Modifier
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Pagination */}
					<div className="pagination">
						<button className="pagination-button" disabled>
							&laquo; Précédent
						</button>
						<div className="pagination-numbers">
							<button className="pagination-number active">1</button>
							<button className="pagination-number">2</button>
							<button className="pagination-number">3</button>
						</div>
						<button className="pagination-button">Suivant &raquo;</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ControleFacture;
