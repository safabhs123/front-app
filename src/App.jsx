import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import ProtectedRoute from './Pages/ProtectedRoute';
import Authentification from "./Pages/Authentification";
import Dashboard from "./Pages/Dashboard";
import Acceuil from "./Pages/Acceuil";

import Utilisateurs from "./Pages/Utilisateurs";
import PrivateRoute from "./Pages/PrivateRoute";
import GererCaisse from "./Pages/GererCaisse";
import ControleFactures from "./Pages/ControleFactures";
import Facture from "./Pages/Facture";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Authentification />} />
				<Route path="/acceuil" element={<Acceuil />} />
				<Route path="/facture" element={<Facture />} />
				<Route path="/controle-factures" element={<ControleFactures />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute allowedRoles={["ADMIN"]}>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				{/* //git  */}

				<Route
					path="/utilisateurs"
					element={
						<PrivateRoute allowedRoles={["ADMIN"]}>
							<Utilisateurs />
						</PrivateRoute>
					}
				/>
				<Route path="/gerer-caisse" element={<GererCaisse />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
