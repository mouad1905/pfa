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
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadStats();
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
  const users = stats.utilisateurs || { total: 0, etudiants: 0, professeurs: 0, proprietaires: 0 };
  const annonces = stats.annonces || { hebergements_valides: 0, hebergements_en_attente: 0, cours_valides: 0, cours_en_attente: 0 };
  const reservations = stats.reservations || { total: 0, en_attente: 0, confirmees: 0 };
  const finances = stats.finances || { total_transactions: 0, chiffre_affaires: 0 };

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
              <span className="text-teal-600 font-bold">{users.etudiants}</span> étudiants · <span className="text-blue-600 font-bold">{users.professeurs}</span> profs
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
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 text-emerald-600 font-bold">
              <FaArrowUp size={10} /> {finances.total_transactions} Transactions payées
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
            <FaCoins size={22} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-6">
          <h3 className="font-bold text-slate-800 text-lg">Activités & Réservations</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Réservations</div>
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
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-700">Audit des validations requises</h4>
            
            <div className="space-y-3">
              {/* Accommodation validation */}
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

              {/* Courses validation */}
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
            </div>
          </div>

        </div>

        {/* Security & System Info */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
              <FaShieldAlt className="text-teal-600" />
              <h3>Sécurité & Activité</h3>
            </div>
            
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <FaCheckCircle /> Système sécurisé
              </div>
              <p className="leading-relaxed">
                Toutes les connexions utilisateur utilisent des jetons chiffrés Sanctum. Les documents de vérification d'identité sont stockés de manière sécurisée.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Statut de la base de données</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connecté (Postgres)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Version du serveur</span>
                <span className="text-slate-700 font-bold">Laravel 11 (PHP 8.2)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Session Admin actuelle</span>
                <span className="text-teal-600 font-bold uppercase tracking-wider">Actif</span>
              </div>
            </div>
          </div>

          <button 
            onClick={loadStats}
            className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <FaClock /> Actualiser les statistiques
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
