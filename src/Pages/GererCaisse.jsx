import React, { useEffect, useState } from "react";

function ListeCaisses() {
  const [caisses, setCaisses] = useState([]);
  const [regions, setRegions] = useState([]);
  const [transporteurs, setTransporteurs] = useState([]);
  const [newCaisse, setNewCaisse] = useState({ id: "", regionId: "" });
  const [editing, setEditing] = useState({ regionId: null, oldTransporteurId: null });

  useEffect(() => {
    fetchCaisses();
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data));
    fetch("/api/transporteurs")
      .then((res) => res.json())
      .then((data) => setTransporteurs(data));
  }, []);

  const fetchCaisses = () => {
    fetch("/api/caisses")
      .then((res) => res.json())
      .then((data) => setCaisses(data));
  };

  const handleAdd = () => {
    if (!newCaisse.id || !newCaisse.regionId) return;
    const region = regions.find((r) => r.id === parseInt(newCaisse.regionId));
    fetch("/api/caisses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(newCaisse.id), region }),
    }).then(() => {
      setNewCaisse({ id: "", regionId: "" });
      fetchCaisses();
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/caisses/${id}`, { method: "DELETE" }).then(() => fetchCaisses());
  };

  const removeTransporteurFromRegion = (regionId, transporteurId) => {
    fetch(`/api/regions/${regionId}/transporteurs/${transporteurId}`, {
      method: "DELETE",
    }).then(() => fetchCaisses());
  };

  const handleReplaceTransporteur = (regionId, oldTransporteurId, newTransporteurId) => {
    if (!newTransporteurId) return;
    fetch(`/api/regions/${regionId}/transporteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transporteurId: newTransporteurId }),
    }).then(() => {
      setEditing({ regionId: null, oldTransporteurId: null });
      fetchCaisses();
    });
  };

  const addTransporteurToRegion = (regionId, transporteurId) => {
    fetch(`/api/regions/${regionId}/transporteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transporteurId }),
    }).then(() => {
      setEditing({ regionId: null, oldTransporteurId: null });
      fetchCaisses();
    });
  };

  const startEditing = (regionId, oldTransporteurId) => {
    setEditing({ regionId, oldTransporteurId });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Caisses</h1>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="number"
          placeholder="ID Caisse"
          value={newCaisse.id}
          onChange={(e) => setNewCaisse({ ...newCaisse, id: e.target.value })}
          className="border rounded p-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newCaisse.regionId}
          onChange={(e) => setNewCaisse({ ...newCaisse, regionId: e.target.value })}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Sélectionner une région --</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all"
        >
          Ajouter
        </button>
      </div>

      <table className="w-full border border-gray-300 shadow-sm text-sm">
        <thead className="bg-gray-100 text-left text-gray-700">
          <tr>
            <th className="border px-4 py-3">ID Caisse</th>
            <th className="border px-4 py-3">Région</th>
            <th className="border px-4 py-3">Transporteurs</th>
            <th className="border px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {caisses.map((caisse) => (
            <tr key={caisse.id} className="hover:bg-gray-50">
              <td className="border px-4 py-3">{caisse.id}</td>
              <td className="border px-4 py-3">{caisse.region ? caisse.region.nom : "Non liée"}</td>
              <td className="border px-4 py-3 min-w-[250px]">
                {caisse.region ? (
                  (caisse.region.transporteurs ?? []).length > 0 ? (
                    caisse.region.transporteurs.map((t) => (
                      <div key={t.id} className="flex items-center justify-between my-1">
                        <span className="font-medium">{t.nom}</span>
                        {editing.regionId === caisse.region.id &&
                        editing.oldTransporteurId === t.id ? (
                          <select
                            autoFocus
                            onBlur={() => setEditing({ regionId: null, oldTransporteurId: null })}
                            onChange={(e) =>
                              handleReplaceTransporteur(
                                caisse.region.id,
                                t.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="border rounded p-1 text-sm"
                            defaultValue=""
                          >
                            <option value="">-- Choisir --</option>
                            {transporteurs
                              .filter(
                                (tr) =>
                                  !(caisse.region.transporteurs ?? []).some(
                                    (r) => r.id === tr.id
                                  )
                              )
                              .map((tr) => (
                                <option key={tr.id} value={tr.id}>
                                  {tr.nom}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(caisse.region.id, t.id)}
                              className="text-yellow-600 hover:text-yellow-700 transition"
                              title="Modifier transporteur"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => removeTransporteurFromRegion(caisse.region.id, t.id)}
                              className="text-red-600 hover:text-red-700 transition"
                              title="Supprimer transporteur"
                            >
                              ❌
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="italic text-gray-500">Aucun transporteur</span>
                      {editing.regionId === caisse.region.id &&
                      editing.oldTransporteurId === null ? (
                        <select
                          autoFocus
                          onBlur={() => setEditing({ regionId: null, oldTransporteurId: null })}
                          onChange={(e) => {
                            const newId = parseInt(e.target.value);
                            if (newId) {
                              addTransporteurToRegion(caisse.region.id, newId);
                            }
                          }}
                          className="border rounded p-1 text-sm ml-2"
                          defaultValue=""
                        >
                          <option value="">-- Ajouter transporteur --</option>
                          {transporteurs
                            .filter(
                              (tr) =>
                                !(caisse.region.transporteurs ?? []).some(
                                  (r) => r.id === tr.id
                                )
                            )
                            .map((tr) => (
                              <option key={tr.id} value={tr.id}>
                                {tr.nom}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditing({ regionId: caisse.region.id, oldTransporteurId: null })}
                          className="text-green-600 hover:text-green-700 font-semibold transition"
                          title="Ajouter un transporteur"
                        >
                          ➕ Ajouter
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  "Non liée"
                )}
              </td>
              <td className="border px-4 py-3 text-center">
                <button
                  onClick={() => handleDelete(caisse.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow text-sm transition"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListeCaisses;
