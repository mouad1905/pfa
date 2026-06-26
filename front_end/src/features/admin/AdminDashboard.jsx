import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line,
} from "recharts";
import {
  FaUsers, FaHome, FaBookOpen, FaStar, FaEllipsisH, FaClipboardList, FaCheckCircle,
  FaClock, FaTimesCircle, FaShieldAlt, FaFlag, FaFileAlt, FaCheck, FaUserCog,
  FaChartLine, FaChartBar, FaCog, FaExclamationCircle,
} from "react-icons/fa";

const CustomTooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatMois = (mois) => {
  const d = new Date(mois + "-01");
  return d.toLocaleDateString("fr-FR", { month: "short" });
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, evolutionData] = await Promise.all([
        fetchData(`${API_BASE_URL}/admin/statistiques`),
        fetchData(`${API_BASE_URL}/admin/statistiques/evolution`).catch(() => null),
      ]);
      setStats(statsData);
      setEvolution(evolutionData);
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      setError("Impossible de charger les statistiques depuis la base de données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const users = stats.utilisateurs || { total: 0, etudiants: 0, professeurs: 0, proprietaires: 0, locateurs: 0, admins: 0, suspendus: 0, en_attente: 0, actifs: 0, inscrits_7j: 0, inscrits_30j: 0 };
  const annonces = stats.annonces || { hebergements_valides: 0, hebergements_en_attente: 0, hebergements_rejetes: 0, cours_valides: 0, cours_en_attente: 0, cours_rejetes: 0 };
  const reservations = stats.reservations || { total: 0, en_attente: 0, confirmees: 0, annulees: 0, en_cours: 0, expirees: 0 };
  const finances = stats.finances || { total_transactions: 0, chiffre_affaires: 0, reussi: 0, echoue: 0 };
  const signalements = stats.signalements || { total: 0, en_attente: 0, traites: 0, rejetes: 0 };
  const reclamations = stats.reclamations || { total: 0, en_attente: 0, traitees: 0, rejetees: 0 };
  const evaluations = stats.evaluations || { total: 0, moyenne_generale: 0, notes_5: 0, notes_4: 0, notes_3: 0, notes_2: 0, notes_1: 0 };

  const evolutionReservations = (evolution?.reservations || []).map(r => ({ ...r, name: formatMois(r.mois) }));
  const evolutionEvaluations = (evolution?.evaluations || []).map(e => ({ ...e, name: formatMois(e.mois) }));

  const totalHebergements = annonces.hebergements_valides + annonces.hebergements_en_attente;
  const totalCours = annonces.cours_valides + annonces.cours_en_attente;
  const satisfactionPct = evaluations.total > 0
    ? Math.round((evaluations.moyenne_generale / 5) * 100)
    : 0;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-10 rounded-3xl text-center shadow-sm max-w-md">
          <FaExclamationCircle className="text-4xl text-rose-400 mx-auto mb-3" />
          <p className="font-bold text-lg mb-2">Une erreur est survenue</p>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button
            onClick={loadStats}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold transition cursor-pointer shadow-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-slate-400 mt-1">Aperçu général de l'activité de la plateforme</p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <FaUsers className="text-[#008282] text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisateurs</p>
            <h3 className="text-2xl font-black text-[#1e293b]">{users.total}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-teal-600 font-bold">{users.etudiants}</span> étudiants · <span className="text-teal-600 font-bold">{users.professeurs}</span> profs
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <FaHome className="text-indigo-500 text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hébergements</p>
            <h3 className="text-2xl font-black text-[#1e293b]">{totalHebergements}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-emerald-600 font-bold">{annonces.hebergements_valides}</span> validés · <span className="text-amber-500 font-bold">{annonces.hebergements_en_attente}</span> en attente
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <FaBookOpen className="text-sky-500 text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cours</p>
            <h3 className="text-2xl font-black text-[#1e293b]">{totalCours}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-emerald-600 font-bold">{annonces.cours_valides}</span> validés · <span className="text-amber-500 font-bold">{annonces.cours_en_attente}</span> en attente
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <FaStar className="text-amber-500 text-xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Satisfaction</p>
            <h3 className="text-2xl font-black text-[#1e293b]">{satisfactionPct}%</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-amber-600 font-bold">{evaluations.moyenne_generale}</span> / 5 · {evaluations.total} avis
            </p>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1e293b]">Réservations (12 mois)</h3>
              <p className="text-[11px] text-slate-400">Évolution mensuelle des réservations</p>
            </div>
            <FaEllipsisH className="text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolutionReservations}>
              <defs>
                <linearGradient id="colorReserv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008282" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#008282" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltipContent />} />
              <Area type="monotone" dataKey="total" stroke="#008282" strokeWidth={2} fill="url(#colorReserv)" name="Réservations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1e293b]">Évaluations (12 mois)</h3>
              <p className="text-[11px] text-slate-400">Volume et note moyenne mensuelle</p>
            </div>
            <FaEllipsisH className="text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={evolutionEvaluations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 5]} />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar yAxisId="left" dataKey="total" fill="#008282" radius={[4, 4, 0, 0]} name="Total évaluations" />
              <Line yAxisId="right" type="monotone" dataKey="moyenne" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Moyenne /5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Activités & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* Left: Activités & Réservations + Audit */}
        <div className="lg:col-span-2 space-y-5">

          {/* Activités & Réservations */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#1e293b] mb-4">Activités & Réservations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <FaClipboardList className="text-slate-400 text-xl mx-auto mb-1" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                <p className="text-xl font-black text-[#1e293b] mt-0.5">{reservations.total}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <FaCheckCircle className="text-emerald-500 text-xl mx-auto mb-1" />
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Confirmées</p>
                <p className="text-xl font-black text-emerald-800 mt-0.5">{reservations.confirmees}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <FaClock className="text-amber-500 text-xl mx-auto mb-1" />
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">En attente</p>
                <p className="text-xl font-black text-amber-800 mt-0.5">{reservations.en_attente}</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-4 text-center">
                <FaTimesCircle className="text-rose-400 text-xl mx-auto mb-1" />
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Annulées</p>
                <p className="text-xl font-black text-rose-800 mt-0.5">{reservations.annulees}</p>
              </div>
            </div>
          </div>

          {/* Audit des validations */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-[#008282] text-lg" />
              <h3 className="text-sm font-bold text-[#1e293b]">Audit des validations requises</h3>
            </div>
            <div className="space-y-2.5">

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <FaHome className="text-indigo-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1e293b]">Hébergements en attente</p>
                    <p className="text-[10px] text-slate-400">Annonces nécessitant validation</p>
                  </div>
                </div>
                {annonces.hebergements_en_attente > 0 ? (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg animate-pulse">
                    {annonces.hebergements_en_attente} À VALIDER
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <FaCheck className="text-xs" /> À jour
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                    <FaBookOpen className="text-sky-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1e293b]">Cours de soutien en attente</p>
                    <p className="text-[10px] text-slate-400">Offres de révision nécessitant validation</p>
                  </div>
                </div>
                {annonces.cours_en_attente > 0 ? (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg animate-pulse">
                    {annonces.cours_en_attente} À VALIDER
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <FaCheck className="text-xs" /> À jour
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <FaFlag className="text-rose-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1e293b]">Signalements</p>
                    <p className="text-[10px] text-slate-400">{signalements.traites} traités · {signalements.rejetes} rejetés</p>
                  </div>
                </div>
                {signalements.en_attente > 0 ? (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg animate-pulse">
                    {signalements.en_attente} À TRAITER
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <FaCheck className="text-xs" /> Aucun
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FaFileAlt className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1e293b]">Réclamations</p>
                    <p className="text-[10px] text-slate-400">{reclamations.traitees} traitées · {reclamations.rejetees} rejetées</p>
                  </div>
                </div>
                {reclamations.en_attente > 0 ? (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg animate-pulse">
                    {reclamations.en_attente} À TRAITER
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <FaCheck className="text-xs" /> Aucune
                  </span>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">

          {/* Statut des comptes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaUserCog className="text-[#008282] text-lg" />
              <h3 className="text-sm font-bold text-[#1e293b]">Statut des comptes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs text-slate-600">Actifs</span>
                </div>
                <span className="text-xs font-bold text-[#1e293b]">{users.actifs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-xs text-slate-600">En attente</span>
                </div>
                <span className="text-xs font-bold text-[#1e293b]">{users.en_attente}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span className="text-xs text-slate-600">Suspendus</span>
                </div>
                <span className="text-xs font-bold text-[#1e293b]">{users.suspendus}</span>
              </div>
            </div>
          </div>

          {/* Inscriptions récentes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-[#008282] text-lg" />
              <h3 className="text-sm font-bold text-[#1e293b]">Inscriptions récentes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Cette semaine</span>
                <span className="text-xs font-bold text-teal-600">+{users.inscrits_7j}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Ce mois</span>
                <span className="text-xs font-bold text-teal-600">+{users.inscrits_30j}</span>
              </div>
            </div>
          </div>

          {/* Distribution des notes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaStar className="text-[#008282] text-lg" />
              <h3 className="text-sm font-bold text-[#1e293b]">Distribution des notes</h3>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((n) => {
                const maxVal = Math.max(evaluations.notes_5, evaluations.notes_4, evaluations.notes_3, evaluations.notes_2, evaluations.notes_1, 1);
                const pct = (evaluations[`notes_${n}`] / maxVal) * 100;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-500 w-3">{n}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium w-5 text-right">{evaluations[`notes_${n}`]}</span>
                  </div>
                );
              })}
            </div>
          </div>



        </div>

      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-0.5 text-[#008282]">
            <FaChartBar className="text-lg" />
            <span className="text-[10px] font-bold">Tableau de bord</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400">
            <FaHome className="text-lg" />
            <span className="text-[10px] font-medium">Hébergements</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400">
            <FaBookOpen className="text-lg" />
            <span className="text-[10px] font-medium">Cours</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400">
            <FaCog className="text-lg" />
            <span className="text-[10px] font-medium">Paramètres</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
