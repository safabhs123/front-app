"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Home, FileText, CreditCard, PieChart, LogOut, User, ChevronDown } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Controle-factures.css"
import RapportModalBootstrap from "./RapportModalBootstrap"

function ControleFactures() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role") || "ADMIN_FUNCTIONAL"
  const displayName = localStorage.getItem("displayName") || "Utilisateur"

  // Dashboard states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("factures")

  // Invoice control states
  const [fichierBanque, setFichierBanque] = useState(null)
  const [fichierTransporteur, setFichierTransporteur] = useState(null)
  const [comparaisonResult, setComparaisonResult] = useState([])
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(null)
  const [detailsBanque, setDetailsBanque] = useState([])
  const [detailsTransport, setDetailsTransport] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (role !== "ADMIN_FUNCTIONAL") {
      navigate("/acceuil")
    }
  }, [role, navigate])

  // Dashboard functions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("displayName")
    localStorage.removeItem("token")
    navigate("/", { replace: true })
  }

  // Invoice control functions
  const formatDateFR = (dateStr) => {
    console.log("welcome from formatDateFR:")
    console.log("date:", dateStr)

    if (!dateStr) return ""

    const [year, month, day] = dateStr.split("-").map(Number)
    const d = new Date(year, month - 1, day)
    console.log("manually constructed Date:", d)

    return d.toLocaleDateString("fr-FR")
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (type === "banque") setFichierBanque(file)
    else if (type === "transporteur") setFichierTransporteur(file)
  }

  const handleSubmit = async () => {
    if (!fichierBanque || !fichierTransporteur) {
      alert("Veuillez sélectionner les deux fichiers.")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("fichierBanque", fichierBanque)
    formData.append("fichierTransporteur", fichierTransporteur)

    try {
      const response = await axios.post("/api/comparaison/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setComparaisonResult(response.data)
    } catch (error) {
      console.error("Erreur lors de la comparaison :", error)
      alert("Erreur lors de la comparaison des fichiers.")
    } finally {
      setLoading(false)
    }
  }

  const handleVoirDetails = async (index, date) => {
    console.log(index, date)

    const formattedDate = formatDateFR(date)
    console.log(" formattedDate : ", formattedDate)

    if (selectedDetailIndex === index && selectedDate === date) {
      setSelectedDetailIndex(null)
      setSelectedDate(null)
      setDetailsBanque([])
      setDetailsTransport([])
      return
    }

    setSelectedDetailIndex(index)
    setSelectedDate(formattedDate)

    if (!fichierBanque || !fichierTransporteur) {
      alert("Veuillez sélectionner les fichiers.")
      return
    }

    try {
      const formDataBanque = new FormData()
      formDataBanque.append("file", fichierBanque)

      const formDataTransport = new FormData()
      formDataTransport.append("file", fichierTransporteur)

      await Promise.all([
        axios.post("http://localhost:8080/api/details/banque/upload", formDataBanque),
        axios.post("http://localhost:8080/api/details/transport/upload", formDataTransport),
      ])

      const [resBanque, resTransport] = await Promise.all([
        axios.get("http://localhost:8080/api/details/banque", {
          params: { date: formattedDate },
        }),
        axios.get("http://localhost:8080/api/details/transport", {
          params: { date: formattedDate },
        }),
      ])

      setDetailsBanque(resBanque.data)
      setDetailsTransport(resTransport.data)
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error)
      alert("Erreur lors du chargement des détails.")
    }
  }

const [rapport, setRapport] = useState([]);

// const handleGenererRapport = async () => {
//   if (!fichierBanque || !fichierTransporteur) {
//     alert("Veuillez sélectionner les deux fichiers !");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("banque", fichierBanque);
//   formData.append("transport", fichierTransporteur);

//   try {
//     const response = await axios.post("http://localhost:8080/api/rapport/generer", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     setRapport(response.data);
//     setShowModal(true); // Afficher la modal
//   } catch (error) {
//     console.error("Erreur lors de la génération du rapport", error);
//     alert("Erreur lors de la génération du rapport.");
//   }
// };
const [showModal, setShowModal] = useState(false);

  const handleGenererRapport = async () => {
    if (!fichierBanque || !fichierTransporteur) {
      alert("Veuillez sélectionner les deux fichiers !");
      return;
    }

    const formData = new FormData();
    formData.append("banque", fichierBanque);
    formData.append("transport", fichierTransporteur);

    try {
      const response = await axios.post("http://localhost:8080/api/rapport/generer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("rapport", JSON.stringify(response.data));
      setShowModal(true); // afficher le modal
    } catch (error) {
      console.error("Erreur lors de la génération du rapport", error);
      alert("Erreur lors de la génération du rapport.");
    }
  };



  if (!role) {
    return <div>Loading...</div>
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src="assetsss/logo/logo-full.png" alt="Logo" width={120} height={60} className="sidebar-logo" />
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {role === "ADMIN_USER" && (
              <li>
                <Link to="/utilisateurs">
                  <CreditCard size={20} />
                  <span>Gérer Utilisateurs</span>
                </Link>
              </li>
            )}
            {role === "ADMIN_FUNCTIONAL" && (
              <>
                <li className={activeTab === "acceuil" ? "active" : ""} onClick={() => setActiveTab("acceuil")}>
                  <Link to="/acceuil">
                    <Home size={20} />
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li className={activeTab === "factures" ? "active" : ""} onClick={() => setActiveTab("factures")}>
                  <Link to="/controle-factures">
                    <FileText size={20} />
                    <span>Factures</span>
                  </Link>
                </li>
                <li
                  className={activeTab === "gerer-caisse" ? "active" : ""}
                  onClick={() => setActiveTab("gerer-caisse")}
                >
                  <Link to="/gerer-caisse">
                    <FileText size={20} />
                    <span>Gerer Caisse</span>
                  </Link>
                </li>
               
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`} style={{width : '100%' }}>
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <button className="user-menu-button" onClick={toggleMobileMenu}>
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-role">{role}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {mobileMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profil">
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

        <div className="dashboard-content">
          
          <section className="controle-factures">
            <h2>Contrôle des factures</h2>

            <div className="import-container">
              <div className="file-inputs">
                <div className="file-group input-group">
                  <label htmlFor="banque-file">Fichier Banque :</label>
                  <input
                    type="file"
                    id="banque-file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileChange(e, "banque")}
                  />
                  {fichierBanque && <p>Fichier sélectionné : {fichierBanque.name}</p>}
                </div>

                <div className="file-group input-group">
                  <label htmlFor="transporteur-file">Fichier Transporteur :</label>
                  <input
                    type="file"
                    id="transporteur-file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileChange(e, "transporteur")}
                  />
                  {fichierTransporteur && <p>Fichier sélectionné : {fichierTransporteur.name}</p>}
                </div>
              </div>

              <div className="actions">
                <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Chargement..." : "Comparer"}
                </button>
                  <button onClick={handleGenererRapport} className="btn btn-primary">
        Générer le rapport
      </button>

      <RapportModalBootstrap show={showModal} onHide={() => setShowModal(false)} />

              </div>
            </div>

            {comparaisonResult.length > 0 && (
              <div className="table-container">
                <table className="comparaison-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Passages Banque</th>
                      <th>Montant Banque</th>
                      <th>Passages Transport</th>
                      <th>Montant Transport</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparaisonResult.map((ligne, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{ligne.date}</td>
                          <td>{ligne.nbPassagesBanque}</td>
                          <td>{(ligne.montantBanque ?? 0).toFixed(2)} DT</td>
                          <td>{ligne.nbPassagesTransporteur}</td>
                          <td>{(ligne.montantTransporteur ?? 0).toFixed(2)} DT</td>
                          <td>
                            <button onClick={() => handleVoirDetails(index, ligne.date)}>
                              {selectedDetailIndex === index && selectedDate === ligne.date
                                ? "Masquer"
                                : "Voir détails"}
                            </button>
                          </td>
                        </tr>

                        {selectedDetailIndex === index && (
                          <tr className="details-row">
                            <td colSpan="6">
                              <div className="details-container">
                                <div className="banque-details">
                                  <h4>Détails Banque</h4>
                                  {ligne.detailsBanque ? (
                                    <ul>
                                      <li>Date: {ligne.detailsBanque.date}</li>
                                      <li>Nombre passages: {ligne.detailsBanque.nbPassages}</li>
                                    </ul>
                                  ) : (
                                    <p>Aucun détail disponible</p>
                                  )}
                                </div>

                                <div className="transporteur-details">
                                  <h4>Détails Transporteur</h4>
                                  {ligne.detailsTransporteur ? (
                                    <ul>
                                      <li>Date: {ligne.detailsTransporteur.date}</li>
                                      <li>Nombre passages: {ligne.detailsTransporteur.nbPassages}</li>
                                      <li>TRP: {ligne.detailsTransporteur.trp}</li>
                                      <li>TRT: {ligne.detailsTransporteur.trt}</li>
                                      <li>Montant: {ligne.detailsTransporteur.montant.toFixed(2)} DT</li>
                                    </ul>
                                  ) : (
                                    <p>Aucun détail disponible</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {ligne.date && selectedDate && formatDateFR(ligne.date) === selectedDate && (
                          <tr>
                            <td colSpan="6">
                              <div className="matching-details">
                                <h5>Matching – Détails croisés pour la date {formatDateFR(ligne.date)}</h5>
                                <table className="details-table">
                                  <thead>
                                    <tr>
                                      <th>AGSA</th>
                                      <th>NOMP</th>
                                      <th>Type</th>
                                      <th>NbPass (Banque)</th>
                                      <th>Nature</th>
                                      <th>NbPass (Transp)</th>
                                      <th>TRP</th>
                                      <th>TRT</th>
                                      <th>Montant</th>
                                      <th>Résultat</th>
                                      <th>Libellé</th>
                                      <th>DATE (Banque)</th>
                                      <th>DATE (Transp)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {detailsBanque.map((banque, i) => {
                                      const transport = detailsTransport[i] || {}
                                      return (
                                        <tr key={i}>
                                          <td>{banque.agsa}</td>
                                          <td>{banque.nomp}</td>
                                          <td>{banque.type}</td>
                                          <td>{banque.nbPassages}</td>
                                          <td>{transport.nature}</td>
                                          <td>{transport.nbPassages}</td>
                                          <td>{transport.trp}</td>
                                          <td>{transport.trt}</td>
                                          <td>{transport.montant ? transport.montant.toFixed(2) : "-"} DT</td>
                                          <td>{transport.resultat}</td>
                                          <td>{transport.libelle}</td>
                                          <td>{transport.date}</td>
                                          <td>{banque.date}</td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        </div>



      </main>
    </div>
  )
}

export default ControleFactures
