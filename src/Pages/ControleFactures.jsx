import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import "./Controle-factures.css";

function ControleFactures() {
  const [fichierBanque, setFichierBanque] = useState(null);
  const [fichierTransporteur, setFichierTransporteur] = useState(null);
  const [comparaisonResult, setComparaisonResult] = useState([]);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(null);
 const [detailsBanque, setDetailsBanque] = useState([]);
const [detailsTransport, setDetailsTransport] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("factures");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const navigate = useNavigate();
  const role = "ADMIN_FUNCTIONAL"; // remplacer dynamiquement si besoin
const formatDateFR = (dateStr) => {
  console.log("welcome from formatDateFR:");
  console.log("date:", dateStr);

  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day); // mois = 0-indexed
  console.log("manually constructed Date:", d);

  return d.toLocaleDateString("fr-FR"); // "28/02/2025"
};


  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "banque") setFichierBanque(file);
    else if (type === "transporteur") setFichierTransporteur(file);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // implémenter la déconnexion
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!fichierBanque || !fichierTransporteur) {
      alert("Veuillez sélectionner les deux fichiers.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fichierBanque", fichierBanque);
    formData.append("fichierTransporteur", fichierTransporteur);

    try {
      const response = await axios.post("/api/comparaison/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setComparaisonResult(response.data);
    } catch (error) {
      console.error("Erreur lors de la comparaison :", error);
      alert("Erreur lors de la comparaison des fichiers.");
    } finally {
      setLoading(false);
    }
  };
  const handleVoirDetails = async (index, date) => {
    console.log(index , date);
    
     const formattedDate = formatDateFR(date);
     console.log(" formattedDate : ",formattedDate)
  // Toggle : si on clique sur le même index et la même date → on masque
  if (selectedDetailIndex === index && selectedDate === date) {
    setSelectedDetailIndex(null);
    setSelectedDate(null);
    setDetailsBanque([]);
    setDetailsTransport([]);
    return;
  }

  setSelectedDetailIndex(index);
  setSelectedDate(formattedDate);
 
  if (!fichierBanque || !fichierTransporteur) {
    alert("Veuillez sélectionner les fichiers.");
    return;
  }

  try {
    const formDataBanque = new FormData();
    formDataBanque.append("file", fichierBanque);

    const formDataTransport = new FormData();
    formDataTransport.append("file", fichierTransporteur);

    await Promise.all([
      axios.post("http://localhost:8080/api/details/banque/upload", formDataBanque),
      axios.post("http://localhost:8080/api/details/transport/upload", formDataTransport),
    ]);

    // const dateObj = new Date(date);
    // const formattedDate = dateObj.toLocaleDateString("fr-FR");


    const [resBanque, resTransport] = await Promise.all([
      axios.get("http://localhost:8080/api/details/banque", {
        params: { date: formattedDate },
      }),
      axios.get("http://localhost:8080/api/details/transport", {
        params: { date: formattedDate },
      }),
    ]);

    setDetailsBanque(resBanque.data);
    setDetailsTransport(resTransport.data);
  } catch (error) {
    console.error("Erreur lors du chargement des détails:", error);
    alert("Erreur lors du chargement des détails.");
  }
  
};


// const handleVoirDetails = async ( date) => {
//   if (!fichierBanque || !fichierTransporteur) {
//     alert("Veuillez sélectionner les fichiers.");
//     return;
//   }

//   try {
//     // Upload fichiers (tu peux garder ça)
//     const formDataBanque = new FormData();
//     formDataBanque.append("file", fichierBanque);

//     const formDataTransport = new FormData();
//     formDataTransport.append("file", fichierTransporteur);

//     await Promise.all([
//       axios.post("http://localhost:8080/api/details/banque/upload", formDataBanque),
//       axios.post("http://localhost:8080/api/details/transport/upload", formDataTransport),
//     ]);

//     // 🛠️ Formatage de la date : "2025-02-21" ➝ "21/02/2025"
//     const dateObj = new Date(date);
//     const formattedDate = dateObj.toLocaleDateString("fr-FR"); // → "21/02/2025"

//     // Appel GET avec date au bon format
//     const [resBanque, resTransport] = await Promise.all([
//       axios.get("http://localhost:8080/api/details/banque", {
//         params: { date: formattedDate },
//       }),
//       axios.get("http://localhost:8080/api/details/transport", {
//         params: { date: formattedDate },
//       }),
//     ]);

//     // Mise à jour de l'état
//     setDetailsBanque(resBanque.data);
// setDetailsTransport(resTransport.data);

//   setSelectedDate(date);



//   } catch (error) {
//     console.error("Erreur lors du chargement des détails:", error);
//     alert("Erreur lors du chargement des détails.");
//   }
// };


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
      navigate("/rapportpage", { state: { rapport: response.data } });
    } catch (error) {
      console.error("Erreur lors de la génération du rapport", error);
      alert("Erreur lors de la génération du rapport.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Contenu similaire pour la sidebar, header, etc. */}

      <section className="controle-factures">
        <h2>Contrôle des factures</h2>

        <div className="file-inputs">
          <div className="file-group">
            <label htmlFor="banque-file">Fichier Banque :</label>
            <input
              type="file"
              id="banque-file"
              accept=".xlsx, .xls"
              onChange={(e) => handleFileChange(e, "banque")}
            />
            {fichierBanque && <p>Fichier sélectionné : {fichierBanque.name}</p>}
          </div>

          <div className="file-group">
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
          <button className="btn-secondary" onClick={handleGenererRapport} disabled={loading}>
            Générer rapport complet
          </button>
        </div>

        {comparaisonResult.length > 0 && (
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
  {comparaisonResult.map((ligne, index) => {
    
    //const normalizedDate = new Date(ligne.date.split("/").reverse().join("-")).toISOString().split("T")[0];
    
    return (
   

    
      <React.Fragment key={index}>
        <tr>
          <td>{ligne.date}</td>
          <td>{ligne.nbPassagesBanque}</td>
          <td>{(ligne.montantBanque ?? 0).toFixed(2)} DT</td>
          <td>{ligne.nbPassagesTransporteur}</td>
          <td>{(ligne.montantTransporteur ?? 0).toFixed(2)} DT</td>
          <td>
           <button onClick={() => handleVoirDetails(index, ligne.date)}>
          {selectedDetailIndex === index && selectedDate === ligne.date ? "Masquer" : "Voir détails"}
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
      <div className="mt-4 bg-white shadow-md p-4 rounded-lg border border-gray-200">
        <h5 className="text-md font-semibold mb-2">
          Matching – Détails croisés pour la date {formatDateFR(ligne.date)}
        </h5>
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">AGSA</th>
              <th className="px-2 py-1 border">NOMP</th>
              <th className="px-2 py-1 border">Type</th>
              <th className="px-2 py-1 border">NbPass (Banque)</th>
              <th className="px-2 py-1 border">Nature</th>
              <th className="px-2 py-1 border">NbPass (Transp)</th>
              <th className="px-2 py-1 border">TRP</th>
              <th className="px-2 py-1 border">TRT</th>
              <th className="px-2 py-1 border">Montant</th>
              <th className="px-2 py-1 border">Résultat</th>
              <th className="px-2 py-1 border">Libellé</th>
              <th className="px-2 py-1 border">DATE (Banque)</th>
               <th className="px-2 py-1 border">DATE (Transp)</th>
            </tr>
          </thead>
          <tbody>
            {detailsBanque.map((banque, i) => {
              const transport = detailsTransport[i] || {};
              return (
                <tr key={i}>
                  <td className="px-2 py-1 border">{banque.agsa}</td>
                  <td className="px-2 py-1 border">{banque.nomp}</td>
                  <td className="px-2 py-1 border">{banque.type}</td>
                  <td className="px-2 py-1 border">{banque.nbPassages}</td>
                 
                  <td className="px-2 py-1 border">{transport.nature}</td>
                  <td className="px-2 py-1 border">{transport.nbPassages}</td>
                  <td className="px-2 py-1 border">{transport.trp}</td>
                  <td className="px-2 py-1 border">{transport.trt}</td>
                    
                  <td className="px-2 py-1 border">
                    {transport.montant ? transport.montant.toFixed(2) : "-"} DT
                  </td>
                  <td className="px-2 py-1 border">{transport.resultat}</td>
                  <td className="px-2 py-1 border">{transport.libelle}</td>
                  <td className="px-2 py-1 border">{transport.date}</td>
                   <td className="px-2 py-1 border">{banque.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
          </div>
        </td>
      </tr>
    )}
  </React.Fragment>
);
  })}
</tbody>

          </table>
        )}
      </section>
    </div>
  );
}

export default ControleFactures;
