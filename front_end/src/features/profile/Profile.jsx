import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS, fetchData } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUsers,
  FaFolderOpen,
  FaCommentDots,
  FaCog,
  FaCheckCircle,
  FaPen,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaUserEdit,
  FaUserCircle,
  FaExclamationTriangle,
  FaMagic,
  FaChartLine,
  FaComments,
  FaComment,
} from "react-icons/fa";

function bustCache(url, t) {
  if (!url) return null;
  try {
    const u = new URL(url);
    u.searchParams.set("t", t || Date.now());
    return u.toString();
  } catch {
    return url;
  }
}

function avatarFallback(prenom, nom, size = 160) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    (prenom || "U") + " " + (nom || ""),
  )}&background=006b53&color=fff&size=${size}&bold=true`;
}

function StarRating({ value = 0, size = 18 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          className={
            star <= Math.round(value) ? "text-[#006b53]" : "text-[#e1e3e4]"
          }
        />
      ))}
    </div>
  );
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: loggedInUser } = useContext(AuthContext);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [userResourcesCount, setUserResourcesCount] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const url = id
          ? `http://127.0.0.1:8000/api/users/${id}`
          : API_URLS.USER;
        const data = await fetchData(url);
        setUser(data.data || data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  useEffect(() => {
    if (!user?.id_user) return;
    const fetchCounts = async () => {
      try {
        const [convRes, courseRes] = await Promise.allSettled([
          fetchData(API_URLS.CONVERSATIONS),
          fetchData(API_URLS.MES_COURS),
        ]);
        if (convRes.status === "fulfilled") {
          const data = convRes.value;
          setConversationsCount(
            Array.isArray(data)
              ? data.length
              : data.data
                ? data.data.length
                : 0,
          );
        }
        if (courseRes.status === "fulfilled") {
          const data = courseRes.value;
          setUserResourcesCount(
            Array.isArray(data)
              ? data.length
              : data.data
                ? data.data.length
                : 0,
          );
        }
      } catch {}
    };
    fetchCounts();
  }, [user?.id_user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="w-12 h-12 border-4 border-[#006b53] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#4f606f] text-sm mt-4 font-semibold">
          Chargement du profil...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa]">
        <p className="text-red-500 font-bold text-lg">Profil introuvable</p>
        <p className="text-[#4f606f] text-sm mt-1">
          L'utilisateur demandé n'existe pas ou a été suspendu.
        </p>
      </div>
    );
  }

  const isOwnProfile =
    !id || (loggedInUser && loggedInUser.id_user === user.id_user);

  const reviewsList =
    user.evaluations && user.evaluations.length > 0 ? user.evaluations : [];

  const evaluationsCount =
    user.evaluations_count !== undefined && user.evaluations_count !== null
      ? user.evaluations_count
      : reviewsList.length;

  const avgRating = Number(
    user.avg_rating ||
      (reviewsList.length > 0
        ? reviewsList.reduce((acc, curr) => acc + curr.note, 0) /
          reviewsList.length
        : 0),
  );

  const resourcesCount = userResourcesCount;
  const discussionsCount = conversationsCount;

  const about = user.about && user.about.trim() ? user.about : null;

  const tags =
    user.tags && user.tags.length > 0
      ? user.tags
      : ["Informatique", "Fès", "EMSI"];

  const sidebarLinks = [
    { icon: <FaComment size={18} />, label: "Messages", path: "/chat" },
    { icon: <FaUsers size={18} />, label: "Communautés", path: "/colocations" },
    {
      icon: <FaFolderOpen size={18} />,
      label: "Ressources",
      path: "/revisions",
    },
    { icon: <FaCog size={18} />, label: "Paramètres", path: "/settings" },
  ];

  const handleEditProfile = () => navigate("/settings");

  const handleReport = () => {
    Swal.fire({
      title: "Signaler un problème",
      input: "textarea",
      inputPlaceholder: "Décrivez le problème rencontré...",
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      confirmButtonColor: "#006b53",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetchData(`http://127.0.0.1:8000/api/signalements`, {
            method: "POST",
            body: JSON.stringify({
              id_cible: user.id_user,
              raison: "Problème de profil",
              details: result.value,
            }),
          });
          Swal.fire(
            "Signalement envoyé",
            "L'administration a été notifiée.",
            "success",
          );
        } catch (err) {
          Swal.fire(
            "Erreur",
            err.message || "Impossible de soumettre le signalement.",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen mt-6 bg-[#f8f9fa] text-[#191c1d] font-['Inter',sans-serif] pt-20">
      {/* ============ LEFT SIDEBAR ============ */}
      <aside className="h-[calc(100vh-100px)] w-[300px] sticky left-0 top-20 bg-[#f8f9fa] shadow-sm flex-col p-4 border-r border-[#bccac2] hidden md:flex z-40">
        <div className="mb-8 px-2">
          <h1 className="font-bold text-2xl text-[#006b53] tracking-tight">
            Academic Portal
          </h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-4 w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#d0e2f3] text-[#546573] font-semibold"
                    : "text-[#4f606f] hover:bg-[#e7e8e9]"
                }`}
              >
                {link.icon}
                <span className="text-base">{link.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-2 border-t border-[#bccac2]">
          <div className="flex items-center gap-4 p-2 rounded-lg bg-[#f3f4f5]">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={
                bustCache(user.photo_profil, user.updated_at) ||
                avatarFallback(user.prenom, user.nom, 40)
              }
              alt={user.prenom}
              onError={(e) => {
                e.target.src = avatarFallback(user.prenom, user.nom, 40);
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-bold">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-[#4f606f] truncate">
                {user.niveau_etude ? `${user.niveau_etude} - ` : ""}
                {user.role || ""}
              </p>
            </div>
          </div>
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/settings")}
              className="mt-2 w-full py-2 px-4 rounded-full bg-[#00a884] text-white text-sm font-medium hover:bg-[#006b53] transition-colors cursor-pointer border-none"
            >
              Modifier le profil
            </button>
          ) : (
            loggedInUser && (
              <button
                onClick={async () => {
                  try {
                    Swal.showLoading();
                    const response = await fetchData(API_URLS.CONVERSATIONS, {
                      method: "POST",
                      body: JSON.stringify({ id_destinataire: user.id_user }),
                    });
                    Swal.close();
                    const conversationId =
                      response.id_conversation ||
                      response.data?.id_conversation;
                    navigate(`/chat/${conversationId}`);
                  } catch (err) {
                    Swal.fire(
                      "Erreur",
                      err.message || "Impossible d'ouvrir la conversation.",
                      "error",
                    );
                  }
                }}
                className="mt-2 w-full py-2 px-4 rounded-full bg-[#00a884] text-white text-sm font-medium hover:bg-[#006b53] transition-colors cursor-pointer border-none flex items-center justify-center gap-2"
              >
                Envoyer un message
              </button>
            )
          )}
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] overflow-x-hidden">
        <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
          {/* ===== PROFILE HEADER CARD ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 bg-white rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.05)] ">
              <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-[#006b53]/10 text-[#006b53] text-xs font-semibold border border-[#006b53]/20">
                  <FaCheckCircle size={14} />
                  {user.role ? `${user.role.toUpperCase()}` : "UTILISATEUR"}
                </span>
              </div>

              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#edeeef] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      bustCache(user.photo_profil, user.updated_at) ||
                      avatarFallback(user.prenom, user.nom, 160)
                    }
                    alt={user.prenom}
                    onError={(e) => {
                      e.target.src = avatarFallback(user.prenom, user.nom, 160);
                    }}
                  />
                </div>
                {isOwnProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-1 right-1 bg-[#006b53] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <FaPen size={12} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left pt-2">
                <h2 className="text-3xl font-bold text-[#191c1d] tracking-tight">
                  {user.prenom} {user.nom}
                </h2>
                <p className="text-[#4f606f] text-lg mb-4">{user.email}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  <span className="px-4 py-1 bg-[#d0e2f3] text-[#546573] rounded-full text-xs font-semibold">
                    {user.role ? user.role.toUpperCase() : "UTILISATEUR"}
                  </span>
                  {user.niveau_etude && (
                    <span className="px-4 py-1 bg-[#59dcb5] text-[#003427] rounded-full text-xs font-semibold">
                      {user.niveau_etude}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#6c7a74] uppercase tracking-wider">
                      Informations de contact
                    </p>
                    <div className="flex items-center gap-2 text-[#4f606f]">
                      <FaEnvelope className="text-[#006b53]" size={16} />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-[#4f606f]">
                      <FaPhone className="text-[#006b53]" size={14} />
                      {user.telephone || "Non renseigné"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#6c7a74] uppercase tracking-wider">
                      Détails Académiques
                    </p>
                    <div className="flex items-center gap-2 text-[#4f606f]">
                      <FaGraduationCap className="text-[#006b53]" size={16} />
                      Niveau: {user.niveau_etude || "Non renseigné"}
                    </div>
                    <div className="flex items-center gap-2 text-[#4f606f]">
                      <FaUserEdit className="text-[#006b53]" size={14} />
                      Rôle: {user.role || "Non renseigné"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-15 items-center justify-center md:border-l border-[#bccac2] md:pl-8 min-w-[150px]">
                <p className="text-2xl font-bold text-[#191c1d]">
                  {avgRating.toFixed(1)}
                </p>
                <StarRating value={avgRating} size={20} />
                <p className="text-xs text-[#4f606f] mt-1">
                  ({evaluationsCount} évaluations)
                </p>
              </div>
            </div>
          </section>

          {/* ===== BENTO GRID ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Me */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 flex flex-col h-full shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#006b53]/10 flex items-center justify-center text-[#006b53]">
                  <FaUserCircle size={20} />
                </div>
                <h3 className="text-xl font-semibold text-[#191c1d]">
                  À propos de moi
                </h3>
              </div>

              {about ? (
                <div className="flex-1 bg-[#f3f4f5] rounded-lg p-4 border border-[#bccac2]/30">
                  <p className="text-base text-[#3d4a44] leading-relaxed italic">
                    "{about}"
                  </p>
                </div>
              ) : (
                <div className="flex-1 bg-[#f3f4f5] rounded-lg p-4 border border-dashed border-[#bccac2]/50 flex items-center justify-center">
                  <p className="text-sm text-[#6c7a74]">Aucune description.</p>
                </div>
              )}
            </div>

            {/* Activity Stats */}
            <div className="bg-[#006b53] text-white rounded-xl p-6 flex flex-col justify-between overflow-hidden relative shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <FaMagic size={180} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest opacity-80 mb-2">
                  Statistiques d'Activité
                </p>
                <h3 className="text-xl font-semibold mb-6">
                  Engagement Académique
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-xs opacity-80">Ressources</p>
                  <p className="text-2xl font-bold">{resourcesCount}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-xs opacity-80">Discussions</p>
                  <p className="text-2xl font-bold">{discussionsCount}</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-8 w-full py-2 bg-white text-[#006b53] rounded-lg font-bold hover:bg-[#f8f9fa] transition-colors flex items-center justify-center gap-2"
              >
                <FaChartLine size={14} />
                Voir Analyse Complète
              </button>
            </div>

            {/* Account Management */}
            <div className="lg:col-span-3 bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-[#191c1d]">
                  Gestion du compte
                </h3>
                <p className="text-[#4f606f]">
                  Mettez à jour vos informations ou accédez aux raccourcis
                  correspondants.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#e7e8e9] text-[#3d4a44] text-sm font-medium rounded-lg hover:bg-[#e1e3e4] transition-colors group cursor-pointer"
                >
                  <FaCog
                    className="group-hover:rotate-45 transition-transform"
                    size={16}
                  />
                  Modifier le profil
                </button>
                <button
                  onClick={handleReport}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#ffdad6] text-[#93000a] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <FaExclamationTriangle size={16} />
                  Signaler un problème
                </button>
              </div>
            </div>

            {/* Reviews (Avis) */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold text-[#191c1d]">Avis</h3>
                <span className="px-2 py-1 bg-[#e1e3e4] text-[#4f606f] rounded-full text-xs font-bold">
                  {evaluationsCount}
                </span>
              </div>

              {reviewsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviewsList.map((evalItem) => (
                    <div
                      key={evalItem.id_evaluation}
                      className="bg-white rounded-xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              bustCache(
                                evalItem.auteur?.photo_profil,
                                evalItem.auteur?.updated_at,
                              ) ||
                              avatarFallback(
                                evalItem.auteur?.prenom,
                                evalItem.auteur?.nom,
                                40,
                              )
                            }
                            alt={evalItem.auteur?.prenom || "Étudiant"}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            onError={(e) => {
                              e.target.src = avatarFallback(
                                evalItem.auteur?.prenom,
                                evalItem.auteur?.nom,
                                40,
                              );
                            }}
                          />
                          <div>
                            <p className="font-semibold text-[#191c1d] text-sm">
                              {evalItem.auteur
                                ? `${evalItem.auteur.prenom} ${evalItem.auteur.nom}`
                                : "Étudiant"}
                            </p>
                            <p className="text-xs text-[#4f606f]">
                              {evalItem.date_evaluation
                                ? new Date(
                                    evalItem.date_evaluation,
                                  ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Récemment"}
                            </p>
                          </div>
                        </div>
                        <StarRating value={evalItem.note} size={12} />
                      </div>
                      {evalItem.commentaire && (
                        <p className="text-sm text-[#3d4a44] mt-2 leading-relaxed">
                          {evalItem.commentaire}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#bccac2] min-h-[200px] shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
                  <div className="w-16 h-16 bg-[#f3f4f5] rounded-full flex items-center justify-center mb-4">
                    <FaComments className="text-[#bccac2]" size={28} />
                  </div>
                  <p className="text-xl font-semibold text-[#bccac2]">
                    Aucun avis pour le moment
                  </p>
                  <p className="text-[#4f606f] max-w-sm mt-2">
                    Les avis de vos pairs et professeurs apparaîtront ici dès
                    qu'ils auront évalué vos contributions.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
