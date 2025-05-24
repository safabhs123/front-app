import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell, ChevronDown, FileText, Home, LogOut, Menu,
  PieChart, Search, User, X, CreditCard
} from "lucide-react";
import "./Acceuil.css";
import "./Table.css";

function Acceuil() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [caisses, setCaisses] = useState([]);
  const [regions, setRegions] = useState([]);
  const [transporteurs, setTransporteurs] = useState([]);

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("fr-FR", options));

    fetchCaisses();
    fetchRegions();
    fetchTransporteurs();
  }, []);

  const fetchCaisses = () => {
    fetch("/api/caisses")
      .then((res) => res.json())
      .then((data) => setCaisses(data))
      .catch((err) => console.error("Erreur lors du chargement des caisses:", err));
  };

  const fetchRegions = () => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Erreur lors du chargement des régions:", err));
  };

  const fetchTransporteurs = () => {
    fetch("/api/transporteurs")
      .then((res) => res.json())
      .then((data) => setTransporteurs(data))
      .catch((err) => console.error("Erreur lors du chargement des transporteurs:", err));
  };

  const displayName = userName.includes(" - ") ? userName.split(" - ")[1].trim() : userName;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src="assetsss/logo/logo-full.png" alt="Logo" width={120} height={60} className="sidebar-logo" />
          <button className="close-sidebar" onClick={toggleSidebar}><X size={20} /></button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {role === "ADMIN_USER" && (
              <li>
                <Link to="/utilisateurs"><CreditCard size={20} /><span>Gérer Utilisateurs</span></Link>
              </li>
            )}
            {role === "ADMIN_FUNCTIONAL" && (
              <>
                <li className={activeTab === "acceuil" ? "active" : ""} onClick={() => setActiveTab("acceuil")}>
                  <Link to="/acceuil"><Home size={20} /><span>Tableau de bord</span></Link>
                </li>
                <li className={activeTab === "factures" ? "active" : ""} onClick={() => setActiveTab("factures")}>
                  <Link to="/controle-factures"><FileText size={20} /><span>Factures</span></Link>
                </li>
                <li className={activeTab === "gerer-caisse" ? "active" : ""} onClick={() => setActiveTab("gerer-caisse")}>
                  <Link to="/gerer-caisse"><FileText size={20} /><span>Gérer Caisse</span></Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} /><span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}><Menu size={24} /></button>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <button className="user-menu-button" onClick={toggleMobileMenu}>
                <div className="user-avatar"><User size={20} /></div>
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-role">{role}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {mobileMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profil"><User size={16} /><span>Mon profil</span></Link>
                  <button onClick={handleLogout}>
                    <LogOut size={16} /><span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {role === "ADMIN_USER" ? (
            <div className="p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-xl shadow-lg mx-4 my-6 border-l-4 border-blue-800">
              <h2 className="text-3xl font-semibold">Bienvenue 👋</h2>
              <p className="text-lg">
                Vous êtes connecté en tant que <span className="text-yellow-400 font-medium">Administrateur des utilisateurs</span>.<br />
                Accès aux factures non autorisé.
              </p>
            </div>
          ) : (
            <>
              <div className="page-header">
                <h1>Tableau de bord</h1>
                <p className="date-display">{currentDate}</p>
              </div>

              {/* Stats */}
              <div style={{ padding: "20px" }}>
                <div className="content-section" style={{ marginTop: "30px" }}>
                  <div className="section-header" style={{ marginBottom: "20px" }}>
                    <h2>Stats</h2>
                  </div>
                  <div className="quick-actions" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {[
                      {
                        title: "Nombre de Caisses",
                        desc: `${caisses.length} caisses`,
                        bg: "#e0f7fa",
                        icon: <FileText size={24} />,
                        route: "/gerer-caisse"
                      },
                      {
                        title: "Nombre de Transporteurs",
                        desc: `${transporteurs.length} transporteurs`,
                        bg: "#e8f5e9",
                        icon: <CreditCard size={24} />,
                        route: "/gerer-caisse"
                      },
                      {
                        title: "Nombre de Régions",
                        desc: `${regions.length} régions`,
                        bg: "#f3e5f5",
                        icon: <PieChart size={24} />,
                        route: "/gerer-caisse"
                      }
                    ].map((action, index) => {
                      const isDisabled = role === "ADMIN_USER";
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
                            position: "relative"
                          }}
                          onClick={() => {
                            if (isDisabled) {
                              alert("Accès non autorisé pour votre rôle.");
                              return;
                            }
                            navigate(action.route);
                          }}
                        >
                          <div className="quick-action-icon">{action.icon}</div>
                          <h3>{action.title}</h3>
                          <p>{action.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Acceuil;
