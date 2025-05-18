import React, { useState } from "react";

export default function RapportComparaison() {
  const [banqueFile, setBanqueFile] = useState(null);
  const [transportFile, setTransportFile] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!banqueFile || !transportFile) {
      setError("Veuillez sélectionner les deux fichiers.");
      return;
    }

    setLoading(true);
    setError("");
    setRapports([]);

    const formData = new FormData();
    formData.append("banque", banqueFile);
    formData.append("transport", transportFile);

    try {
      const response = await fetch("/api/rapport/generer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du rapport");
      }

      const data = await response.json();
      setRapports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Générer Rapport de Comparaison</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>Fichier Banque : </label>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setBanqueFile(e.target.files[0])}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Fichier Transporteur : </label>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setTransportFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 15 }}>
          {loading ? "Chargement..." : "Générer Rapport"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {rapports.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Nb Passages Banque</th>
              <th>Nb Passages Transporteur</th>
              <th>Montant Transporteur</th>
              <th>Écart Passages</th>
              <th>Écart Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rapports.map((r, idx) => (
              <tr key={idx}>
                <td>{r.date}</td>
                <td>{r.nbPassagesBanque}</td>
                <td>{r.nbPassagesTransporteur}</td>
                <td>{r.montantTransporteur.toFixed(2)}</td>
                <td>{r.ecartPassages}</td>
                <td>{r.ecartMontant}</td>
                <td>{r.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
