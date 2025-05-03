import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import "./FormFacture.css"; // Import du CSS
import {
	FileText,
	Home,
	LogOut,
	Menu,
	PieChart,
	X,
	CreditCard,
	Plus,
	Save,
	Trash2,
	FileIcon,
	FilePlus,
	FileSpreadsheet,
	ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
function FactureForm() {
	const navigate = useNavigate();

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [userName, setUserName] = useState("");
	const [userRole, setUserRole] = useState("");
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

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	const [facture, setFacture] = useState({
		numero: "",
		periode: "",
		moisAnnee: "",
		dateDebut: "",
		dateFin: "",
		dateFacture: "",
		caisseId: "",
		transporteur: "EXPRESS",
		lignes: [],
	});

	const [region, setRegion] = useState("");
	const [agences, setAgences] = useState([]);
	const [factureFormattee, setFactureFormattee] = useState("");

	const toutesLesAgences = [
		{ nom: "AGC001", region: "Tunis" },
		{ nom: "AGC002", region: "Sousse" },
		{ nom: "AGC003", region: "Tunis" },
		{ nom: "AGC004", region: "Sfax" },
	];

	const handleCaisseChange = (e) => {
		const caisseId = e.target.value;
		setFacture((prev) => ({ ...prev, caisseId }));

		const region = getRegionFromId(caisseId);
		setRegion(region);

		const agencesFiltrees = toutesLesAgences
			.filter((ag) => ag.region === region)
			.map((ag) => ag.nom);

		setAgences(agencesFiltrees);
	};

	const getRegionFromId = (idCaisse) => {
		if (!idCaisse) return "";
		if (idCaisse.startsWith("00099")) return "Tunis";
		if (idCaisse.startsWith("00199")) return "Sousse";
		if (idCaisse.startsWith("00299")) return "Nabeul";
		if (idCaisse.startsWith("00399")) return "Sfax";
		if (idCaisse.startsWith("00499")) return "Gabes";
		if (idCaisse.startsWith("00599")) return "Gafsa";
		if (idCaisse.startsWith("00699")) return "Jendouba";
		if (idCaisse.startsWith("00799")) return "Medenin";

		return "Inconnue";
	};

	const addLigne = () => {
		setFacture({
			...facture,
			lignes: [
				...facture.lignes,
				{
					agence: "",
					date: "",
					naturePassage: "",
					nbPassages: 0,
					resultatPassage: "",
					coutTRP: 0,
					coutTRT: 0,
					totalHT: 0,
					collectePqBDT: 0,
					collecteKDV: 0,
					collecteSMDT: 0,
					alimentationPqBDT: 0,
					alimentationSMDT: 0,
					remiseKDV: 0,
				},
			],
		});
	};

	const handleLigneChange = (index, field, value) => {
		const lignes = [...facture.lignes];
		lignes[index][field] = value;
		if (field === "coutTRP" || field === "coutTRT") {
			const trp = Number.parseFloat(lignes[index].coutTRP) || 0;
			const trt = Number.parseFloat(lignes[index].coutTRT) || 0;
			lignes[index].totalHT = trp + trt;
		}
		setFacture({ ...facture, lignes });
	};

	const removeLigne = (index) => {
		const lignes = [...facture.lignes];
		lignes.splice(index, 1);
		setFacture({ ...facture, lignes });
	};

	const generateFactureText = () => {
		let totalHT = 0;
		let totalCollectePqBDT = 0;
		let totalCollecteKDV = 0;
		let totalCollecteSMDT = 0;
		let totalAlimentationPqBDT = 0;
		let totalAlimentationSMDT = 0;
		let totalRemiseKDV = 0;

		const lignesText = facture.lignes
			.map((ligne, i) => {
				const totalLigne = Number.parseFloat(ligne.totalHT || 0);
				totalHT += totalLigne;
				totalCollectePqBDT += Number.parseFloat(ligne.collectePqBDT || 0);
				totalCollecteKDV += Number.parseFloat(ligne.collecteKDV || 0);
				totalCollecteSMDT += Number.parseFloat(ligne.collecteSMDT || 0);
				totalAlimentationPqBDT += Number.parseFloat(
					ligne.alimentationPqBDT || 0
				);
				totalAlimentationSMDT += Number.parseFloat(ligne.alimentationSMDT || 0);
				totalRemiseKDV += Number.parseFloat(ligne.remiseKDV || 0);

				return `| ${String(i + 1).padStart(2)} | ${ligne.agence.padEnd(17)} | ${
					ligne.date
				} | ${ligne.naturePassage.padEnd(20)} | ${ligne.nbPassages
					.toString()
					.padStart(3)} | ${ligne.resultatPassage.padEnd(
					15
				)} | ${Number.parseFloat(ligne.coutTRP || 0)
					.toFixed(2)
					.padStart(6)} | ${Number.parseFloat(ligne.coutTRT || 0)
					.toFixed(2)
					.padStart(6)} | ${totalLigne.toFixed(0).padStart(6)} |`;
			})
			.join("\n");

		return `FACTURE TRANSPORTEUR - ${region}
Transporteur : ${facture.transporteur}
Date facture : ${facture.dateFacture}
Période      : ${
			facture.periode === "MENSUELLE"
				? facture.moisAnnee
				: `${facture.dateDebut} à ${facture.dateFin}`
		}
N° Facture   : ${facture.numero}

| #  | Agence             | Date       | Nature du Passage     | Nb  | Résultat Passage | TRP   | TRT   | Total |
|----|--------------------|------------|------------------------|-----|------------------|-------|-------|--------|
${lignesText}
------------------------------------------------------------------------------------------
TOTAL HT : ${totalHT.toFixed(0)}
...

TOTAL Collecte :
  - PqB.dt : ${Number(totalCollectePqBDT).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}
  - K°DV   : ${Number(totalCollecteKDV).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}
  - S°M.dt : ${Number(totalCollecteSMDT).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}

TOTAL Alimentation :
  - PqB.dt : ${Number(totalAlimentationPqBDT).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}
  - S°M.dt : ${Number(totalAlimentationSMDT).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}

TOTAL Remise :
  - K°DV   : ${Number(totalRemiseKDV).toLocaleString("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})}`;
	};

	const handleSubmit = async () => {
		// Validation
		if (!facture.numero) {
			alert("Veuillez saisir un numéro de facture");
			return;
		}

		if (!facture.periode) {
			alert("Veuillez sélectionner une période");
			return;
		}

		if (facture.periode === "MENSUELLE" && !facture.moisAnnee) {
			alert("Veuillez saisir le mois/année");
			return;
		}

		if (
			facture.periode === "QUOTIDIENNE" &&
			(!facture.dateDebut || !facture.dateFin)
		) {
			alert("Veuillez saisir les dates de début et de fin");
			return;
		}

		if (!facture.dateFacture) {
			alert("Veuillez saisir la date de facture");
			return;
		}

		if (!facture.caisseId) {
			alert("Veuillez saisir l'ID de caisse");
			return;
		}

		if (facture.lignes.length === 0) {
			alert("Veuillez ajouter au moins une ligne à la facture");
			return;
		}

		const payload = { ...facture, region };
		if (facture.periode === "MENSUELLE") {
			delete payload.dateDebut;
			delete payload.dateFin;
		} else if (facture.periode === "QUOTIDIENNE") {
			delete payload.moisAnnee;
		}

		try {
			const response = await axios.post(
				"http://localhost:8080/api/factures/add",
				payload
			);
			if (response.status === 200 || response.status === 201) {
				alert("✅ Facture enregistrée avec succès !");
				setFactureFormattee(generateFactureText());
			} else {
				alert("⚠️ Réponse inattendue.");
			}
		} catch (error) {
			console.error("Erreur :", error);
			alert("❌ Une erreur est survenue.");
		}
	};

	const exportPDF = () => {
		if (!factureFormattee) {
			alert("La facture doit être générée avant l'exportation.");
			return;
		}

		const doc = new jsPDF();
		doc.setFontSize(12);
		doc.text(`Facture Transporteur - ${region}`, 14, 10);
		doc.text(`Transporteur : ${facture.transporteur}`, 14, 18);
		doc.text(`Date facture : ${facture.dateFacture}`, 14, 26);
		doc.text(`N° Facture   : ${facture.numero}`, 14, 34);

		const rows = facture.lignes.map((ligne, i) => [
			i + 1,
			ligne.agence,
			ligne.date,
			ligne.naturePassage,
			ligne.nbPassages,
			ligne.resultatPassage,
			ligne.coutTRP,
			ligne.coutTRT,
			ligne.totalHT,
		]);

		autoTable(doc, {
			startY: 42,
			head: [
				[
					"#",
					"Agence",
					"Date",
					"Nature",
					"Nb",
					"Résultat",
					"TRP",
					"TRT",
					"Total",
				],
			],
			body: rows,
		});

		doc.save(`facture-${facture.numero}.pdf`);
	};

	const exportExcel = () => {
		if (!factureFormattee) {
			alert("La facture doit être générée avant l'exportation.");
			return;
		}

		const worksheetData = facture.lignes.map((ligne, i) => ({
			"#": i + 1,
			Agence: ligne.agence,
			Date: ligne.date,
			"Nature du passage": ligne.naturePassage,
			"Nb passages": ligne.nbPassages,
			Résultat: ligne.resultatPassage,
			"Coût TRP": ligne.coutTRP,
			"Coût TRT": ligne.coutTRT,
			"Total HT": ligne.totalHT,
		}));

		const worksheet = XLSX.utils.json_to_sheet(worksheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Facture");

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		saveAs(blob, `facture-${facture.numero}.xlsx`);
	};

	const exportFacture = () => {
		if (!factureFormattee) {
			alert("La facture doit être générée avant l'exportation.");
			return;
		}

		const blob = new Blob([factureFormattee], {
			type: "text/plain;charset=utf-8",
		});
		saveAs(blob, `facture_${facture.numero}.txt`);
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
						<li>
							<Link to="/acceuil">
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
					<div className="page-header">
						<div>
							<h1>Création de Facture</h1>
							<p className="date-display">{currentDate}</p>
						</div>
						<div className="page-actions">
							<button
								className="action-button secondary"
								onClick={() => navigate("/controle-factures")}
							>
								<ArrowLeft size={16} />
								<span>Annuler</span>
							</button>
							<button className="action-button primary" onClick={handleSubmit}>
								<Save size={16} />
								<span>Valider Facture</span>
							</button>
						</div>
					</div>

					{/* Form */}
					<div className="form-container">
						<div className="form-section">
							<h2 className="section-title">Informations Générales</h2>
							<div className="filters-container">
								<div className="form-group">
									<label htmlFor="numero">N° Facture</label>
									<input
										type="text"
										id="numero"
										placeholder="N° facture"
										value={facture.numero}
										onChange={(e) =>
											setFacture({ ...facture, numero: e.target.value })
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="periode">Période</label>
									<select
										id="periode"
										value={facture.periode}
										onChange={(e) =>
											setFacture({ ...facture, periode: e.target.value })
										}
									>
										<option value="">-- Sélectionner la période --</option>
										<option value="MENSUELLE">Mensuelle</option>
										<option value="QUOTIDIENNE">Quotidienne</option>
									</select>
								</div>

								{facture.periode === "MENSUELLE" && (
									<div className="form-group">
										<label htmlFor="moisAnnee">Mois/Année</label>
										<input
											type="text"
											id="moisAnnee"
											placeholder="MM/AAAA"
											value={facture.moisAnnee}
											onChange={(e) =>
												setFacture({ ...facture, moisAnnee: e.target.value })
											}
										/>
									</div>
								)}

								{facture.periode === "QUOTIDIENNE" && (
									<>
										<div className="form-group">
											<label htmlFor="dateDebut">Date Début</label>
											<input
												type="date"
												id="dateDebut"
												value={facture.dateDebut}
												onChange={(e) =>
													setFacture({ ...facture, dateDebut: e.target.value })
												}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="dateFin">Date Fin</label>
											<input
												type="date"
												id="dateFin"
												value={facture.dateFin}
												onChange={(e) =>
													setFacture({ ...facture, dateFin: e.target.value })
												}
											/>
										</div>
									</>
								)}

								<div className="form-group">
									<label htmlFor="dateFacture">Date Facture</label>
									<input
										type="date"
										id="dateFacture"
										value={facture.dateFacture}
										onChange={(e) =>
											setFacture({ ...facture, dateFacture: e.target.value })
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="caisseId">ID Caisse</label>
									<input
										type="text"
										id="caisseId"
										placeholder="ID Caisse"
										value={facture.caisseId}
										onChange={handleCaisseChange}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="transporteur">Transporteur</label>
									<select
										id="transporteur"
										value={facture.transporteur}
										onChange={(e) =>
											setFacture({ ...facture, transporteur: e.target.value })
										}
									>
										<option value="EXPRESS">EXPRESS</option>
										<option value="IBS">IBS</option>
										<option value="YOSR">YOSR</option>
									</select>
								</div>

								{region && (
									<p className="input-hint">
										🏙️ Région détectée : <strong>{region}</strong>
									</p>
								)}
							</div>
						</div>

						<div className="form-section">
							<div className="section-header">
								<h2 className="section-title">Lignes de Facture</h2>
								<button className="add-line-button" onClick={addLigne}>
									<Plus size={16} />
									<span>Ajouter une ligne</span>
								</button>
							</div>

							{facture.lignes.length === 0 ? (
								<div className="empty-state">
									<FileText size={48} className="empty-icon" />
									<p>Aucune ligne de facture ajoutée</p>
									<button className="add-line-button" onClick={addLigne}>
										<Plus size={16} />
										<span>Ajouter une ligne</span>
									</button>
								</div>
							) : (
								facture.lignes.map((ligne, index) => (
									<div key={index} className="ligne-facture">
										<div className="ligne-header">
											<h3>Ligne {index + 1}</h3>
											<button
												className="remove-line-button"
												onClick={() => removeLigne(index)}
											>
												<Trash2 size={16} />
											</button>
										</div>

										<div className="form-grid">
											<div className="form-group">
												<label>Agence</label>
												<select
													value={ligne.agence}
													onChange={(e) =>
														handleLigneChange(index, "agence", e.target.value)
													}
												>
													<option value="">-- Choisir agence --</option>
													{agences.map((agence, idx) => (
														<option key={idx} value={agence}>
															{agence}
														</option>
													))}
												</select>
											</div>

											<div className="form-group">
												<label>Date</label>
												<input
													type="date"
													value={ligne.date}
													onChange={(e) =>
														handleLigneChange(index, "date", e.target.value)
													}
												/>
											</div>

											<div className="form-group">
												<label>Nature du passage</label>
												<input
													type="text"
													placeholder="Nature du passage"
													value={ligne.naturePassage}
													onChange={(e) =>
														handleLigneChange(
															index,
															"naturePassage",
															e.target.value
														)
													}
												/>
											</div>

											<div className="form-group">
												<label>Nb Passages</label>
												<input
													type="number"
													placeholder="Nb Passages"
													value={ligne.nbPassages}
													onChange={(e) =>
														handleLigneChange(
															index,
															"nbPassages",
															e.target.value
														)
													}
												/>
											</div>

											<div className="form-group">
												<label>Résultat passage</label>
												<select
													value={ligne.resultatPassage}
													onChange={(e) =>
														handleLigneChange(
															index,
															"resultatPassage",
															e.target.value
														)
													}
												>
													<option value="">-- Résultat passage --</option>
													<option value="REALISE">Réalisé</option>
													<option value="NEANT+CACHET">Néant + Cachet</option>
												</select>
											</div>
										</div>

										<div className="form-grid">
											<div className="form-group">
												<label>Coût TRP</label>
												<input
													type="number"
													placeholder="Coût TRP"
													value={ligne.coutTRP}
													onChange={(e) =>
														handleLigneChange(index, "coutTRP", e.target.value)
													}
												/>
											</div>

											<div className="form-group">
												<label>Coût TRT</label>
												<input
													type="number"
													placeholder="Coût TRT"
													value={ligne.coutTRT}
													onChange={(e) =>
														handleLigneChange(index, "coutTRT", e.target.value)
													}
												/>
											</div>

											<div className="form-group">
												<label>Total HT</label>
												<input
													type="number"
													placeholder="Total HT"
													value={ligne.totalHT}
													readOnly
													className="readonly-input"
												/>
											</div>
										</div>

										<div className="form-subgrid">
											<div className="form-subgroup">
												<h4>Collecte</h4>
												<div className="form-grid">
													<div className="form-group">
														<label>PqBDT</label>
														<input
															type="number"
															placeholder="PqBDT"
															value={ligne.collectePqBDT}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"collectePqBDT",
																	e.target.value
																)
															}
														/>
													</div>
													<div className="form-group">
														<label>KDV</label>
														<input
															type="number"
															placeholder="KDV"
															value={ligne.collecteKDV}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"collecteKDV",
																	e.target.value
																)
															}
														/>
													</div>
													<div className="form-group">
														<label>SMDT</label>
														<input
															type="number"
															placeholder="SMDT"
															value={ligne.collecteSMDT}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"collecteSMDT",
																	e.target.value
																)
															}
														/>
													</div>
												</div>
											</div>

											<div className="form-subgroup">
												<h4>Alimentation</h4>
												<div className="form-grid">
													<div className="form-group">
														<label>PqBDT</label>
														<input
															type="number"
															placeholder="PqBDT"
															value={ligne.alimentationPqBDT}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"alimentationPqBDT",
																	e.target.value
																)
															}
														/>
													</div>
													<div className="form-group">
														<label>SMDT</label>
														<input
															type="number"
															placeholder="SMDT"
															value={ligne.alimentationSMDT}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"alimentationSMDT",
																	e.target.value
																)
															}
														/>
													</div>
												</div>
											</div>

											<div className="form-subgroup">
												<h4>Remise</h4>
												<div className="form-grid">
													<div className="form-group">
														<label>KDV</label>
														<input
															type="number"
															placeholder="KDV"
															value={ligne.remiseKDV}
															onChange={(e) =>
																handleLigneChange(
																	index,
																	"remiseKDV",
																	e.target.value
																)
															}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						<div className="form-section">
							<h2 className="section-title">Aperçu de la Facture</h2>
							<pre className="facture-preview">{factureFormattee}</pre>
							<div className="export-actions">
								<button className="export-button text" onClick={exportFacture}>
									<FileIcon size={16} />
									<span>Exporter TXT</span>
								</button>
								<button className="export-button pdf" onClick={exportPDF}>
									<FilePlus size={16} />
									<span>Exporter PDF</span>
								</button>
								<button className="export-button excel" onClick={exportExcel}>
									<FileSpreadsheet size={16} />
									<span>Exporter Excel</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default FactureForm;
