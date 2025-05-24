"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { Menu, X, Home, FileText, CreditCard, PieChart, LogOut, User, ChevronDown, HomeIcon } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../api/axiosConfig"
import "./utilisateurs.css"

const Utilisateurs = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const displayName = localStorage.getItem("displayName") || "Utilisateur"

  // Dashboard states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("utilisateurs")

  // User management states
  const [utilisateurs, setUtilisateurs] = useState([])
  const [utilisateur, setUtilisateur] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    password: "",
    dateDebutTravail: "",
    role: "EMPLOYEE",
  })
  const [editMode, setEditMode] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [ancienRole, setAncienRole] = useState("")

  const toLocalISODate = (dateString) => {
    const date = new Date(dateString)
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]
    return localISO
  }

  useEffect(() => {
    if (role !== "ADMIN_USER") {
      navigate("/acceuil")
    } else {
      fetchUtilisateurs()
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

  // User management functions
  const fetchUtilisateurs = () => {
    axios
      .get("http://localhost:8080/api/utilisateur/all")
      .then((res) => setUtilisateurs(res.data))
      .catch((err) => console.error("Erreur de récupération des utilisateurs :", err))
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (editMode && name === "role" && value !== ancienRole) {
      const today = new Date()
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0]

      setUtilisateur((prev) => ({
        ...prev,
        role: value,
        dateDebutTravail: localDate,
      }))
    } else {
      setUtilisateur((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const userToSend = {
        ...utilisateur,
        dateDebutTravail: toLocalISODate(utilisateur.dateDebutTravail),
      }
      const response = await axios.post("http://localhost:8080/api/utilisateur/add", userToSend)
      console.log("Utilisateur ajouté", response.data)
      fetchUtilisateurs()
      resetForm()
    } catch (error) {
      console.error("Erreur d'ajout", error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const userToSend = {
        ...utilisateur,
        dateDebutTravail: toLocalISODate(utilisateur.dateDebutTravail),
      }
      const response = await axios.put(
        `http://localhost:8080/api/utilisateur/update/${utilisateur.matricule}`,
        userToSend,
      )
      console.log("Utilisateur modifié", response.data)
      fetchUtilisateurs()
      resetForm()
    } catch (error) {
      console.error("Erreur de mise à jour", error)
    }
  }

  const handleEdit = (user) => {
    setUtilisateur({
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      password: "",
      dateDebutTravail: user.dateDebutTravail,
      role: user.role,
    })
    setAncienRole(user.role)
    setEditMode(true)
  }

  const confirmDelete = (matricule) => {
    setUserToDelete(matricule)
    setOpenConfirm(true)
  }

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:8080/api/utilisateur/delete/${userToDelete}`)
      .then(() => {
        fetchUtilisateurs()
        setOpenConfirm(false)
        setUserToDelete(null)
      })
      .catch((err) => console.error("Erreur de suppression :", err))
  }

  const handleCancelDelete = () => {
    setOpenConfirm(false)
    setUserToDelete(null)
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-")
    return `${day}/${month}/${year}`
  }

  const resetForm = () => {
    setUtilisateur({
      matricule: "",
      nom: "",
      prenom: "",
      password: "",
      dateDebutTravail: "",
      role: "EMPLOYEE",
    })
    setEditMode(false)
    setAncienRole("")
  }

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
                <Link to="/dashboard">
                  <HomeIcon size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            {role === "ADMIN_USER" && (
              <li className={activeTab === "utilisateurs" ? "active" : ""}>
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

          <div >
            <h2>Gestion des Utilisateurs</h2>

            <form autoComplete="off" onSubmit={editMode ? handleUpdate : handleAddUser} style={{ marginBottom: 20 }}>
              <TextField
                label="Matricule"
                name="matricule"
                value={utilisateur.matricule}
                onChange={handleChange}
                required
                disabled={editMode}
                style={{ marginRight: 10 }}
              />

              <TextField
                label="Nom"
                name="nom"
                value={utilisateur.nom}
                onChange={handleChange}
                required
                disabled={editMode}
                autoComplete="new-password"
                style={{ marginRight: 10 }}
              />

              <TextField
                label="Prénom"
                name="prenom"
                value={utilisateur.prenom}
                onChange={handleChange}
                required
                disabled={editMode}
                autoComplete="new-password"
                style={{ marginRight: 10 }}
              />

              <TextField
                label="Date début de travail"
                type="date"
                name="dateDebutTravail"
                value={utilisateur.dateDebutTravail}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                style={{ marginRight: 10 }}
                disabled={editMode}
              />

              {!editMode && (
                <TextField
                  label="Mot de passe"
                  type="password"
                  name="password"
                  value={utilisateur.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  style={{ marginRight: 10 }}
                />
              )}

              <FormControl style={{ marginRight: 10 }}>
                <FormLabel>Rôle</FormLabel>
                <RadioGroup row name="role" value={utilisateur.role} onChange={handleChange}>
                  <FormControlLabel value="ADMIN_FUNCTIONAL" control={<Radio />} label="Admin-fonctional" />
                  <FormControlLabel value="EMPLOYEE" control={<Radio />} label="Employé" />
                </RadioGroup>
              </FormControl>

              <Button type="submit" variant="contained" color="primary">
                {editMode ? "Modifier le Rôle" : "Ajouter"}
              </Button>
              {editMode && (
                <Button onClick={resetForm} variant="outlined" style={{ marginLeft: 10 }}>
                  Annuler
                </Button>
              )}
            </form>

            <TableContainer component={Paper}>
              <div className="table-container">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matricule</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell>Prénom</TableCell>
                      <TableCell>Date de début</TableCell>
                      <TableCell>Rôle</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {utilisateurs.map((user) => (
                      <TableRow key={user.matricule}>
                        <TableCell>{user.matricule}</TableCell>
                        <TableCell>{user.nom}</TableCell>
                        <TableCell>{user.prenom}</TableCell>
                        <TableCell>{user.dateDebutTravail ? formatDate(user.dateDebutTravail) : ""}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="action-buttons">
                            <Button onClick={() => handleEdit(user)} variant="outlined" color="primary">
                              Éditer
                            </Button>
                            <Button onClick={() => confirmDelete(user.matricule)} variant="outlined" color="secondary">
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>

       

            <Dialog open={openConfirm} onClose={handleCancelDelete}>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogContent>
                <DialogContentText>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleConfirmDelete} color="secondary">
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Utilisateurs
