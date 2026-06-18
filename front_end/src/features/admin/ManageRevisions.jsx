import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import Swal from "sweetalert2";
import { 
  FaBookOpen, 
  FaCheck, 
  FaBan, 
  FaSpinner, 
  FaTrashAlt, 
  FaClock, 
  FaGraduationCap,
  FaFileAlt,
  FaTimes,
  FaDownload,
  FaFilePdf,
  FaFileImage,
  FaExternalLinkAlt
} from "react-icons/fa";

const DocumentPreviewModal = ({ doc, course, onClose }) => {
  if (!doc) return null;
  const isPdf = doc.toLowerCase().endsWith(".pdf") || doc.includes("pdf");
  const professorName = course?.professeur
    ? `${course.professeur.prenom} ${course.professeur.nom}`
    : "Professeur";
  const downloadUrl = isPdf
    ? doc.replace("/upload/", "/upload/fl_attachment/")
    : doc.replace("/upload/", "/upload/fl_attachment/");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              {isPdf ? <FaFilePdf size={20} /> : <FaFileImage size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Document de vérification</h3>
              <p className="text-xs text-slate-400 font-medium">{professorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={downloadUrl}
              download
              className="p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl transition cursor-pointer"
              title="Télécharger"
            >
              <FaDownload size={14} />
            </a>
            <a
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition cursor-pointer"
              title="Ouvrir dans un nouvel onglet"
            >
              <FaExternalLinkAlt size={13} />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-400 rounded-xl transition cursor-pointer"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 bg-[#f8f9fa] flex items-center justify-center min-h-[400px]">
          {isPdf ? (
            <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <iframe
                src={doc}
                className="w-full h-full border-0"
                title="Document PDF"
              />
            </div>
          ) : (
            <img
              src={doc}
              alt="Diplôme"
              className="max-w-full max-h-[600px] rounded-2xl shadow-sm object-contain bg-white"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">
            {course?.description?.substring(0, 60) || "Document de vérification"}
          </span>
          <span className="font-semibold">
            {isPdf ? "PDF" : "Image"} • {course?.created_at ? new Date(course.created_at).toLocaleDateString("fr-FR") : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

const ManageRevisions = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewDoc, setPreviewDoc] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData(`${API_BASE_URL}/admin/cours`);
      setCourses(data.data || data);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Impossible de charger les cours depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleUpdateStatus = async (courseId, newStatus) => {
    try {
      setActionLoading(courseId);
      await fetchData(`${API_BASE_URL}/admin/cours/${courseId}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatus })
      });

      // Update state locally
      setCourses(courses.map(c => c.id_cours === courseId ? { ...c, statut: newStatus } : c));
    } catch (err) {
      console.error("Error updating course status:", err);
      Swal.fire("Erreur", `Erreur de mise à jour: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (courseId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de vouloir supprimer ce cours définitivement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(courseId);
      await fetchData(`${API_BASE_URL}/admin/cours/${courseId}`, {
        method: "DELETE"
      });

      // Update state locally
      setCourses(courses.filter(c => c.id_cours !== courseId));
      Swal.fire("Succès", "Cours supprimé avec succès.", "success");
    } catch (err) {
      console.error("Error deleting course:", err);
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

  const filteredCourses = courses.filter(c => {
    if (filterStatus === "all") return true;
    return c.statut === filterStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Gestion des cours</h1>
          <p className="text-slate-500 text-sm mt-1">Approuvez, rejetez ou supprimez les offres de cours de soutien publiées par les professeurs.</p>
        </div>
        <button 
          onClick={loadCourses}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          Rafraîchir
        </button>
      </div>

      {/* Filter statistics bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-100 mb-6">
        <div className="flex items-center gap-2 text-slate-600">
          <FaBookOpen className="text-teal-600 text-sm" />
          <span className="text-sm font-semibold">Statut du cours:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg ml-2">
            {[
              { id: "all", label: "Tous" },
              { id: "en_attente", label: "En attente" },
              { id: "valide", label: "Validés" },
              { id: "rejete", label: "Rejetés" }
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
          Total filtré: <span className="text-slate-700 font-bold">{filteredCourses.length}</span> cours
        </div>
      </div>

      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc.url}
          course={previewDoc.course}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FaSpinner className="animate-spin text-teal-600 text-4xl mb-4" />
          <p className="text-gray-500 font-medium">Chargement des cours depuis la base de données...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold mb-2">{error}</p>
          <button 
            onClick={loadCourses} 
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
                  <th className="p-4 font-bold text-slate-600 text-sm">Cours & Professeur</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Matière</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Prix / Format</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Niveau</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Diplôme</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Statut</th>
                  <th className="p-4 font-bold text-slate-600 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Aucun cours de soutien trouvé pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((c) => (
                    <tr key={c.id_cours} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50"
                            src={c.image_cours || `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=150&q=80`}
                            alt="cours"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=150&q=80";
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-800 text-sm sm:text-base">
                              {c.description ? c.description.substring(0, 45) + (c.description.length > 45 ? "..." : "") : "Cours de soutien"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                              <span className="font-medium text-teal-600">Par:</span>
                              <span className="font-semibold text-slate-600">
                                {c.professeur ? `${c.professeur.prenom} ${c.professeur.nom}` : "Professeur EMSI"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-700">
                        {c.matiere || "Soutien scolaire"}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-teal-600">{c.prix} DH</div>
                        <div className="text-xs text-slate-400 font-medium capitalize mt-0.5">{c.mode_enseignement}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                          {c.niveau_etude || "Tous niveaux"}
                        </span>
                      </td>
                      <td className="p-4">
                        {c.diplome_verification ? (
                          <button
                            onClick={() => setPreviewDoc({ url: c.diplome_verification, course: c })}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                            title="Prévisualiser le diplôme"
                          >
                            <FaFileAlt size={13} />
                            <span>Diplôme</span>
                            <span className="text-[10px] opacity-60 ml-0.5">
                              {c.diplome_verification.toLowerCase().endsWith(".pdf") ? "PDF" : "IMG"}
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="p-4">{getStatusBadge(c.statut)}</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-1.5">
                          {/* Approve Action */}
                          {c.statut !== "valide" && (
                            <button
                              onClick={() => handleUpdateStatus(c.id_cours, "valide")}
                              disabled={actionLoading === c.id_cours}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Valider et Publier"
                            >
                              <FaCheck /> Valider
                            </button>
                          )}

                          {/* Reject Action */}
                          {c.statut !== "rejete" && (
                            <button
                              onClick={() => handleUpdateStatus(c.id_cours, "rejete")}
                              disabled={actionLoading === c.id_cours}
                              className="px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Rejeter le cours"
                            >
                              <FaBan /> Rejeter
                            </button>
                          )}

                          {/* Permanent Delete Action */}
                          <button
                            onClick={() => handleDelete(c.id_cours)}
                            disabled={actionLoading === c.id_cours}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer"
                            title="Supprimer définitivement"
                          >
                            {actionLoading === c.id_cours ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrashAlt size={12} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRevisions;
