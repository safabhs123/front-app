import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Box } from '@mui/material';

const Facture = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    numero: '',
    periode: '',
    page: '',
    transporteur: '',
    montantTotalHT: '',
    montantTotalTTC: ''
  });

  const [transporteurs, setTransporteurs] = useState([]);

  useEffect(() => {
    axios.get('/api/enums/transporteurs')
      .then(res => setTransporteurs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Appel du callback pour enregistrer la facture
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'grid', gap: 2, maxWidth: 500 }}>
      <TextField label="Numéro" name="numero" value={formData.numero} onChange={handleChange} required />
      <TextField label="Période" name="periode" value={formData.periode} onChange={handleChange} required />
      <TextField type="number" label="Page" name="page" value={formData.page} onChange={handleChange} required />

      <TextField
        select
        label="Transporteur"
        name="transporteur"
        value={formData.transporteur}
        onChange={handleChange}
        required
      >
        {transporteurs.map((t) => (
          <MenuItem key={t} value={t}>{t}</MenuItem>
        ))}
      </TextField>

      <TextField type="number" label="Montant HT" name="montantTotalHT" value={formData.montantTotalHT} onChange={handleChange} required />
      <TextField type="number" label="Montant TTC" name="montantTotalTTC" value={formData.montantTotalTTC} onChange={handleChange} required />

      <Button variant="contained" type="submit">Enregistrer</Button>
    </Box>
  );
};

export default Facture;
