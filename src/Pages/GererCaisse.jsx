"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  PieChart,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Edit2,
  Trash2Icon,
} from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import "./GererCaisse.css"

function ListeCaisses() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role") || "ADMIN_FUNCTIONAL"
  const displayName = localStorage.getItem("displayName") || "Utilisateur"

  // Dashboard states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("gerer-caisse")

  // Component states
  const [caisses, setCaisses] = useState([])
  const [regions, setRegions] = useState([])
  const [transporteurs, setTransporteurs] = useState([])
  const [newCaisse, setNewCaisse] = useState({ id: "", regionId: "" })
  const [editing, setEditing] = useState({ regionId: null, oldTransporteurId: null })

  useEffect(() => {
    if (role !== "ADMIN_FUNCTIONAL") {
      navigate("/acceuil")
    } else {
      fetchCaisses()
      fetchRegions()
      fetchTransporteurs()
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

  // Data fetching functions
  const fetchCaisses = () => {
    fetch("/api/caisses")
      .then((res) => res.json())
      .then((data) => setCaisses(data))
      .catch((err) => console.error("Erreur lors du chargement des caisses:", err))
  }

  const fetchRegions = () => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Erreur lors du chargement des régions:", err))
  }

  const fetchTransporteurs = () => {
    fetch("/api/transporteurs")
      .then((res) => res.json())
      .then((data) => setTransporteurs(data))
      .catch((err) => console.error("Erreur lors du chargement des transporteurs:", err))
  }

  // CRUD operations
  const handleAdd = () => {
    if (!newCaisse.id || !newCaisse.regionId) {
      alert("Veuillez remplir tous les champs")
      return
    }
    const region = regions.find((r) => r.id === Number.parseInt(newCaisse.regionId))
    fetch("/api/caisses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number.parseInt(newCaisse.id), region }),
    })
      .then(() => {
        setNewCaisse({ id: "", regionId: "" })
        fetchCaisses()
      })
      .catch((err) => console.error("Erreur lors de l'ajout:", err))
  }

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette caisse ?")) {
      fetch(`/api/caisses/${id}`, { method: "DELETE" })
        .then(() => fetchCaisses())
        .catch((err) => console.error("Erreur lors de la suppression:", err))
    }
  }

  const removeTransporteurFromRegion = (regionId, transporteurId) => {
    fetch(`/api/regions/${regionId}/transporteurs/${transporteurId}`, {
      method: "DELETE",
    })
      .then(() => fetchCaisses())
      .catch((err) => console.error("Erreur lors de la suppression du transporteur:", err))
  }

  const handleReplaceTransporteur = (regionId, oldTransporteurId, newTransporteurId) => {
    if (!newTransporteurId) return
    fetch(`/api/regions/${regionId}/transporteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transporteurId: newTransporteurId }),
    })
      .then(() => {
        setEditing({ regionId: null, oldTransporteurId: null })
        fetchCaisses()
      })
      .catch((err) => console.error("Erreur lors du remplacement:", err))
  }

  const addTransporteurToRegion = (regionId, transporteurId) => {
    fetch(`/api/regions/${regionId}/transporteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transporteurId }),
    })
      .then(() => {
        setEditing({ regionId: null, oldTransporteurId: null })
        fetchCaisses()
      })
      .catch((err) => console.error("Erreur lors de l'ajout du transporteur:", err))
  }

  const startEditing = (regionId, oldTransporteurId) => {
    setEditing({ regionId, oldTransporteurId })
  }

  if (!role) {
    return <div>Loading...</div>
  }

  return (
    <div className="">
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
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
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
      

          <div className="liste-caisses-container">
            <div className="section-title">
              <h1>Gestion des Caisses</h1>
            </div>

            {/* Add new caisse form */}
            <div className="form-section">
              <div className="section-header">
                <h2>Ajouter une nouvelle caisse</h2>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ID Caisse</label>
                  <input
                    type="number"
                    placeholder="ID Caisse"
                    value={newCaisse.id}
                    onChange={(e) => setNewCaisse({ ...newCaisse, id: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Région</label>
                  <select
                    value={newCaisse.regionId}
                    onChange={(e) => setNewCaisse({ ...newCaisse, regionId: e.target.value })}
                  >
                    <option value="">-- Sélectionner une région --</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group pt-15">
                  <button className=" " onClick={handleAdd}>
                    <Plus size={16} />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Caisses table */}
            <div className="table-container">
              <table className="caisses-table">
                <thead >
                  <tr>
                    <th>ID Caisse</th>
                    <th>Région</th>
                    <th>Transporteurs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {caisses.map((caisse) => (
                    <tr key={caisse.id}>
                      <td>{caisse.id}</td>
                      <td>{caisse.region ? caisse.region.nom : "Non liée"}</td>
                      <td className="transporteurs-cell">
                        {caisse.region ? (
                          (caisse.region.transporteurs ?? []).length > 0 ? (
                            caisse.region.transporteurs.map((t) => (
                              <div key={t.id} className="transporteur-item">
                                <span className="transporteur-name">{t.nom}</span>
                                {editing.regionId === caisse.region.id && editing.oldTransporteurId === t.id ? (
                                  <select
                                    autoFocus
                                    onBlur={() => setEditing({ regionId: null, oldTransporteurId: null })}
                                    onChange={(e) =>
                                      handleReplaceTransporteur(caisse.region.id, t.id, Number.parseInt(e.target.value))
                                    }
                                    className="transporteur-select"
                                    defaultValue=""
                                  >
                                    <option value="">-- Choisir --</option>
                                    {transporteurs
                                      .filter((tr) => !(caisse.region.transporteurs ?? []).some((r) => r.id === tr.id))
                                      .map((tr) => (
                                        <option key={tr.id} value={tr.id}>
                                          {tr.nom}
                                        </option>
                                      ))}
                                  </select>
                                ) : (
                                  <div className="transporteur-actions">
                                    <button
                                      onClick={() => startEditing(caisse.region.id, t.id)}
                                      className=" edit"
                                      title="Modifier transporteur"
                                    >
                                      <Edit2 size={18} />
                                    </button>
                                    <button
                                      onClick={() => removeTransporteurFromRegion(caisse.region.id, t.id)}
                                      className=" delete"
                                      title="Supprimer transporteur"
                                    >
                                      <Trash2Icon size={18} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="no-transporteur">
                              <span className="no-transporteur-text">Aucun transporteur</span>
                              {editing.regionId === caisse.region.id && editing.oldTransporteurId === null ? (
                                <select
                                  autoFocus
                                  onBlur={() => setEditing({ regionId: null, oldTransporteurId: null })}
                                  onChange={(e) => {
                                    const newId = Number.parseInt(e.target.value)
                                    if (newId) {
                                      addTransporteurToRegion(caisse.region.id, newId)
                                    }
                                  }}
                                  className="transporteur-select"
                                  defaultValue=""
                                >
                                  <option value="">-- Ajouter transporteur --</option>
                                  {transporteurs
                                    .filter((tr) => !(caisse.region.transporteurs ?? []).some((r) => r.id === tr.id))
                                    .map((tr) => (
                                      <option key={tr.id} value={tr.id}>
                                        {tr.nom}
                                      </option>
                                    ))}
                                </select>
                              ) : (
                                <button
                                  onClick={() => setEditing({ regionId: caisse.region.id, oldTransporteurId: null })}
                                  className="add-transporteur-button"
                                  title="Ajouter un transporteur"
                                >
                                  <Plus size={14} />
                                  Ajouter
                                </button>
                              )}
                            </div>
                          )
                        ) : (
                          "Non liée"
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleDelete(caisse.id)} className="delete-button">
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

         
          </div>
        </div>
      </main>
    </div>
  )
}

export default ListeCaisses
