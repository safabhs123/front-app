"use client"

import "./Dashboard.css"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Menu, X, Home, FileText, CreditCard, PieChart, LogOut, User, ChevronDown, ShieldCheck, HomeIcon } from "lucide-react"
import { Card, Badge, Container, Row, Col, Button } from "react-bootstrap";
export default function Dashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("acceuil")
  const [role, setRole] = useState(null)
  const [displayName, setDisplayName] = useState("")

  // Get current date
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    const userRole = localStorage.getItem("role")
    const userName = localStorage.getItem("displayName") || "Utilisateur"

    setRole(userRole)
    setDisplayName(userName)

    // Redirect if not admin user
    if (userRole !== "ADMIN_USER") {
      navigate("/acceuil", { replace: true })
    }
  }, [navigate])

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

  // Don't render if role is not loaded yet
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
                <Link to="/dashboard">
                  <HomeIcon size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
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
                <li className={activeTab === "rapports" ? "active" : ""} onClick={() => setActiveTab("rapports")}>
                  <Link to="/rapportpage">
                    <PieChart size={20} />
                    <span>Rapports</span>
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
          {role === "ADMIN_USER" ? (
            <AdminUserDashboard />
          ) : (
            <FunctionalAdminDashboard currentDate={currentDate} navigate={navigate} role={role} />
          )}
        </div>
      </main>
    </div>
  )
}

// Component for Admin User Dashboard
function  AdminUserDashboard() {
  return (
   <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card
            className="shadow-lg rounded-4 border-warning"
            style={{ background: "linear-gradient(135deg,rgb(236, 236, 206) 0%,rgb(204, 204, 185) 100%)" }}
          >
            <Card.Body className="position-relative p-4">
           
              <Card.Title className="display-5 fw-bold  mb-3">
                Bienvenue 👋
              </Card.Title>
              <Card.Text className="fs-5 mb-8">
                Vous êtes connecté en tant que{" "}
                <Badge bg="warning" text="dark" className="fs-6  mt-4">
                  Administrateur des utilisateurs
                </Badge>
                .
              </Card.Text>
              <Card.Text className="text-danger fw-semibold fs-6 mt-3 text-center">
                ⚠️ Accès aux factures non autorisé.
              </Card.Text>
              {/* Optionnel : bouton pour accéder à la gestion utilisateurs */}
              <Button variant="danger" size="md" className="mt-4 ">
                Gérer les utilisateurs
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Component for Functional Admin Dashboard
function FunctionalAdminDashboard({ currentDate, navigate, role }) {
  const quickActions = [
    {
      title: "Factures validées",
      desc: "Afficher Les factures valides",
      bg: "#e0f7fa",
      icon: <FileText size={24} />,
      route: "/factures/nouvelle",
    },
    {
      title: "Factures non validées",
      desc: "Afficher Les factures non valides",
      bg: "#e8f5e9",
      icon: <CreditCard size={24} />,
      route: "/caisse/transaction",
    },
    {
      title: "Voir les rapports",
      desc: "Consulter les rapports générés",
      bg: "#f3e5f5",
      icon: <PieChart size={24} />,
      route: "/rapportpage",
    },
  ]

  const handleActionClick = (route) => {
    const isDisabled = role === "ADMIN_USER"

    if (isDisabled) {
      alert("Accès non autorisé pour votre rôle.")
      return
    }

    navigate(route)
  }

  return (
    <>
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p className="date-display">{currentDate}</p>
      </div>

      <div style={{ padding: "20px" }}>
        <div className="content-section" style={{ marginTop: "30px" }}>
          <div className="section-header" style={{ marginBottom: "20px" }}>
            <h2>Actions rapides</h2>
          </div>
          <div
            className="quick-actions"
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {quickActions.map((action, index) => {
              const isDisabled = role === "ADMIN_USER"

              return (
                <div
                  key={index}
                  className="quick-action-card"
                  style={{
                    padding: "15px",
                    backgroundColor: action.bg,
                    borderRadius: "10px",
                    flex: "1 1 30%",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
                    position: "relative",
                  }}
                  onClick={() => handleActionClick(action.route)}
                >
                  <div className="quick-action-icon">{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
