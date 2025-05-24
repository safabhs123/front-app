import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';

function RapportModalBootstrap({ show, onHide }) {
  const [rapport, setRapport] = useState([]);
  const pdfRef = useRef(); // Pour cibler le contenu à exporter

  useEffect(() => {
    const storedRapport = localStorage.getItem("rapport");
    if (storedRapport) {
      setRapport(JSON.parse(storedRapport));
      localStorage.removeItem("rapport");
    }
  }, [show]);

  const exporterPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin:       0.5,
      filename:     'rapport_comparaison.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'cm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen scrollable>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🧾 Rapport de Comparaison</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3 d-flex justify-content-end">
          <Button variant="outline-success" onClick={exporterPDF}>
            📄 Exporter en PDF
          </Button>
        </div>

        <div className="table-responsive" ref={pdfRef}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
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
                  <td className={r.statut === "OK" ? "text-success fw-bold" : "text-danger fw-bold"}>
                    {r.statut}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RapportModalBootstrap;
