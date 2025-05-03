import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
function FactureForm() {
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
  const exportPDF = () => {
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
      head: [["#", "Agence", "Date", "Nature", "Nb", "Résultat", "TRP", "TRT", "Total"]],
      body: rows,
    });

    doc.save(`facture-${facture.numero}.pdf`);
  };
  const toutesLesAgences = [
    { nom: "AGC001", region: "Tunis" },
    { nom: "AGC002", region: "Sousse" },
    { nom: "AGC003", region: "Tunis" },
    { nom: "AGC004", region: "Sfax" },
  ];
  const exportExcel = () => {
    const worksheetData = facture.lignes.map((ligne, i) => ({
      "#": i + 1,
      Agence: ligne.agence,
      Date: ligne.date,
      "Nature du passage": ligne.naturePassage,
      "Nb passages": ligne.nbPassages,
      "Résultat": ligne.resultatPassage,
      "Coût TRP": ligne.coutTRP,
      "Coût TRT": ligne.coutTRT,
      "Total HT": ligne.totalHT,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facture");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
  const [region, setRegion] = useState("");
  const [agences, setAgences] = useState([]);
  const [factureFormattee, setFactureFormattee] = useState("");

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
      const trp = parseFloat(lignes[index].coutTRP) || 0;
      const trt = parseFloat(lignes[index].coutTRT) || 0;
      lignes[index].totalHT = trp + trt;
    }
    setFacture({ ...facture, lignes });
  };
  const recalculateColumns = (lignes, index) => {
    const ligne = lignes[index];
    let totalCollecte = 0;
    let totalAlimentation = 0;
    let totalRemise = 0;

    lignes.forEach((l) => {
      totalCollecte +=
        parseFloat(l.collectePqBDT || 0) +
        parseFloat(l.collecteKDV || 0) +
        parseFloat(l.collecteSMDT || 0);
      totalAlimentation +=
        parseFloat(l.alimentationPqBDT || 0) +
        parseFloat(l.alimentationSMDT || 0);
      totalRemise += parseFloat(l.remiseKDV || 0);
    });

    setFacture({
      ...facture,
      totalCollecte,
      totalAlimentation,
      totalRemise,
    });
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
    const totalLigne = parseFloat(ligne.totalHT || 0);
    totalHT += totalLigne;
    totalCollectePqBDT += parseFloat(ligne.collectePqBDT || 0);
    totalCollecteKDV += parseFloat(ligne.collecteKDV || 0);
    totalCollecteSMDT += parseFloat(ligne.collecteSMDT || 0);
    totalAlimentationPqBDT += parseFloat(ligne.alimentationPqBDT || 0);
    totalAlimentationSMDT += parseFloat(ligne.alimentationSMDT || 0);
    totalRemiseKDV += parseFloat(ligne.remiseKDV || 0);

    return `| ${String(i + 1).padStart(2)} | ${ligne.agence.padEnd(17)} | ${ligne.date} | ${ligne.naturePassage.padEnd(20)} | ${ligne.nbPassages.toString().padStart(3)} | ${ligne.resultatPassage.padEnd(15)} | ${parseFloat(ligne.coutTRP || 0).toFixed(2).padStart(6)} | ${parseFloat(ligne.coutTRT || 0).toFixed(2).padStart(6)} | ${totalLigne.toFixed(0).padStart(6)} |`;
  })
  .join("\n");

  return `FACTURE TRANSPORTEUR - ${region}
  Transporteur : ${facture.transporteur}
  Date facture : ${facture.dateFacture}
  Période      : ${facture.periode === "MENSUELLE" ? facture.moisAnnee : `${facture.dateDebut} à ${facture.dateFin}`}
  N° Facture   : ${facture.numero}
  
  | #  | Agence             | Date       | Nature du Passage     | Nb  | Résultat Passage | TRP   | TRT   | Total |
  |----|--------------------|------------|------------------------|-----|------------------|-------|-------|--------|
  ${lignesText}
  ------------------------------------------------------------------------------------------
  TOTAL HT : ${totalHT.toFixed(0)}
  ...
  
  TOTAL Collecte :
    - PqB.dt : ${Number(totalCollectePqBDT).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
    - K°DV   : ${Number(totalCollecteKDV).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
    - S°M.dt : ${Number(totalCollecteSMDT).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
  
  TOTAL Alimentation :
    - PqB.dt : ${Number(totalAlimentationPqBDT).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
    - S°M.dt : ${Number(totalAlimentationSMDT).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
  
  TOTAL Remise :
    - K°DV   : ${Number(totalRemiseKDV).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
  `;
  };
  
  const handleSubmit = async () => {
    const payload = { ...facture, region };
    if (facture.periode === "MENSUELLE") {
      delete payload.dateDebut;
      delete payload.dateFin;
    } else if (facture.periode === "QUOTIDIENNE") {
      delete payload.moisAnnee;
    } else {
      alert("Veuillez sélectionner une période valide.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/factures/add", payload);
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

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Création Facture</h1>
      <input type="text" placeholder="N° facture" value={facture.numero} onChange={(e) => setFacture({ ...facture, numero: e.target.value })} />
      <select value={facture.periode} onChange={(e) => setFacture({ ...facture, periode: e.target.value })}>
        <option value="">-- Sélectionner la période --</option>
        <option value="MENSUELLE">Mensuelle</option>
        <option value="QUOTIDIENNE">Quotidienne</option>
      </select>
      {facture.periode === "MENSUELLE" && (
        <input type="text" placeholder="Mois/Année" value={facture.moisAnnee} onChange={(e) => setFacture({ ...facture, moisAnnee: e.target.value })} />
      )}
      {facture.periode === "QUOTIDIENNE" && (
        <>
          <input type="date" value={facture.dateDebut} onChange={(e) => setFacture({ ...facture, dateDebut: e.target.value })} />
          <input type="date" value={facture.dateFin} onChange={(e) => setFacture({ ...facture, dateFin: e.target.value })} />
        </>
      )}
      <input type="date" placeholder="Date Facture" value={facture.dateFacture} onChange={(e) => setFacture({ ...facture, dateFacture: e.target.value })} />
      <input
  type="text"
  name="idCaisse"
  value={facture.idCaisse}
  onChange={handleCaisseChange}
  className="border p-2 rounded"
  placeholder="ID Caisse"
/>
{region && (
  <p className="text-sm text-gray-700 mt-1">
    🏙️ Région détectée : <strong>{region}</strong>
  </p>
)}
      <select value={facture.transporteur} onChange={(e) => setFacture({ ...facture, transporteur: e.target.value })}>
        <option value="EXPRESS">EXPRESS</option>
        <option value="IBS">IBS</option>
        <option value="YOSR">YOSR</option>
      </select>

      <button onClick={addLigne}>+ Ajouter Ligne</button>

   
      {facture.lignes.map((ligne, index) => (
        <div key={index} className="border p-2 my-2 rounded">
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

          <input type="date" value={ligne.date} onChange={(e) => handleLigneChange(index, "date", e.target.value)} />
          <input type="text" placeholder="Nature du passage" value={ligne.naturePassage} onChange={(e) => handleLigneChange(index, "naturePassage", e.target.value)} />
          <input type="number" placeholder="Nb Passages" value={ligne.nbPassages} onChange={(e) => handleLigneChange(index, "nbPassages", e.target.value)} />
          <select
  value={ligne.resultatPassage}
  onChange={(e) => handleLigneChange(index, "resultatPassage", e.target.value)}
  className="border p-1 rounded"
>
  <option value="">-- Résultat passage --</option>
  <option value="REALISE">Réalisé</option>
  <option value="NEANT+CACHET">Néant + Cachet</option>
</select>

          <input type="number" placeholder="Coût TRP" value={ligne.coutTRP} onChange={(e) => handleLigneChange(index, "coutTRP", e.target.value)} />
          <input type="number" placeholder="Coût TRT" value={ligne.coutTRT} onChange={(e) => handleLigneChange(index, "coutTRT", e.target.value)} />

          <div>
            <label>Collecte</label>
            <input type="number" placeholder="PqBDT" value={ligne.collectePqBDT} onChange={(e) => handleLigneChange(index, "collectePqBDT", e.target.value)} />
            <input type="number" placeholder="KDV" value={ligne.collecteKDV} onChange={(e) => handleLigneChange(index, "collecteKDV", e.target.value)} />
            <input type="number" placeholder="SMDT" value={ligne.collecteSMDT} onChange={(e) => handleLigneChange(index, "collecteSMDT", e.target.value)} />
          </div>
          <div>
            <label>Alimentation</label>
            <input type="number" placeholder="PqBDT" value={ligne.alimentationPqBDT} onChange={(e) => handleLigneChange(index, "alimentationPqBDT", e.target.value)} />
            <input type="number" placeholder="SMDT" value={ligne.alimentationSMDT} onChange={(e) => handleLigneChange(index, "alimentationSMDT", e.target.value)} />
          </div>
          <div>
            <label>Remise</label>
            <input type="number" placeholder="KDV" value={ligne.remiseKDV} onChange={(e) => handleLigneChange(index, "remiseKDV", e.target.value)} />
          </div>

          <input type="number" placeholder="Total HT" value={ligne.totalHT} readOnly />
        </div>
      ))}

      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">Valider Facture</button>

      {factureFormattee && (
        <pre className="bg-gray-100 p-4 mt-4 whitespace-pre-wrap">{factureFormattee}</pre>
      )}
    {factureFormattee && (
  <>
    <pre className="bg-gray-100 p-4 mt-4 text-sm whitespace-pre-wrap overflow-auto">
      {factureFormattee}
    </pre>
    <button
      onClick={exportFacture}
      className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
    >
      📁 Exporter la facture
    </button>
  </>
)}<div className="space-x-2 mt-2">
<button onClick={exportPDF} className="bg-blue-600 text-white px-3 py-1 rounded">📄 Exporter PDF</button>
<button onClick={exportExcel} className="bg-green-600 text-white px-3 py-1 rounded">📊 Exporter Excel</button>
</div>
  
    </div>
    
  );
}

export default FactureForm;


