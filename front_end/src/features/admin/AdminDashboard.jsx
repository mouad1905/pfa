import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import { 
  FaUsers, 
  FaHome, 
  FaBookOpen, 
  FaRegCalendarCheck, 
  FaCoins, 
  FaClock, 
  FaSpinner, 
  FaCheckCircle, 
  FaArrowUp,
  FaShieldAlt
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData(`${API_BASE_URL}/admin/statistiques`);
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      setError("Impossible de charger les statistiques depuis la base de données.");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentReservations = async () => {
    try {
      setReservationsLoading(true);
      const data = await fetchData(`${API_BASE_URL}/admin/reservations`);
      setRecentReservations(data.data || data || []);
    } catch (err) {
      console.error("Error fetching recent reservations:", err);
      setRecentReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadRecentReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-slate-100">
        <FaSpinner className="animate-spin text-teal-600 text-5xl mb-4" />
        <p className="text-slate-500 font-semibold tracking-wide">Calcul des statistiques de la plateforme...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 p-8 rounded-3xl text-center shadow-sm">
        <p className="font-bold text-lg mb-2">Une erreur est survenue</p>
        <p className="text-slate-500 text-sm mb-4">{error}</p>
        <button 
          onClick={loadStats} 
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold transition cursor-pointer shadow-md"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Extract counts for readability
  const users = stats.utilisateurs || { total: 0, etudiants: 0, professeurs: 0, proprietaires: 0, locateurs: 0, admins: 0, suspendus: 0, en_attente: 0, actifs: 0, inscrits_7j: 0, inscrits_30j: 0 };
  const annonces = stats.annonces || { hebergements_valides: 0, hebergements_en_attente: 0, hebergements_rejetes: 0, cours_valides: 0, cours_en_attente: 0, cours_rejetes: 0 };
  const reservations = stats.reservations || { total: 0, en_attente: 0, confirmees: 0, annulees: 0 };
  const finances = stats.finances || { total_transactions: 0, chiffre_affaires: 0, reussi: 0, echoue: 0 };
  const signalements = stats.signalements || { total: 0, en_attente: 0, traites: 0, rejetes: 0 };
  const reclamations = stats.reclamations || { total: 0, en_attente: 0, traitees: 0, rejetees: 0 };
  const evaluations = stats.evaluations || { total: 0, moyenne_generale: 0, notes_5: 0, notes_4: 0, notes_3: 0, notes_2: 0, notes_1: 0 };
  const matieres = stats.matieres || { total: 0 };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Vue d'ensemble</h1>
        <p className="text-slate-500 text-sm mt-1">Consultez l'activité en temps réel de votre plateforme UniConnect.</p>
      </div>

      {/* Grid of Key Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Users */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between hover:shadow-md transition duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisateurs</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{users.total}</h3>
            <p className="text-xs text-slate-500 font-medium">
              <span className="text-teal-600 font-bold">{users.etudiants}</span> étudiants · <span className="text-blue-600 font-bold">{users.professeurs}</span> profs · <span className="text-amber-600 font-bold">{users.proprietaires + users.locateurs}</span> proprio.
            </p>
            <p className="text-xs text-slate-400 font-medium">
              +{users.inscrits_7j} cette semaine · +{users.inscrits_30j} ce mois
            </p>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shadow-xs">
            <FaUsers size={22} />
          </div>
        </div>

        {/* Card 2: Accommodations */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between hover:shadow-md transition duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hébergements</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{annonces.hebergements_valides + annonces.hebergements_en_attente}</h3>
            <p className="text-xs text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">{annonces.hebergements_valides}</span> validés · <span className="text-amber-500 font-bold">{annonces.hebergements_en_attente}</span> en attente
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-xs">
            <FaHome size={22} />
          </div>
        </div>

        {/* Card 3: Support Courses */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between hover:shadow-md transition duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cours de Soutien</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{annonces.cours_valides + annonces.cours_en_attente}</h3>
            <p className="text-xs text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">{annonces.cours_valides}</span> validés · <span className="text-amber-500 font-bold">{annonces.cours_en_attente}</span> en attente
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shadow-xs">
            <FaBookOpen size={22} />
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between hover:shadow-md transition duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{Number(finances.chiffre_affaires).toLocaleString('fr-FR')} DH</h3>
            <p className="text-xs  font-medium flex items-center gap-1 text-emerald-600 ">
              <FaArrowUp size={10} /> {finances.total_transactions} Transactions payées
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
            <FaCoins size={22} />
          </div>
        </div>

      </div>

      {/* Row 2: New stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 5: Signalements */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signalements</span>
            <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <FaFlag size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">{signalements.total}</h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
            {signalements.en_attente > 0 ? (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {signalements.en_attente} en attente
              </span>
            ) : null}
            <span className="text-emerald-600">{signalements.traites} traités</span>
            <span className="text-slate-400">{signalements.rejetes} rejetés</span>
          </div>
        </div>

        {/* Card 6: Réclamations */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Réclamations</span>
            <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <FaFileAlt size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">{reclamations.total}</h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
            {reclamations.en_attente > 0 ? (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {reclamations.en_attente} en attente
              </span>
            ) : null}
            <span className="text-emerald-600">{reclamations.traitees} traitées</span>
            <span className="text-slate-400">{reclamations.rejetees} rejetées</span>
          </div>
        </div>

        {/* Card 7: Évaluations */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Évaluations</span>
            <div className="w-9 h-9 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
              <FaStar size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">{evaluations.total}</h3>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium">
            <span className="text-amber-600 font-bold text-sm">{evaluations.moyenne_generale}</span>
            <span className="text-slate-400">/ 5 de moyenne</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
            {[5,4,3,2,1].map(n => (
              <span key={n} className="flex items-center gap-0.5">
                <FaStar size={10} className="text-yellow-400" />{n}:{evaluations[`notes_${n}`]}
                {n > 1 && <span className="mx-0.5">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Card 8: Matières */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matières</span>
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <FaBookmark size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">{matieres.total}</h3>
          <p className="mt-2 text-xs text-slate-400 font-medium">matières académiques proposées</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activités & Réservations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-6">
          <h3 className="font-bold text-slate-800 text-lg">Activités & Réservations</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{reservations.total}</div>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center">
              <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Confirmées</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">{reservations.confirmees}</div>
            </div>
            <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-center">
              <div className="text-amber-600 text-xs font-semibold uppercase tracking-wider">En attente</div>
              <div className="text-2xl font-black text-amber-800 mt-1">{reservations.en_attente}</div>
            </div>
            <div className="p-4 bg-rose-50 text-rose-800 rounded-xl text-center">
              <div className="text-rose-600 text-xs font-semibold uppercase tracking-wider">Annulées</div>
              <div className="text-2xl font-black text-rose-800 mt-1">{reservations.annulees}</div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-700">Audit des validations requises</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <FaHome size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Hébergements en attente</h5>
                    <p className="text-xs text-slate-400">Annonces nécessitant une validation physique</p>
                  </div>
                </div>
                {annonces.hebergements_en_attente > 0 ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                    {annonces.hebergements_en_attente} À VALIDER
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                    <FaCheckCircle size={10} /> À jour
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center">
                    <FaBookOpen size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Cours de soutien en attente</h5>
                    <p className="text-xs text-slate-400">Offres de révision nécessitant une validation</p>
                  </div>
                </div>
                {annonces.cours_en_attente > 0 ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                    {annonces.cours_en_attente} À VALIDER
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                    <FaCheckCircle size={10} /> À jour
                  </span>
                )}
              </div>

              {/* Signalements pending */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                    <FaFlag size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Signalements</h5>
                    <p className="text-xs text-slate-400">{signalements.traites} traités · {signalements.rejetes} rejetés</p>
                  </div>
                </div>
                {signalements.en_attente > 0 ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                    {signalements.en_attente} À TRAITER
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                    <FaCheckCircle size={10} /> Aucun en attente
                  </span>
                )}
              </div>

              {/* Reclamations pending */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-sm">Réclamations</h5>
                    <p className="text-xs text-slate-400">{reclamations.traitees} traitées · {reclamations.rejetees} rejetées</p>
                  </div>
                </div>
                {reclamations.en_attente > 0 ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                    {reclamations.en_attente} À TRAITER
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                    <FaCheckCircle size={10} /> Aucune en attente
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Activity Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <FaChartBar className="text-teal-600" />
            <h3>Répartition & Activité</h3>
          </div>

          {/* Utilisateurs breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Statut des comptes</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FaUserCheck className="text-emerald-500" size={12} /> Actifs
                </span>
                <span className="font-bold text-slate-800">{users.actifs}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FaClock className="text-amber-500" size={12} /> En attente
                </span>
                <span className="font-bold text-slate-800">{users.en_attente}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FaBan className="text-rose-500" size={12} /> Suspendus
                </span>
                <span className="font-bold text-slate-800">{users.suspendus}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Paiements</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-500" size={12} /> Réussis
                </span>
                <span className="font-bold text-slate-800">{finances.reussi}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FaTimesCircle className="text-rose-500" size={12} /> Échoués
                </span>
                <span className="font-bold text-slate-800">{finances.echoue}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inscriptions récentes</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Cette semaine (7j)</span>
                <span className="font-bold text-teal-600">+{users.inscrits_7j}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Ce mois (30j)</span>
                <span className="font-bold text-teal-600">+{users.inscrits_30j}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Distribution des notes</h4>
            <div className="space-y-1.5">
              {[5,4,3,2,1].map(n => {
                const maxVal = Math.max(evaluations.notes_5, evaluations.notes_4, evaluations.notes_3, evaluations.notes_2, evaluations.notes_1, 1);
                const pct = (evaluations[`notes_${n}`] / maxVal) * 100;
                return (
                  <div key={n} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-yellow-500 font-bold">{n}★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right text-slate-500 font-medium">{evaluations[`notes_${n}`]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={loadStats}
            className="w-full mt-2 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <FaClock /> Actualiser les statistiques
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
