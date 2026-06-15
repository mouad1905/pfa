import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchData, API_URLS } from "../../api/api";

const Icon = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  if (diff < 172800000) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const listingStatus = (pub) => {
  if (pub.statut === "en_attente") {
    return { label: "En attente", className: "bg-[#a43a3a]/10 text-[#a43a3a]" };
  }
  if (pub.active && pub.statut === "valide") {
    return { label: "Actif", className: "bg-[#006c49]/10 text-[#006c49]" };
  }
  return { label: "Inactif", className: "bg-slate-100 text-slate-500" };
};

const candidatureStatus = (statut) => {
  if (statut === "confirmee") {
    return { label: "Accepté", className: "bg-[#006c49]/10 text-[#006c49]" };
  }
  if (statut === "annulee") {
    return { label: "Refusé", className: "bg-red-50 text-red-600" };
  }
  return { label: "En attente", className: "bg-[#a43a3a]/10 text-[#a43a3a]" };
};

export default function LocateurDashboard({ user }) {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vues: 0,
    favoris: 0,
    messages: 0,
    candidatures: 0,
    vuesTrend: "+12%",
    favorisTrend: "+5%",
    messagesTrend: "-2%",
    candidaturesTrend: "+24%",
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hebRes, resRes] = await Promise.all([
        fetchData(API_URLS.MES_HEBERGEMENTS),
        fetchData(API_URLS.MES_RESERVATIONS).catch(() => ({ data: [] })),
      ]);

      const hebList = (hebRes.data || []).map((item) => ({
        id: item.id_hebergement,
        title: item.titre || `${item.type} - ${item.localisation}`,
        location: item.localisation,
        prix: parseFloat(item.prix) || 0,
        image:
          item.image ||
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
        statut: item.statut,
        active: item.actif !== false,
        capacity: item.nb_locataires || item.nbr_chambres || 1,
        spots: Math.max(1, (item.nbr_chambres || 1) - 1),
      }));

      const resList = (resRes.data || []).map((r) => ({
        id: r.id_reservation,
        statut: r.statut,
        dateDebut: r.date_debut,
        listingTitle:
          r.hebergement?.titre ||
          r.hebergement?.localisation ||
          "Logement",
        listingLocation: r.hebergement?.localisation || "",
        etudiant: r.etudiant,
        createdAt: r.created_at,
      }));

      let msgList = resList.map((r) => ({
        id: `msg-${r.id}`,
        name: r.etudiant
          ? `${r.etudiant.prenom || ""} ${r.etudiant.nom || ""}`.trim() || "Étudiant"
          : "Étudiant",
        time: formatTime(r.createdAt),
        listing: r.listingTitle,
        preview:
          r.statut === "en_attente"
            ? `Demande de colocation — entrée ${r.dateDebut || "à définir"}`
            : `Mise à jour de la candidature (${r.statut})`,
        avatar: `https://i.pravatar.cc/150?u=${r.etudiant?.id_user || r.id}`,
        unread: r.statut === "en_attente",
      }));

      if (msgList.length === 0) {
        msgList.push(
          {
            id: "demo-1",
            name: "Amine B.",
            time: "14:20",
            listing: "Colocation Rabat Agdal",
            preview: "Est-ce que la chambre est disponible dès septembre ?",
            avatar: "https://i.pravatar.cc/150?u=amine",
            unread: true,
          },
          {
            id: "demo-2",
            name: "Leila M.",
            time: "Hier",
            listing: "Studio Casablanca",
            preview: "Bonjour, j'aimerais planifier une visite virtuelle...",
            avatar: "https://i.pravatar.cc/150?u=leila",
            unread: true,
          }
        );
      }

      const activeCount = hebList.filter((a) => a.active && a.statut === "valide").length;
      const pendingCand = resList.filter((r) => r.statut === "en_attente").length;
      const newMsg = msgList.filter((m) => m.unread).length;

      setAnnonces(hebList);
      setCandidatures(resList);
      setMessages(msgList);
      setStats({
        vues: activeCount * 420 + hebList.length * 180,
        favoris: Math.max(hebList.length * 12, newMsg * 3),
        messages: msgList.length,
        candidatures: resList.length,
        vuesTrend: "+12%",
        favorisTrend: "+5%",
        messagesTrend: newMsg > 0 ? `+${newMsg}` : "0",
        candidaturesTrend: pendingCand > 0 ? `+${pendingCand}` : "0",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Impossible de charger le tableau de bord.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (annonce) => {
    try {
      await fetchData(`${API_URLS.HEBERGEMENTS}/${annonce.id}/publication`, {
        method: "PUT",
        body: JSON.stringify({ actif: !annonce.active }),
      });
      setAnnonces((prev) =>
        prev.map((a) => (a.id === annonce.id ? { ...a, active: !a.active } : a))
      );
      Swal.fire({
        icon: "success",
        title: annonce.active ? "Annonce mise en pause" : "Annonce activée",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    }
  };

  const handleCandidatureStatut = async (id, statut) => {
    try {
      await fetchData(API_URLS.reservationStatut(id), {
        method: "PUT",
        body: JSON.stringify({ statut }),
      });
      await loadData();
      Swal.fire({
        icon: "success",
        title: statut === "confirmee" ? "Candidature acceptée" : "Candidature refusée",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    }
  };

  const statCards = [
    { icon: "visibility", label: "Vues", value: stats.vues.toLocaleString("fr-FR"), trend: stats.vuesTrend, up: true },
    { icon: "favorite", label: "Favoris", value: stats.favoris, trend: stats.favorisTrend, up: true },
    { icon: "chat_bubble", label: "Messages", value: stats.messages, trend: stats.messagesTrend, up: false },
    { icon: "assignment_ind", label: "Candidatures", value: stats.candidatures, trend: stats.candidaturesTrend, up: true },
  ];

  const newMessagesCount = messages.filter((m) => m.unread).length;

  return (
    <div
      className="min-h-screen pt-24 pb-12 text-[#0b1c30] font-[Inter,sans-serif]"
      style={{ background: "#f8f9ff" }}
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tableau de bord Propriétaire
            </h1>
            <p className="text-sm sm:text-base text-[#3c4a42] mt-1">
              Bonjour {user?.prenom}, gérez vos biens et interagissez avec les étudiants.
            </p>
          </div>
          <Link
            to="/addHouse"
            className="bg-[#006c49] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.04)] w-full md:w-auto"
          >
            <Icon name="add_circle" className="text-[18px]" />
            Créer une annonce
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white p-4 sm:p-5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[#bbcabf]/30"
            >
              <div className="flex justify-between items-start mb-2">
                <Icon
                  name={s.icon}
                  className="text-[#006c49] p-2 bg-[#adedd3]/30 rounded-lg text-xl"
                />
                <span
                  className={`font-bold text-xs ${s.up ? "text-[#006c49]" : "text-[#ba1a1a]"}`}
                >
                  {s.trend}
                </span>
              </div>
              <p className="text-xs text-[#3c4a42] font-medium">{s.label}</p>
              <h3 className="text-xl sm:text-2xl font-semibold mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Mes Annonces */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Mes Annonces</h2>
            <button
              type="button"
              onClick={() => navigate("/colocations")}
              className="text-[#006c49] text-sm font-medium hover:underline"
            >
              Voir tout
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-[#006c49] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : annonces.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-[#bbcabf]/30">
              <p className="text-[#3c4a42] mb-4">Aucune annonce pour le moment.</p>
              <Link
                to="/addHouse"
                className="inline-flex items-center gap-2 bg-[#006c49] text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Icon name="add_circle" className="text-[18px]" />
                Créer une annonce
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {annonces.map((annonce) => {
                const st = listingStatus(annonce);
                return (
                  <div
                    key={annonce.id}
                    className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[#bbcabf]/30 flex flex-col sm:flex-row group"
                  >
                    <div className="sm:w-1/3 h-40 sm:h-auto relative overflow-hidden shrink-0">
                      <img
                        src={annonce.image}
                        alt={annonce.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="sm:w-2/3 p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className={`font-medium px-2 py-0.5 rounded text-xs ${st.className}`}>
                            {st.label}
                          </span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              title="Modifier"
                              onClick={() => Swal.fire("Info", "Édition bientôt disponible.", "info")}
                              className="text-[#3c4a42] hover:text-[#006c49] cursor-pointer border-none bg-transparent p-0"
                            >
                              <Icon name="edit" className="text-[18px]" />
                            </button>
                            <button
                              type="button"
                              title="Voir l'annonce"
                              onClick={() => navigate(`/home/${annonce.id}`)}
                              className="text-[#3c4a42] hover:text-[#006c49] cursor-pointer border-none bg-transparent p-0"
                            >
                              <Icon name="visibility" className="text-[18px]" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-bold mt-2 text-base line-clamp-2">{annonce.title}</h4>
                        <div className="flex items-center gap-1 text-[#3c4a42] text-xs mt-1">
                          <Icon name="location_on" className="text-[16px]" />
                          <span className="truncate">{annonce.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap justify-between items-end gap-3">
                        <div>
                          <p className="text-[#006c49] text-xl font-semibold">
                            {annonce.prix.toLocaleString("fr-FR")}{" "}
                            <span className="text-xs text-[#3c4a42] font-normal">DH/mois</span>
                          </p>
                          <p className="text-xs text-[#3c4a42]">
                            Capacité: {annonce.spots}/{annonce.capacity} spots
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(annonce)}
                            title={annonce.active ? "Mettre en pause" : "Activer"}
                            className="p-1.5 rounded-lg border border-[#bbcabf] hover:bg-[#eff4ff] transition-colors text-[#3c4a42] cursor-pointer bg-white"
                          >
                            <Icon
                              name={annonce.active ? "pause" : "play_arrow"}
                              className="text-[20px]"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              Swal.fire(
                                "Suppression",
                                "Contactez le support pour supprimer une annonce validée.",
                                "info"
                              )
                            }
                            className="p-1.5 rounded-lg border border-[#bbcabf] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors text-[#3c4a42] cursor-pointer bg-white"
                          >
                            <Icon name="delete" className="text-[20px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Messages & Candidatures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Messages */}
          <section className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[#bbcabf]/30 flex flex-col min-h-[320px]">
            <div className="p-4 sm:p-5 border-b border-[#bbcabf]/30 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Messages</h2>
              {newMessagesCount > 0 && (
                <span className="bg-[#006c49] text-white text-xs px-3 py-0.5 rounded-full font-medium">
                  {newMessagesCount} Nouveau{newMessagesCount > 1 ? "x" : ""}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#bbcabf] [&::-webkit-scrollbar-thumb]:rounded-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 sm:p-5 hover:bg-[#eff4ff] transition-colors cursor-pointer border-b border-[#bbcabf]/20"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={msg.avatar}
                      alt=""
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#bbcabf] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-bold truncate">{msg.name}</p>
                        <span className="text-xs text-[#3c4a42] shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-xs text-[#006c49] font-medium truncate">{msg.listing}</p>
                      <p className="text-xs text-[#3c4a42] mt-1 line-clamp-2">{msg.preview}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        Swal.fire("Messagerie", "La messagerie intégrée arrive bientôt.", "info")
                      }
                      className="text-[#006c49] text-sm font-medium border border-[#006c49] px-4 py-1 rounded-lg hover:bg-[#006c49]/10 transition-colors cursor-pointer bg-white"
                    >
                      Répondre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Candidatures */}
          <section className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[#bbcabf]/30 flex flex-col min-h-[320px]">
            <div className="p-4 sm:p-5 border-b border-[#bbcabf]/30 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Candidatures</h2>
              <span className="text-[#006c49] text-sm font-medium">
                {candidatures.filter((c) => c.statut === "en_attente").length} en attente
              </span>
            </div>
            <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#bbcabf] [&::-webkit-scrollbar-thumb]:rounded-full">
              {candidatures.length === 0 ? (
                <p className="text-sm text-[#3c4a42] text-center py-8">
                  Aucune candidature pour le moment.
                </p>
              ) : (
                candidatures.map((c) => {
                  const st = candidatureStatus(c.statut);
                  const name = c.etudiant
                    ? `${c.etudiant.prenom || ""} ${c.etudiant.nom || ""}`.trim()
                    : "Étudiant";
                  const isPending = c.statut === "en_attente";
                  const isAccepted = c.statut === "confirmee";

                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-[#f8f9ff] border border-[#bbcabf]/40 hover:border-[#006c49] transition-colors"
                    >
                      <div className="flex justify-between mb-3 sm:mb-4 gap-2">
                        <div className="flex gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-[#adedd3] flex items-center justify-center shrink-0">
                            <Icon name="person" className="text-[#006c49]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">{name || "Étudiant"}</p>
                            <p className="text-xs text-[#3c4a42] truncate">
                              {c.etudiant?.email || "Candidature colocation"}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium px-2 py-0.5 h-fit rounded text-xs shrink-0 ${st.className}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-[#3c4a42] bg-[#eff4ff] p-3 rounded-lg">
                        <p>
                          <span className="font-medium text-[#0b1c30]">Logement:</span>{" "}
                          {c.listingTitle}
                        </p>
                        <p>
                          <span className="font-medium text-[#0b1c30]">Entrée:</span>{" "}
                          {c.dateDebut
                            ? new Date(c.dateDebut).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "À définir"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCandidatureStatut(c.id, "confirmee")}
                              className="flex-1 min-w-[100px] bg-[#006c49] text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
                            >
                              Accepter
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCandidatureStatut(c.id, "annulee")}
                              className="flex-1 min-w-[100px] border border-[#bbcabf] text-[#3c4a42] py-2 rounded-lg text-sm font-semibold hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all cursor-pointer bg-white"
                            >
                              Refuser
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex-1 border border-[#bbcabf] text-[#3c4a42] py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed bg-white"
                          >
                            {isAccepted ? "Finalisé" : "Clôturé"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            Swal.fire("Contact", `Contacter ${name}`, "info")
                          }
                          className="w-10 flex items-center justify-center border border-[#bbcabf] rounded-lg hover:bg-[#eff4ff] transition-all bg-white cursor-pointer"
                        >
                          <Icon name={isAccepted ? "chat" : "mail"} className="text-[20px] text-[#3c4a42]" />
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
    </div>
  );
}
