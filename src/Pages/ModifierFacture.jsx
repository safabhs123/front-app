import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ModifierFacture.module.css';

const ModifierFacture = () => {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [transporteurs, setTransporteurs] = useState([]);
  const [regions, setRegions] = useState([]);
  const navigate = useNavigate();
  
  
  // Chargement initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const factureRes = await axios.get(`http://localhost:8080/api/factures/${id}`);
        setFacture(factureRes.data);

        const transporteursRes = await axios.get('http://localhost:8080/api/enums/transporteurs');
        setTransporteurs(transporteursRes.data);

        const regionsRes = await axios.get('http://localhost:8080/api/enums/regions');
        setRegions(regionsRes.data);
      } catch (error) {
        alert("Erreur de chargement des données");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/factures/${id}`, facture);
      alert('✅ Facture modifiée avec succès.');
      navigate('/acceuil');
    } catch (error) {
      alert('❌ Erreur lors de la modification.');
      console.error(error);
    }
  };

  if (!facture) return <div>Chargement...</div>;

  return (
    <div className={styles['modifier-facture-container']}>
      <h2>Modifier Facture #{facture.numero}</h2>
      <form onSubmit={handleSubmit} className={styles['modifier-facture-form']}>
        <label>Transporteur</label>
        <select
          value={facture.transporteur}
          onChange={(e) => setFacture({ ...facture, transporteur: e.target.value })}
        >
          {transporteurs.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Région</label>
        <select
  className={styles['modifier-facture-select']}
  value={facture.region || ''}
  onChange={(e) => setFacture({ ...facture, region: e.target.value })}
>
  {regions.map((r) => (
    <option key={r} value={r}>{r}</option>
  ))}
</select>


        <label>Date</label>
        <input
          type="date"
          value={facture.dateFacture?.substring(0, 10)}
          onChange={(e) => setFacture({ ...facture, dateFacture: e.target.value })}
        />

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default ModifierFacture;
