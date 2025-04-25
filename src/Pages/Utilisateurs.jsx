import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import axios from "../api/axiosConfig";
import { useNavigate } from 'react-router-dom';

const Utilisateurs = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [utilisateur, setUtilisateur] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    password: '',
    dateDebutTravail: '',
    role: 'EMPLOYEE'
  });
  const [editMode, setEditMode] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/acceuil');
    } else {
      fetchUtilisateurs();
    }
  }, [role, navigate]);

  const fetchUtilisateurs = () => {
    axios.get('http://localhost:8080/api/utilisateur/all')
      .then(res => setUtilisateurs(res.data))
      .catch(err => console.error('Erreur de récupération des utilisateurs :', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtilisateur(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/utilisateur/add', utilisateur);
        console.log('Utilisateur ajouté', response.data);
        fetchUtilisateurs();
        resetForm();
    } catch (error) {
        console.error('Erreur d\'ajout', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(`http://localhost:8080/api/utilisateur/update/${utilisateur.matricule}`, utilisateur);
        console.log('Utilisateur modifié', response.data);
        fetchUtilisateurs();
        resetForm();
    } catch (error) {
        console.error('Erreur de mise à jour', error);
    }
  };

  const handleEdit = (user) => {
    setUtilisateur({
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      password: '',
      dateDebutTravail: user.dateDebutTravail,
      role: user.role
    });
    setEditMode(true);
  };

  const confirmDelete = (matricule) => {
    setUserToDelete(matricule);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8080/api/utilisateur/delete/${userToDelete}`)
      .then(() => {
        fetchUtilisateurs();
        setOpenConfirm(false);
        setUserToDelete(null);
      })
      .catch(err => console.error("Erreur de suppression :", err));
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const resetForm = () => {
    setUtilisateur({
      matricule: '',
      nom: '',
      prenom: '',
      password: '',
      dateDebutTravail: '',
      role: 'EMPLOYEE'
    });
    setEditMode(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Gestion des Utilisateurs</h2>

      <form onSubmit={editMode ? handleUpdate : handleAddUser} style={{ marginBottom: 20 }}>
        <TextField
          label="Matricule"
          name="matricule"
          value={utilisateur.matricule}
          onChange={handleChange}
          required
          disabled={editMode}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Nom"
          name="nom"
          value={utilisateur.nom}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Prénom"
          name="prenom"
          value={utilisateur.prenom}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Date début de travail"
          type="date"
          name="dateDebutTravail"
          value={utilisateur.dateDebutTravail}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Mot de passe"
          type="password"
          name="password"
          value={utilisateur.password}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
        />
        <FormControl>
          <FormLabel>Rôle</FormLabel>
          <RadioGroup
            row
            name="role"
            value={utilisateur.role}
            onChange={handleChange}
          >
            <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
            <FormControlLabel value="EMPLOYEE" control={<Radio />} label="Employé" />
          </RadioGroup>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          {editMode ? "Modifier" : "Ajouter"}
        </Button>
        {editMode && (
          <Button onClick={resetForm} variant="outlined" style={{ marginLeft: 10 }}>
            Annuler
          </Button>
        )}
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matricule</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilisateurs.map((user) => (
              <TableRow key={user.matricule}>
                <TableCell>{user.matricule}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{new Date(user.dateDebutTravail).toLocaleDateString()}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user)} variant="outlined" size="small">Modifier</Button>
                  <Button onClick={() => confirmDelete(user.matricule)} variant="outlined" color="error" size="small" style={{ marginLeft: 8 }}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {utilisateurs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Aucun utilisateur</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Utilisateurs;
