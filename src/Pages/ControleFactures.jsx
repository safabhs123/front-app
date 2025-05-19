import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Home,
  FileText,
  PieChart,
  LogOut,
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  X,
} from  "lucide-react";
import "./Controle-factures.css";
import { useNavigate } from "react-router-dom";


function ControleFactures() {
  // States pour les fichiers Excel et résultats
  const [fichierBanque, setFichierBanque] = useState(null);
  const [fichierTransporteur, setFichierTransporteur] = useState(null);
  const [resultatsRapport, setResultatsRapport] = useState([]);
  const navigate = useNavigate();


   
  const [comparaisonResult, setComparaisonResult] = useState([]);
  const [loading, setLoading] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [transporteurDetailsMap, setTransporteurDetailsMap] = useState({}); 
const [banqueDetailsMap, setBanqueDetailsMap] = useState({});
const [data, setData] = useState([]);

 const [banquefile, setbanquefile] = useState(null);
  const [transportfile, settransportfile] = useState(null);

  // States pour sidebar et menu utilisateur
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("factures");

  // Simuler user info, à remplacer par ta gestion auth
  const role = "ADMIN_FUNCTIONAL";
  //const displayName = "Jean Dupont";

  // Handlers pour sidebar et menu utilisateur
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLogout = () => {
    // Ici ta logique de déconnexion
    alert("Déconnexion effectuée !");
  };

 // Gestion des fichiers
const handleFileChange = (e, type) => {
  const file = e.target.files[0];
  if (type === "banque") {
    setFichierBanque(file);
  } else if (type === "transporteur") {
    setFichierTransporteur(file);
  }
};


  
const fetchDetails = async (index) => {
  if (!fichierBanque || !fichierTransporteur) {
    alert("Veuillez sélectionner les fichiers banque et transporteur avant de voir les détails.");
    return;
  }
  try {
    // Préparer formData banque
    const formDataBanque = new FormData();
    formDataBanque.append("file", fichierBanque);
    // Appel API banque (changer l’url si besoin)
    const banqueResponse = await axios.post("/api/details/banque", formDataBanque, {
      headers: { "Content-Type": "multipart/form-data" },
    });


    // Préparer formData transporteur
    const formDataTransport = new FormData();
    formDataTransport.append("file", fichierTransporteur);
    // Appel API transporteur
    const transportResponse = await axios.post("/api/details/transport", formDataTransport, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (banqueResponse.data) {
      setBanqueDetailsMap(prev => ({ ...prev, [index]: banqueResponse.data }));
    } else {
      alert("Aucun détail banque reçu.");
    }

    if (transportResponse.data) {
      setTransporteurDetailsMap(prev => ({ ...prev, [index]: transportResponse.data }));
    } else {
      alert("Aucun détail transporteur reçu.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails", error);
    alert("Erreur lors de la récupération des détails banque et transporteur.");
  }
};


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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    navigate("/rapportpage", { state: { rapport: response.data } }); // 🔁 Redirection avec les données
  } catch (error) {
    console.error("Erreur lors de la génération du rapport", error);
  }
};




  // Envoi des fichiers et récupération des résultats
  const handleSubmit = async () => {
    if (!fichierBanque || !fichierTransporteur)
      return alert("Veuillez sélectionner les deux fichiers.");

    const formData = new FormData();
    formData.append("fichierBanque", fichierBanque);
    formData.append("fichierTransporteur", fichierTransporteur);

    try {
      setLoading(true);
      const response = await axios.post("/api/comparaison/upload", formData);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setComparaisonResult(response.data);
      } else {
        alert("Aucun résultat à afficher.");
      }
    } catch (error) {
      console.error("Erreur lors de la comparaison", error);
      alert("Erreur lors de la comparaison des fichiers.");
    } finally {
      setLoading(false);
    }
  };
const toggleDetails = (index) => {
  if (selectedDetail === index) {
    setSelectedDetail(null);
  } else {
    if (!banqueDetailsMap[index] || !transporteurDetailsMap[index]) {
      fetchDetails(index);
    }
    setSelectedDetail(index);
  }
};

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img
            src="assetsss/logo/logo-full.png"
            alt="Logo"
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
                <li
                  className={activeTab === "acceuil" ? "active" : ""}
                  onClick={() => setActiveTab("acceuil")}
                >
                  <Link to="/acceuil">
                    <Home size={20} />
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li
                  className={activeTab === "factures" ? "active" : ""}
                  onClick={() => setActiveTab("factures")}
                >
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
                <li
                  className={activeTab === "rapports" ? "active" : ""}
                  onClick={() => setActiveTab("rapports")}
                >
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
      {/* Main content */}
<main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
  <header className="dashboard-header">
    <div className="header-left">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Rechercher..." className="search-input" />
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
            {/* <span className="user-name">{displayName}</span> */}
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

  {/* Contenu principal - Comparaison */}
  <div className="p-6 max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Comparaison des passages</h1>

    <div className="flex gap-4 mb-4">
       <div>
        <label for="banqueFile">Importer fichier Banque :</label>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => handleFileChange(e, "banque")}
      />
       </div>
  <br />
  <div>
        <label for="transportFile">Importer fichier Transporteur :</label>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => handleFileChange(e, "transporteur")}
      />
      </div>
       <br />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Comparer
      </button>
            
             <br />
             <br />

      <button
  onClick={handleGenererRapport}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Générer Rapport
</button>

    </div>
       <br />

    {loading && <p>Chargement...</p>}

    {!loading && comparaisonResult.length > 0 && (
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Passages Banque</th>
            <th className="border p-2">Passages Transporteur</th>
            <th className="border p-2">Égalité</th>
            <th className="border p-2">Montant Transporteur</th>
            <th className="border p-2">Détails</th>
          </tr>
        </thead>
        
        <tbody>
          {comparaisonResult.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="text-center">
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.nbPassagesBanque}</td>
                <td className="border p-2">{item.nbPassagesTransporteur}</td>
                <td
                  className="border p-2 font-bold"
                  style={{
                    backgroundColor: item.equal ? "lightgreen" : "lightcoral",
                    color: "black",
                  }}
                >
                  {item.equal ? "✅" : "❌"}
                </td>
                <td className="border p-2">{item.montantTransporteur.toFixed(2)} DT</td>
                <td className="border p-2">
                  {!item.equal && (
                    <button
                      onClick={() => toggleDetails(index)}
                      className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      {transporteurDetailsMap[index] ? "Cacher détails" : "Voir détails"}
                    </button>
                  )}
                </td>
              </tr>

              {selectedDetail === index && (
                <tr>
                  <td colSpan={6} className="bg-gray-100 p-4 text-left border">
                    <div>
                      <h4 className="font-semibold mb-2">Détails Banque</h4>
                      {banqueDetailsMap[index] ? (
                        <table className="w-full text-sm border border-gray-300 mb-4">
                          <thead>
                            <tr className="bg-gray-300">
                              <th className="border p-1">Agence</th>
                              <th className="border p-1">Nb Passages</th>
                              <th className="border p-1">Type de Passage</th>
                                 <th className="border p-1">Date</th>
                                    <th className="border p-1">Nomp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {banqueDetailsMap[index].map((detail, i) => (
                              <tr key={i}>
                                <td className="border p-1">{detail.agsa}</td>
                                <td className="border p-1">{detail.nbPassages}</td>
                                  <td className="border p-1">{detail.type}</td>
                                    <td className="border p-1">{detail.date}</td>
                                <td className="border p-1">{detail.nomp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>Chargement des détails banque...</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Détails Transporteur</h4>
                      {transporteurDetailsMap[index] ? (
                        <table className="w-full text-sm border border-gray-300">
                          <thead>
                            <tr className="bg-gray-300">
                              <th className="border p-1">Date</th>
                              <th className="border p-1">Agence</th>
                              <th className="border p-1">Resultat</th>
                              <th className="border p-1">Nb Passages</th>
                              
                               <th className="border p-1">Nature</th>
                               
                                 <th className="border p-1">CoutTRP</th>
                                  <th className="border p-1">CoutTRT</th>
                                   
                                    <th className="border p-1">CoutTotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transporteurDetailsMap[index].map((detail, i) => (
                              <tr key={i}>
                                 <td className="border p-1">{detail.date}</td>
                                <td className="border p-1">{detail.libelle}</td>
                                <td className="border p-1">{detail.resultat}</td>
                                <td className="border p-1">{detail.nbPassages}</td>
                                
                                <td className="border p-1">{detail.nature}</td>
                                  <td className="border p-1">{detail.trp}</td>
                               
                                <td className="border p-1">{detail.trt}</td>
                             
                                 <td className="border p-1">{detail.montant}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                      ) : (
                        <p>Chargement des détails transporteur...</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    )}
    


    {!loading && comparaisonResult.length === 0 && (
      <p className="text-center text-gray-500 mt-4">Aucun résultat à afficher.</p>
    )}
  </div>
</main>

  </div>

  );
}

export default ControleFactures;