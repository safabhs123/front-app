import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	FileText,
	Home,
	LogOut,
	PieChart,
	X,
	CreditCard,
	Menu,
	ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./GererCaisse.css";
import {
	Box,
	Button,
	Typography,
	Paper,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	FormControl,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
export default function GererCaisse() {
	const navigate = useNavigate();

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

	const [caisse, setCaisse] = useState({
		idCaisse: "",
		region: "",
		transporteur: "",
		typeDeFonds: "",
	});

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedidCaisse, setselectedidCaisse] = useState(null);
	const [caisses, setCaisses] = useState([]);
	const [editId, setEditId] = useState(null);
	const [regions, setRegions] = useState([]);
	const [transporteurs, setTransporteurs] = useState([]);
	const [typesDeFonds, setTypesDeFonds] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:8080/api/caisses/regions")
			.then((res) => setRegions(res.data));
		axios
			.get("http://localhost:8080/api/caisses/transporteurs")
			.then((res) => setTransporteurs(res.data));
		axios
			.get("http://localhost:8080/api/caisses/type-fonds")
			.then((res) => setTypesDeFonds(res.data));
		loadCaisses();
		console.log("Régions disponibles :", regions);
		console.log("Région actuelle dans caisse:", caisse.region);
	}, []);
	const loadCaisses = () => {
		axios
			.get("http://localhost:8080/api/caisses/all")
			.then((res) => setCaisses(res.data));
	};

	const handleChange = (e) => {
		setCaisse({ ...caisse, [e.target.name]: e.target.value });
	};

	const handleAdd = () => {
		console.log("Données envoyées :", caisse);

		axios
			.post("http://localhost:8080/api/caisses/add", caisse)
			.then(() => {
				loadCaisses();
				setCaisse({
					idCaisse: "",
					region: "",
					transporteur: "",
					typeDeFonds: "",
				});
				setEditId(null);
			})
			.catch((error) => {
				if (error.response) {
					console.error("Erreur backend :", error.response.data); // 👈 ici on capture l’erreur réelle
				} else {
					console.error("Erreur inconnue :", error);
				}
			});
	};

	const handleEdit = () => {
		axios
			.put(`http://localhost:8080/api/caisses/update/${editId}`, caisse)
			.then(() => {
				loadCaisses();
				setCaisse({
					idCaisse: "",
					region: "",
					transporteur: "",
					typeDeFonds: "",
				});
				setEditId(null);
			})
			.catch((err) => console.error("Error editing caisse: ", err));
	};

	const handleOpenDialog = (id) => {
		setselectedidCaisse(id);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setselectedidCaisse(null);
		setOpenDialog(false);
	};
	const getRegionFromId = (idCaisse) => {
		if (!idCaisse) return "";

		const cleanedId = idCaisse.trim(); // Enlève les espaces
		const prefix = cleanedId.substring(0, 5); // Prend les 5 premiers caractères

		switch (prefix) {
			case "00099":
				return "Tunis";
			case "00199":
				return "Sousse";
			case "00299":
				return "Nabeul";
			case "00399":
				return "Sfax";
			case "00499":
				return "Gabes";
			case "00599":
				return "Gafsa";
			case "00699":
				return "Jendouba";
			case "00799":
				return "Medenin";
			default:
				return "Inconnue";
		}
	};
	const confirmDelete = () => {
		axios
			.delete(`http://localhost:8080/api/caisses/delete/${selectedidCaisse}`)
			.then(() => {
				loadCaisses();
				handleCloseDialog();
			})
			.catch((err) => console.error("Erreur suppression :", err));
	};
	const isEditing = editId !== null;

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
						<li>
							<Link to="/accueil">
								<Home size={20} />
								<span>Tableau de bord</span>
							</Link>
						</li>
						<li className="active">
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
						<Link to="/controle-factures" className="back-link">
							<ArrowLeft size={20} />
							<span>Retour aux factures</span>
						</Link>
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
					<Box p={3}>
						<Box display="flex" gap={4}>
							<Box flex={1}>
								<Paper elevation={3} sx={{ p: 3 }}>
									<Typography variant="h6" gutterBottom>
										Ajouter / Modifier une Caisse
									</Typography>

									<TextField
										fullWidth
										label="ID Caisse"
										name="idCaisse"
										value={caisse.idCaisse}
										onChange={(e) => {
											const id = e.target.value;
											if (!isEditing) {
												setCaisse({
													...caisse,
													idCaisse: id,
													region: getRegionFromId(id),
												});
											}
										}}
										InputProps={{ readOnly: isEditing }}
										sx={{ mb: 2 }}
									/>

									<FormControl fullWidth sx={{ mb: 2 }}>
										<TextField
											label="Région"
											name="region"
											value={caisse.region}
											InputProps={{ readOnly: isEditing }}
											fullWidth
										/>
									</FormControl>

									<FormControl fullWidth sx={{ mb: 2 }}>
										<InputLabel>Transporteur</InputLabel>
										<Select
											name="transporteur"
											value={caisse.transporteur}
											onChange={handleChange}
											label="Transporteur"
										>
											{transporteurs.map((t) => (
												<MenuItem key={t} value={t}>
													{t}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<FormControl fullWidth sx={{ mb: 2 }}>
										<InputLabel>Type de Fonds</InputLabel>
										<Select
											name="typeDeFonds"
											value={caisse.typeDeFonds}
											onChange={handleChange}
											label="Type de Fonds"
										>
											{typesDeFonds.map((f) => (
												<MenuItem key={f} value={f}>
													{f}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<Button
										variant="contained"
										onClick={editId ? handleEdit : handleAdd}
									>
										{editId ? "Modifier" : "Ajouter"}
									</Button>
								</Paper>
							</Box>

							{/* LISTE */}
							<Box flex={1}>
								<Typography variant="h6" gutterBottom>
									Liste des Caisses
								</Typography>
								{caisses.map((c) => (
									<Paper key={c.idCaisse} sx={{ p: 2, mb: 2 }}>
										<Typography>
											<strong>ID :</strong> {c.idCaisse}
										</Typography>
										<Typography>
											<strong>Région :</strong> {c.region}
										</Typography>
										<Typography>
											<strong>Transporteur :</strong> {c.transporteur}
										</Typography>
										<Typography>
											<strong>Type de Fonds :</strong> {c.typeDeFonds}
										</Typography>
										<Box mt={1}>
											<Button
												size="small"
												onClick={() => {
													setCaisse(c);
													setEditId(c.idCaisse);
												}}
											>
												Modifier
											</Button>
											<Button
												size="small"
												color="error"
												onClick={() => handleOpenDialog(c.idCaisse)}
												sx={{ ml: 2 }}
											>
												Supprimer
											</Button>
										</Box>
									</Paper>
								))}
							</Box>
						</Box>

						{/* Boîte de dialogue de confirmation */}
						<Dialog open={openDialog} onClose={handleCloseDialog}>
							<DialogTitle>Confirmer la suppression</DialogTitle>
							<DialogContent>
								<DialogContentText>
									Êtes-vous sûr de vouloir supprimer cette caisse ? Cette action
									est irréversible.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleCloseDialog}>Annuler</Button>
								<Button
									onClick={confirmDelete}
									color="error"
									variant="contained"
								>
									Supprimer
								</Button>
							</DialogActions>
						</Dialog>
					</Box>
				</div>
			</main>
		</div>
	);
}
