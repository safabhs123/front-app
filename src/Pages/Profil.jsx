
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Profil = ({ nom, prenom, role, date }) => {
  return (
    <Card sx={{ maxWidth: 400, margin: '20px auto', padding: 2, borderRadius: '16px', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">Profil Utilisateur</Typography>
        <Typography variant="body1"><strong>Nom :</strong> {nom}</Typography>
        <Typography variant="body1"><strong>Prénom :</strong> {prenom}</Typography>
        <Typography variant="body1"><strong>Rôle :</strong> {role}</Typography>
        <Typography variant="body1"><strong>Date de début :</strong> {date}</Typography>
      </CardContent>
    </Card>
  );
};

export default Profil;

  