import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from '../api/axiosConfig.jsx';
import './Authentification.css';

const Authentification = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login",
        { matricule, password },
        {
          headers: {
            'Content-Type': 'application/json',
            //withCredentials: true
          }
        }
      );

      if (response.status === 200) {
        const role  = response.data;
      
        localStorage.setItem("role", role);
        localStorage.setItem("matricule", matricule);
        localStorage.setItem("motDePasse", password);
      
        console.log("Connexion réussie avec le rôle :", role);

        setMessage("Connexion réussie !");
        setSeverity("success");

        // ✅ Redirection immédiate après connexion réussie
        if (role === "ADMIN_USER") {
          navigate('/dashboard', { replace: true });
        } else if (role === "ADMIN_FUNCTIONAL") {
          navigate('/controle-factures', { replace: true });
        } else if (role === "EMPLOYEE") {
          navigate("/acceuil", { replace: true });
        } else {
          setMessage("Rôle non reconnu");
          setSeverity("error");
        }
      }
    } catch (error) {
      console.error("Erreur login :", error);
      setSeverity("error");
  
      if (error.response) {
        setMessage(error.response.data.message || "Erreur de connexion");
      } else if (error.request) {
        setMessage("Erreur de connexion au serveur");
      } else {
        setMessage("Erreur inattendue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-container" maxWidth="xs">
      <form   autoComplete="new-password" onSubmit={handleSubmit}>
        <Typography variant="h4" className="auth-header" gutterBottom>
          <span style={{ color: 'white' }}>Authentification</span>
        </Typography>

        {message && (
          <Alert severity={severity} style={{ marginBottom: '16px' }}>
            {message}
          </Alert>
        )}

        <div className="auth-form">
          <TextField
            label="Matricule"
            variant="outlined"
            fullWidth
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
             autoComplete="new-password"
            required
            margin="normal"
          />
        </div>

        <div className="auth-form">
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             autoComplete="new-password"
            required
            margin="normal"
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Se connecter'}
        </Button>
      </form>
    </Box>
  );
};

export default Authentification;
