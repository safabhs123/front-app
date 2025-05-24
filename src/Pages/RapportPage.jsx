import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RapportPage() {
  const navigate = useNavigate();
  const [rapport, setRapport] = useState([]);

  useEffect(() => {
    const storedRapport = localStorage.getItem("rapport");
    if (storedRapport) {
      setRapport(JSON.parse(storedRapport));
      localStorage.removeItem("rapport"); // nettoyage après usage
    }
  }, []);

  return (
    <div>
      <h2>Rapport de Comparaison</h2>
      <button onClick={() => navigate("/")}>Retour</button>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Passages Banque</th>
            <th>Passages Transporteur</th>
            <th>Montant</th>
            <th>Écart Passages</th>
            <th>Écart Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {rapport.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.nbPassagesBanque}</td>
              <td>{r.nbPassagesTransporteur}</td>
              <td>{r.montantTransporteur.toFixed(2)} DT</td>
              <td>{r.ecartPassages}</td>
              <td>{r.ecartMontant.toFixed(2)} DT</td>
              <td>{r.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RapportPage;
