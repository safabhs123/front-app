
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import ProtectedRoute from './Pages/ProtectedRoute';
import Authentification from "./Pages/Authentification"; 
import Dashboard from './Pages/Dashboard';
import Acceuil from './Pages/Acceuil';

import Utilisateurs from './Pages/Utilisateurs';
import PrivateRoute from './Pages/PrivateRoute';
import GererCaisse from './Pages/GererCaisse';
import ControleFactures from './Pages/ControleFactures';

import FormFacture from './Pages/FormFacture';
function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Authentification />} />
        <Route path="formfacture" element={<FormFacture />} />
        <Route path="/acceuil" element={<Acceuil />} /> 
        {/* <Route path="/facture" element={<Facture />} /> */}
        <Route path="/controle-factures" element={ <PrivateRoute allowedRoles={['ADMIN_FUNCTIONAL']}>
        <ControleFactures />
        </PrivateRoute>
        }/>
        <Route path="/dashboard" element={
       <PrivateRoute allowedRoles={['ADMIN_FUNCTIONAL']}>
          <Dashboard />
        </PrivateRoute>
      } />

<Route path="/utilisateurs" element={
        <PrivateRoute allowedRoles={['ADMIN_USER']}>
          <Utilisateurs />
        </PrivateRoute>
 } />
      <Route path="/gerer-caisse" element={<GererCaisse />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;




