// src/Pages/ControleFacture.jsx
import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ControleFacture = () => {
  const navigate = useNavigate();

  const handleGererCaisse = () => {
    navigate('/gerer-caisse');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Contrôle des Factures
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGererCaisse}
        style={{ marginTop: '20px' }}
      >
        Gérer Caisse
      </Button>
    </Box>
  );
};

export default ControleFacture;

