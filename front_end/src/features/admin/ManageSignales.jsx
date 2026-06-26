import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import Swal from "sweetalert2";
import { 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCheck, 
  FaBan, 
  FaTrashAlt, 
  FaFilter, 
  FaCalendarAlt, 
  FaUser, 
  FaChevronDown, 
  FaChevronUp 
} from "react-icons/fa";

const ManageSignales = () => {
  const [signales, setSignales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch reports from backend
  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData(`${API_BASE_URL}/admin/signalements`);
      setSignales(data.data || data);
    } catch (err) {
      console.error("Error loading signalements:", err);
      setError("Impossible de charger les signalements depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Update status (traite, rejete, en_attente)
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setActionLoading(reportId);
      await fetchData(`${API_BASE_URL}/admin/signalements/${reportId}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatus })
      });

      // Update locally
      setSignales(signales.map(s => s.id_signalement === reportId ? { ...s, statut: newStatus } : s));
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("Erreur", `Erreur de mise à jour: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de vouloir supprimer ce signalement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(reportId);
      await fetchData(`${API_BASE_URL}/admin/signalements/${reportId}`, {
        method: "DELETE"
      });

      // Remove locally
      setSignales(signales.filter(s => s.id_signalement !== reportId));
      if (expandedId === reportId) setExpandedId(null);
      Swal.fire("Succès", "Signalement supprimé avec succès.", "success");
    } catch (err) {
      console.error("Error deleting report:", err);
      Swal.fire("Erreur", `Erreur de suppression: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "traite":
      case "resolved":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Résolu
          </span>
        );
      case "rejete":
      case "ignored":
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Ignoré
          </span>
        );
      case "en_attente":
      case "pending":
      default:
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            En attente
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredSignales = signales.filter(s => {
    if (filterStatus === "all") return true;
    return s.statut === filterStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Gestion des signalements</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les alertes et les signalements de comportements inappropriés sur la plateforme.</p>
        </div>
        <button 
          onClick={loadReports}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          Rafraîchir
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-100 mb-6">
        <div className="flex items-center gap-2 text-slate-600">
          <FaFilter className="text-teal-600 text-sm" />
          <span className="text-sm font-semibold">Filtrer par statut:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg ml-2">
            {[
              { id: "all", label: "Tous" },
              { id: "en_attente", label: "En attente" },
              { id: "traite", label: "Résolus" },
              { id: "rejete", label: "Ignorés" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  filterStatus === f.id ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Total: <span className="text-slate-700 font-bold">{filteredSignales.length}</span> signalement(s)
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FaSpinner className="animate-spin text-teal-600 text-4xl mb-4" />
          <p className="text-gray-500 font-medium">Chargement des signalements depuis le serveur...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold mb-2">{error}</p>
          <button 
            onClick={loadReports} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 w-12"></th>
                  <th className="p-4 font-bold text-slate-600 text-sm">ID</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Profil Signalé</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Signalé Par</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Raison</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Date</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Statut</th>
                  <th className="p-4 font-bold text-slate-600 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSignales.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      Aucun signalement correspondant.
                    </td>
                  </tr>
                ) : (
                  filteredSignales.map((s) => {
                    const isExpanded = expandedId === s.id_signalement;
                    return (
                      <>
                        <tr 
                          key={s.id_signalement} 
                          className={`hover:bg-slate-50/40 transition cursor-pointer ${isExpanded ? "bg-slate-50/70" : ""}`}
                          onClick={() => setExpandedId(isExpanded ? null : s.id_signalement)}
                        >
                          <td className="p-4 text-center">
                            {isExpanded ? <FaChevronUp className="text-slate-400 text-xs" /> : <FaChevronDown className="text-slate-400 text-xs" />}
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-xs">
                            #{s.id_signalement < 10 ? `0${s.id_signalement}` : s.id_signalement}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-rose-500 text-sm" />
                              <div className="font-bold text-slate-800 text-sm">
                                {s.cible ? `${s.cible.prenom} ${s.cible.nom}` : "Utilisateur Inconnu"}
                              </div>
                            </div>
                            {s.cible && <div className="text-xs text-slate-400 font-mono mt-0.5 ml-5">{s.cible.email}</div>}
                          </td>
                          <td className="p-4">
                            <div className="text-slate-700 font-medium text-sm">
                              {s.auteur ? `${s.auteur.prenom} ${s.auteur.nom}` : "Anonyme"}
                            </div>
                            {s.auteur && <div className="text-xs text-slate-400 font-mono mt-0.5">{s.auteur.email}</div>}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-xs font-bold flex items-center gap-1 w-max">
                              <FaExclamationTriangle size={10} />
                              {s.raison}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-xs font-medium">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="text-slate-400" />
                              {formatDate(s.created_at)}
                            </div>
                          </td>
                          <td className="p-4">{getStatusBadge(s.statut)}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-center items-center gap-1.5">
                              {s.statut === "en_attente" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(s.id_signalement, "traite")}
                                    disabled={actionLoading === s.id_signalement}
                                    className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                                    title="Résoudre"
                                  >
                                    <FaCheck /> Résoudre
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(s.id_signalement, "rejete")}
                                    disabled={actionLoading === s.id_signalement}
                                    className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                    title="Ignorer"
                                  >
                                    <FaBan /> Ignorer
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteReport(s.id_signalement)}
                                disabled={actionLoading === s.id_signalement}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer"
                                title="Supprimer le signalement"
                              >
                                <FaTrashAlt size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Details Drawer */}
                        {isExpanded && (
                          <tr key={`details-${s.id_signalement}`} className="bg-slate-50/50">
                            <td colSpan="8" className="p-5 border-t border-slate-100/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-150">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Détails du signalement</h4>
                                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
                                    {s.hebergement && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <span className="font-bold text-slate-500">Annonce:</span>
                                        <span className="font-semibold text-teal-700">{s.hebergement.titre || `Hébergement #${s.hebergement.id_hebergement}`}</span>
                                        <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md text-xs">#{s.hebergement.id_hebergement}</span>
                                      </div>
                                    )}
                                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed italic">
                                      {s.details ? `"${s.details}"` : "Aucun détail textuel supplémentaire fourni."}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comportement recommandé</h4>
                                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                                    <h5 className="text-teal-900 font-bold text-sm mb-1">Actions d'administration rapides :</h5>
                                    <p className="text-teal-700 text-xs leading-relaxed">
                                      Si le motif est grave (ex: harcèlement ou arnaque), vous pouvez suspendre le profil de l'utilisateur signalé dans l'onglet <strong>Utilisateurs</strong> ou en cliquant directement sur le bouton d'administration correspondant.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSignales;
