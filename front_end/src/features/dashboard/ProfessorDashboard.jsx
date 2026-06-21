import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData, API_URLS } from "../../api/api";
import Swal from "sweetalert2";
import {
  FaBook, FaCheckCircle, FaClock, FaTimesCircle, FaStar, FaPlus, FaSpinner, FaEdit,
} from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function ProfessorDashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsRes, coursRes] = await Promise.all([
          fetchData(API_URLS.PROF_STATS).catch(() => null),
          fetchData(API_URLS.MES_COURS).catch(() => ({ data: [] })),
        ]);
        setStats(statsRes);
        setCours((coursRes.data || []).map((c) => ({
          id: c.id_cours,
          matiere: c.matiere,
          prix: `${c.prix} ${c.type_prix || "DH/h"}`,
          niveau: c.niveau_etude,
          statut: c.statut,
          image: c.image,
          created_at: c.created_at,
        })));
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Impossible de charger le tableau de bord.", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusBadge = (statut) => {
    if (statut === "valide") return { label: "Validé", cls: "bg-emerald-100 text-emerald-700" };
    if (statut === "en_attente") return { label: "En attente", cls: "bg-amber-100 text-amber-700" };
    return { label: "Rejeté", cls: "bg-rose-100 text-rose-700" };
  };

  const s = stats || { cours: { total: 0, valides: 0, en_attente: 0, rejetes: 0 }, evaluations: { total: 0, moyenne: 0 } };

  const statCards = [
    { icon: FaBook, label: "Total cours", value: s.cours.total, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: FaCheckCircle, label: "Validés", value: s.cours.valides, color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: FaClock, label: "En attente", value: s.cours.en_attente, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: FaStar, label: "Moyenne", value: s.evaluations.moyenne, color: "text-yellow-600", bg: "bg-yellow-50", suffix: "/5" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 text-[#0b1c30] font-[Inter,sans-serif]" style={{ background: "#f8f9ff" }}>
      <div className="max-w-[1120px] mx-auto px-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tableau de bord Professeur
            </h1>
            <p className="text-sm sm:text-base text-[#3c4a42] mt-1">
              Bonjour {user?.prenom}, gérez vos cours de révision sur UniConnect.
            </p>
          </div>
          <Link
            to="/addPartenaire"
            className="bg-[#006c49] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow w-full md:w-auto"
          >
            <FaPlus /> Ajouter un cours
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white p-4 sm:p-5 rounded-xl shadow border border-[#bbcabf]/30">
              <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon size={18} />
              </div>
              <p className="text-xs text-[#3c4a42] font-medium">{card.label}</p>
              <h3 className="text-xl sm:text-2xl font-semibold mt-1">
                {card.value}{card.suffix || ""}
              </h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Évolution des cours</h3>
              <p className="text-xs text-slate-400 mb-4">12 derniers mois</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.evolution_cours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} labelFormatter={(v) => `Mois : ${v}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Cours créés" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Évolution des évaluations</h3>
              <p className="text-xs text-slate-400 mb-4">12 derniers mois</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.evolution_evaluations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} labelFormatter={(v) => `Mois : ${v}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Évaluations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="moyenne" name="Moyenne" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Courses list */}
        <section className="bg-white rounded-xl shadow border border-[#bbcabf]/30">
          <div className="p-4 sm:p-5 border-b border-[#bbcabf]/30 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">Mes cours</h2>
            <span className="text-sm text-[#3c4a42] font-medium">{cours.length} cours</span>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-[#006c49] text-3xl" />
              </div>
            ) : cours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#3c4a42] mb-4">Aucun cours pour le moment.</p>
                <Link
                  to="/addPartenaire"
                  className="inline-flex items-center gap-2 bg-[#006c49] text-white px-6 py-3 rounded-lg font-semibold"
                >
                  <FaPlus /> Créer un cours
                </Link>
              </div>
            ) : (
              cours.map((c) => {
                const badge = statusBadge(c.statut);
                return (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#f8f9ff] border border-[#bbcabf]/40 hover:border-[#006c49] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {c.image ? (
                        <img src={c.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#adedd3] flex items-center justify-center shrink-0">
                          <FaBook className="text-[#006c49]" size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold truncate">{c.matiere}</p>
                        <p className="text-xs text-[#3c4a42]">{c.prix} · {c.niveau}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <button
                        onClick={() => navigate(`/editCours/${c.id}`)}
                        className="p-2 rounded-lg border border-[#bbcabf] hover:bg-[#eff4ff] hover:text-[#006c49] transition-all text-[#3c4a42] cursor-pointer bg-white"
                        title="Modifier"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}