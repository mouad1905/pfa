import React, { useState, useEffect } from "react";
import { FaPlus, FaBook, FaHome, FaEye, FaClock, FaCheckCircle } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchData, API_URLS } from "../api/api";
import LocateurDashboard from "./LocateurDashboard";

function ProfessorDashboard({ user }) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, actives: 0, pending: 0, validated: 0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchData(API_URLS.MES_COURS);
        const list = (result.data || []).map((item) => ({
          id: item.id_cours,
          title: item.matiere,
          price: `${item.prix} ${item.type_prix || "DH/h"}`,
          level: item.niveau_etude,
          statut: item.statut,
          active: item.actif !== false,
        }));
        setPublications(list);
        setStats({
          total: list.length,
          actives: list.filter((p) => p.active).length,
          pending: list.filter((p) => p.statut === "en_attente").length,
          validated: list.filter((p) => p.statut === "valide").length,
        });
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger vos cours.", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-[#f8f9ff] pt-24 pb-12 min-h-screen font-poppins">
      <main className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                Tableau de bord Professeur
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Bonjour, {user.prenom}</h1>
              <p className="text-sm opacity-90 mt-2">Gérez vos cours de révision sur UniConnect.</p>
            </div>
            <Link
              to="/revisions"
              className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-5 py-3 rounded-2xl text-sm font-bold transition w-full md:w-auto"
            >
              <FaPlus /> Voir les cours
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total cours", value: stats.total, icon: FaBook },
            { label: "Actifs", value: stats.actives, icon: FaEye },
            { label: "En validation", value: stats.pending, icon: FaClock },
            { label: "Validés", value: stats.validated, icon: FaCheckCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <Icon className="text-blue-500 mb-2 w-5 h-5" />
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-100 text-left">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Mes cours publiés</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : publications.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Aucun cours publié.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-800">{pub.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {pub.price} · {pub.level}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-slate-50 text-slate-600">
                    {pub.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const loggedInUser = React.useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );

  if (!loggedInUser) return <Navigate to="/login" replace />;

  const isProf = loggedInUser.role === "professeur";
  const isLoc =
    loggedInUser.role === "locateur" || loggedInUser.role === "proprietaire";

  if (!isProf && !isLoc) {
    return (
      <div className="bg-[#f8f9ff] pt-24 pb-12 min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-400 font-semibold text-center">
          Seuls les professeurs ou locateurs peuvent accéder au tableau de bord.
        </p>
      </div>
    );
  }

  if (isLoc) {
    return <LocateurDashboard user={loggedInUser} />;
  }

  return <ProfessorDashboard user={loggedInUser} />;
}
