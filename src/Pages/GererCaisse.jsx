import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, Paper, InputLabel, Select, MenuItem, TextField, FormControl,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

export default function GererCaisse() {
  const [caisse, setCaisse] = useState({
    idCaisse: '',
    region: '',
    transporteur: '',
    typeDeFonds: ''
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedidCaisse, setselectedidCaisse] = useState(null);
  const [caisses, setCaisses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [regions, setRegions] = useState([]);
  const [transporteurs, setTransporteurs] = useState([]);
  const [typesDeFonds, setTypesDeFonds] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/caisses/regions")
    .then(res => setRegions(res.data));       axios.get("http://localhost:8080/api/caisses/transporteurs").then(res => setTransporteurs(res.data));
    axios.get("http://localhost:8080/api/caisses/type-fonds").then(res => setTypesDeFonds(res.data));
    loadCaisses();
    console.log("Régions disponibles :", regions);
    console.log("Région actuelle dans caisse:", caisse.region);
  }, []);
  const loadCaisses = () => {
    axios.get("http://localhost:8080/api/caisses/all")
      .then(res => setCaisses(res.data));
  };

  const handleChange = (e) => {
    setCaisse({ ...caisse, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    console.log("Données envoyées :", caisse);

    axios.post("http://localhost:8080/api/caisses/add", caisse)
      .then(() => {
        loadCaisses();
        setCaisse({ idCaisse: '', region: '', transporteur: '', typeDeFonds: '' });
        setEditId(null);
      })
      .catch(error => {
        if (error.response) {
          console.error("Erreur backend :", error.response.data); // 👈 ici on capture l’erreur réelle
        } else {
          console.error("Erreur inconnue :", error);
        }
      });  };

  const handleEdit = () => {
    axios.put(`http://localhost:8080/api/caisses/update/${editId}`, caisse)
      .then(() => {
        loadCaisses();
        setCaisse({ idCaisse: '', region: '', transporteur: '', typeDeFonds: '' });
        setEditId(null);
      })
      .catch(err => console.error("Error editing caisse: ", err));
  };

 
  const handleOpenDialog = (id) => {
    setselectedidCaisse(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setselectedidCaisse(null);
    setOpenDialog(false);
  }; 
  const getRegionFromId = (idCaisse) => {
    if (!idCaisse) return "";
  
    const cleanedId = idCaisse.trim(); // Enlève les espaces
    const prefix = cleanedId.substring(0, 5); // Prend les 5 premiers caractères
  
    switch (prefix) {
      case "00099": return "Tunis";
      case "00199": return "Sousse";
      case "00299": return "Nabeul";
      case "00399": return "Sfax";
      case "00499": return "Gabes";
      case "00599": return "Gafsa";
      case "00699": return "Jendouba";
      case "00799": return "Medenin";
      default: return "Inconnue";
    }
  };
  const confirmDelete = () => {
    axios.delete(`http://localhost:8080/api/caisses/delete/${selectedidCaisse}`)
      .then(() => {
        loadCaisses();
        handleCloseDialog();
      })
      .catch(err => console.error("Erreur suppression :", err));
  };
  const isEditing = editId !== null;

  return (
    <Box p={3}>
      <Box display="flex" gap={4}>
        
        <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Ajouter / Modifier une Caisse</Typography>
        
<TextField
fullWidth
label="ID Caisse"
name="idCaisse"
value={caisse.idCaisse}
onChange={(e) => {
  const id = e.target.value;
  if (!isEditing) {
    setCaisse({
      ...caisse,
      idCaisse: id,
      region: getRegionFromId(id),
    });
  }
}}
InputProps={{ readOnly: isEditing }}
sx={{ mb: 2 }}
/>



<FormControl fullWidth sx={{ mb: 2 }}>
  <TextField
    label="Région"
    name="region"
    value={caisse.region}
    InputProps={{ readOnly: isEditing }}
    fullWidth
  />
</FormControl>



            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Transporteur</InputLabel>
              <Select
                name="transporteur"
                value={caisse.transporteur}
                onChange={handleChange}
                label="Transporteur"
              >
                {transporteurs.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type de Fonds</InputLabel>
              <Select
                name="typeDeFonds"
                value={caisse.typeDeFonds}
                onChange={handleChange}
                label="Type de Fonds"
              >
                {typesDeFonds.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={editId ? handleEdit : handleAdd}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Paper>
        </Box>

        {/* LISTE */}
        <Box flex={1}>
          <Typography variant="h6" gutterBottom>Liste des Caisses</Typography>
          {caisses.map(c => (
            <Paper key={c.idCaisse} sx={{ p: 2, mb: 2 }}>
              <Typography><strong>ID :</strong> {c.idCaisse}</Typography>
              <Typography><strong>Région :</strong> {c.region}</Typography>
              <Typography><strong>Transporteur :</strong> {c.transporteur}</Typography>
              <Typography><strong>Type de Fonds :</strong> {c.typeDeFonds}</Typography>
              <Box mt={1}>
                <Button size="small" onClick={() => {
                  setCaisse(c);
                  setEditId(c.idCaisse);
                }}>Modifier</Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleOpenDialog(c.idCaisse)}
                  sx={{ ml: 2 }}
                >
                  Supprimer
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette caisse ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
