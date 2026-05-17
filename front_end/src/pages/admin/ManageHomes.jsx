import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import Swal from "sweetalert2";
import { 
  FaHome, 
  FaCheck, 
  FaBan, 
  FaSpinner, 
  FaTrashAlt, 
  FaClock, 
  FaEye,
  FaMapMarkerAlt,
  FaUser
} from "react-icons/fa";

const ManageHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadHomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData(`${API_BASE_URL}/admin/hebergements`);
      setHomes(data.data || data);
    } catch (err) {
      console.error("Error loading accommodations:", err);
      setError("Impossible de charger les hébergements depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomes();
  }, []);

  const handleUpdateStatus = async (homeId, newStatus) => {
    try {
      setActionLoading(homeId);
      await fetchData(`${API_BASE_URL}/admin/hebergements/${homeId}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatus })
      });

      // Update state locally
      setHomes(homes.map(h => {
        const id = h.id_hebergement || h.id;
        return id === homeId ? { ...h, statut: newStatus } : h;
      }));
    } catch (err) {
      console.error("Error updating home status:", err);
      Swal.fire("Erreur", `Erreur de mise à jour: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (homeId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de vouloir supprimer cet hébergement définitivement ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(homeId);
      await fetchData(`${API_BASE_URL}/admin/hebergements/${homeId}`, {
        method: "DELETE"
      });

      // Update state locally
      setHomes(homes.filter(h => (h.id_hebergement || h.id) !== homeId));
      Swal.fire("Succès", "Hébergement supprimé avec succès.", "success");
    } catch (err) {
      console.error("Error deleting home:", err);
      Swal.fire("Erreur", `Erreur de suppression: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "valide":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Validé
          </span>
        );
      case "rejete":
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejeté
          </span>
        );
      case "en_attente":
      default:
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1 w-max animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            En attente
          </span>
        );
    }
  };

  const filteredHomes = homes.filter(h => {
    if (filterStatus === "all") return true;
    return h.statut === filterStatus;
  });

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <FaHome className="text-teal-600" /> Gérer les hébergements
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Modérez et validez les annonces d'hébergement publiées par les propriétaires.
          </p>
        </div>
        <button 
          onClick={loadHomes} 
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold cursor-pointer w-max"
        >
          Rafraîchir les données
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3 flex-wrap">
        {[
          { key: "all", label: "Tous les hébergements", color: "border-slate-300 text-slate-600 bg-slate-50" },
          { key: "en_attente", label: "En attente", color: "border-amber-300 text-amber-800 bg-amber-50/50" },
          { key: "valide", label: "Validés", color: "border-emerald-300 text-emerald-800 bg-emerald-50/50" },
          { key: "rejete", label: "Rejetés", color: "border-rose-300 text-rose-800 bg-rose-50/50" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              filterStatus === tab.key 
                ? "bg-slate-800 text-white border-slate-850 shadow-sm" 
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label} ({
              tab.key === "all" 
                ? homes.length 
                : homes.filter(h => h.statut === tab.key).length
            })
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FaSpinner className="animate-spin text-teal-600 text-4xl mb-4" />
          <p className="text-gray-500 font-medium">Chargement des hébergements...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold mb-2">{error}</p>
          <button 
            onClick={loadHomes} 
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-750 transition"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">ID</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">Hébergement</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">Propriétaire</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">Prix</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">Localisation</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider">Statut</th>
                  <th className="p-4 font-extrabold text-slate-700 text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredHomes.map((home) => {
                  const id = home.id_hebergement || home.id;
                  const imageUrl = home.image_principale || home.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=85";
                  
                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 text-slate-400 font-semibold">#{id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={imageUrl} 
                            alt={home.titre || "Chambre"} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs" 
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=85";
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {home.titre || home.type || "Chambre EMSI"}
                            </p>
                            <p className="text-xs text-slate-450 mt-0.5">
                              {home.type_chambre || "Chambre Partagée"} • {home.nombre_chambres || home.nbr_chambres || 1} ch.
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <FaUser size={11} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 text-xs capitalize">
                              {home.proprietaire?.prenom} {home.proprietaire?.nom}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Propriétaire</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-teal-600 font-extrabold text-sm">
                        {home.prix || home.price} DH<span className="text-[10px] text-slate-400 font-normal">/mois</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <FaMapMarkerAlt className="text-slate-400" />
                          <span>{home.localisation || home.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(home.statut)}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-1.5">
                          {home.statut !== "valide" && (
                            <button
                              onClick={() => handleUpdateStatus(id, "valide")}
                              disabled={actionLoading === id}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                              title="Approuver l'annonce"
                            >
                              <FaCheck size={12} />
                            </button>
                          )}
                          {home.statut !== "rejete" && (
                            <button
                              onClick={() => handleUpdateStatus(id, "rejete")}
                              disabled={actionLoading === id}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-650 hover:text-rose-700 rounded-lg transition cursor-pointer"
                              title="Rejeter l'annonce"
                            >
                              <FaBan size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={actionLoading === id}
                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-red-600 rounded-lg transition cursor-pointer"
                            title="Supprimer définitivement"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredHomes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 font-medium">
                      Aucun hébergement trouvé pour cette catégorie.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomes;
