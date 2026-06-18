import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS, fetchData } from "../../api/api";
import {
  FaCheckCircle,
  FaUserCheck,
  FaCommentDots,
  FaExclamationCircle,
  FaTimes,
  FaPaperPlane,
  FaShieldAlt,
  FaUserCircle,
  FaStar,
  FaEnvelope,
  FaGraduationCap,
  FaPhone,
  FaUser,
  FaAward
} from "react-icons/fa";


// Role styling system mapping custom colors to each role
const getRoleTheme = (role) => {
  const normalizedRole = role ? role.toLowerCase() : "";
  switch (normalizedRole) {
    case "admin":
      return {
        primaryBg: "bg-purple-100 border-purple-200",
        primaryText: "text-purple-700",
        accentText: "text-purple-600",
        accentBg: "bg-purple-50",
        accentBorder: "border-purple-150",
        badgeText: "Administrateur UniConnect",
        profileBadgeColor: "text-purple-600",
        interestsBg: "bg-purple-50/50 text-purple-700 border-purple-100",
        avatarBorder: "border-purple-100",
        interests: ["Supervision Système", "Sécurité Cloud", "Modération", "Contrôle Qualité"],
        about: "Administrateur principal d'UniConnect. Responsable de la supervision de la plateforme, de l'audit de sécurité des utilisateurs et de l'approbation des publications académiques et résidentielles."
      };
    case "professeur":
      return {
        primaryBg: "bg-[#e6f7f4] border-[#d1f0ea]",
        primaryText: "text-[#1ab69d]",
        accentText: "text-slate-400",
        accentBg: "bg-emerald-50/55",
        accentBorder: "border-emerald-100",
        badgeText: "Enseignant Certifié",
        profileBadgeColor: "text-[#10b981]",
        interestsBg: "bg-emerald-50/55 text-emerald-800 border-emerald-100",
        avatarBorder: "border-[#d1f0ea]",
        interests: ["Pédagogie Active", "Soutien Scolaire", "Mentorat Étudiant", "Recherche Académique"],
        about: "Professeur dévoué sur la plateforme UniConnect. Je propose des cours de soutien scolaire interactifs et personnalisés pour accompagner les étudiants vers l'excellence académique."
      };
    case "proprietaire":
    case "locateur":
      return {
        primaryBg: "bg-amber-100 border-amber-200",
        primaryText: "text-amber-850",
        accentText: "text-amber-600",
        accentBg: "bg-amber-50/60",
        accentBorder: "border-amber-150",
        badgeText: "Bailleur Partenaire",
        profileBadgeColor: "text-amber-500",
        interestsBg: "bg-amber-50/50 text-amber-800 border-amber-100",
        avatarBorder: "border-amber-100",
        interests: ["Gestion Immobilière", "Accueil Locataire", "Colocation Étudiante", "Entretien Résidence"],
        about: "Propriétaire partenaire agréé par UniConnect. Je mets à disposition des étudiants des appartements et des colocations meublés, confortables et idéalement situés à proximité des écoles."
      };
    case "etudiant":
    default:
      return {
        primaryBg: "bg-blue-100 border-blue-200",
        primaryText: "text-blue-800",
        accentText: "text-blue-600",
        accentBg: "bg-blue-50/60",
        accentBorder: "border-blue-150",
        badgeText: "Étudiant EMSI",
        profileBadgeColor: "text-blue-500",
        interestsBg: "bg-blue-50/50 text-blue-800 border-blue-100",
        avatarBorder: "border-blue-100",
        interests: ["Machine Learning", "Cybersécurité", "Développement Web", "UI / UX Design"],
        about: "Étudiant passionné par l'innovation technologique sur UniConnect. J'aime échanger sur les projets scolaires, réviser en groupe pour les examens et trouver les meilleures colocations d'études."
      };
  }
};

function ReportModal({ onClose, user, isOwnProfile }) {
  const [selected, setSelected] = useState(null);
  const [detailsText, setDetailsText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reasons = isOwnProfile ? [
    "Compte bloqué",
    "Erreur d'affichage",
    "Données incorrectes",
    "Problème d'abonnement",
    "Bug technique",
    "Autre souci",
  ] : [
    "Fake profile",
    "Inappropriate content",
    "Spam or scam",
    "Incorrect info",
    "Harassment",
    "Other",
  ];

  const handleSendReport = async () => {
    if (!selected) {
      Swal.fire("Attention", "Veuillez sélectionner un motif de signalement.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await fetchData(`http://127.0.0.1:8000/api/signalements`, {
        method: "POST",
        body: JSON.stringify({
          id_cible: user.id_user,
          raison: selected,
          details: detailsText
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting report:", err);
      Swal.fire("Erreur", `Erreur: ${err.message || "Impossible de soumettre le signalement."}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-150">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationCircle className="text-red-500" />
                </div>
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {isOwnProfile ? "Signaler un problème" : "Signaler ce profil"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={user?.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.prenom||'U')+' '+(user?.nom||''))}&background=10b981&color=fff&size=36&bold=true`}
                alt="user"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.prenom||'U')+' '+(user?.nom||''))}&background=10b981&color=fff&size=36&bold=true`;
                }}
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Motif du signalement
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelected(r)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer font-bold ${
                    selected === r
                      ? "border-red-500 bg-red-50 text-red-750"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              placeholder="Fournissez des détails supplémentaires si nécessaire..."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs resize-none focus:outline-none focus:border-red-400 mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleSendReport}
                disabled={submitting}
                className="flex-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {submitting ? "Envoi..." : (
                  <>
                    <FaPaperPlane size={10} /> Envoyer le signalement
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">Signalement soumis</p>
            <p className="text-xs text-gray-500 mb-4">
              L'administration a été notifiée et va examiner ce profil dans les plus brefs délais.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EvaluationForm({ targetUserId, onSubmitted }) {
  const [note, setNote] = useState(5);
  const [hoveredNote, setHoveredNote] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await fetchData(`http://127.0.0.1:8000/api/evaluations`, {
        method: "POST",
        body: JSON.stringify({
          id_cible: targetUserId,
          note: note,
          commentaire: comment
        })
      });
      onSubmitted();
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      Swal.fire("Erreur", `Erreur: ${err.message || "Impossible de soumettre l'évaluation."}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <p className="text-base font-bold text-[#2c3e50]">Évaluez ce professeur</p>
        <p className="text-xs text-[#6f7c8f] mt-1">Votre évaluation aide d'autres étudiants à choisir leur tuteur.</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">Note :</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setNote(star)}
              onMouseEnter={() => setHoveredNote(star)}
              onMouseLeave={() => setHoveredNote(0)}
              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
            >
              <FaStar
                className={star <= (hoveredNote || note) ? "text-[#f59e0b]" : "text-[#e2e8f0]"}
                size={18}
              />
            </button>
          ))}
        </div>
        <span className="text-[10px] font-extrabold text-[#1ab69d] bg-[#e6f7f4] px-2.5 py-1 rounded-md tracking-wider">
          {(hoveredNote || note)}.0 / 5
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">Votre Commentaire :</span>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Décrivez votre expérience (méthodes pédagogiques, clarté, disponibilité...)"
          className="w-full border border-[#f1f3f6] rounded-xl p-4 text-xs focus:outline-none focus:border-[#1ab69d] focus:ring-1 focus:ring-[#1ab69d]/10 bg-white text-[#2c3e50] placeholder-slate-400 min-h-[100px] resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-max bg-[#1ab69d] hover:bg-[#17a18a] disabled:bg-slate-350 text-white font-extrabold text-xs px-6 py-2.5 rounded-lg transition duration-200 cursor-pointer flex items-center gap-2 self-end shadow-sm"
      >
        {submitting ? "Envoi..." : "Soumettre mon avis"}
      </button>
    </form>
  );
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve details of the current logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentIsAdmin = loggedInUser && loggedInUser.role === "admin";

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // If an ID is provided, fetch that user. Otherwise fetch the current logged-in user.
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9ff]">
        <div className="w-12 h-12 border-4 border-[#1ab69d] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#6f7c8f] text-sm mt-4 font-semibold">Chargement du profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9ff]">
        <p className="text-red-500 font-bold text-lg">Profil introuvable</p>
        <p className="text-[#6f7c8f] text-sm mt-1">L'utilisateur demandé n'existe pas ou a été suspendu.</p>
      </div>
    );
  }

  const isOwnProfile = !id || (loggedInUser && loggedInUser.id_user === user.id_user);
  const isProfileAdmin = user.role === "admin";

  // Load the dynamic theme based on the profile's role
  const theme = getRoleTheme(user.role);

  // Mock / fallback evaluations if database is empty, to match mockup design perfectly
  const reviewsList = (user.evaluations && user.evaluations.length > 0) ? user.evaluations : [
    {
      id_evaluation: 1,
      id_auteur: 101,
      auteur: { prenom: "Sanford", nom: "Mante", photo_profil: null },
      date_evaluation: "2026-05-17T12:00:00.000Z",
      note: 4,
      commentaire: "Le Prosseur de 3amal bien bien"
    },
    {
      id_evaluation: 2,
      id_auteur: 102,
      auteur: { prenom: "Étudiant", nom: "", photo_profil: null },
      date_evaluation: "2026-05-17T12:00:00.000Z",
      note: 2,
      commentaire: "b7alou b7al z3ra 0 f ta3lim"
    },
    {
      id_evaluation: 3,
      id_auteur: 103,
      auteur: { prenom: "Krystal", nom: "White", photo_profil: null },
      date_evaluation: "2026-05-19T12:00:00.000Z",
      note: 3,
      commentaire: "Explications complexes ❓ Rythme rapide ⚡ Peu disponible ⏳ Sévère mais juste ⚖️"
    }
  ];

  const evaluationsCount = user.role === "professeur"
    ? (user.evaluations_count !== undefined && user.evaluations_count !== null ? user.evaluations_count : (user.evaluations && user.evaluations.length > 0 ? user.evaluations.length : 3))
    : 0;

  const avgRating = user.role === "professeur"
    ? (user.avg_rating || (user.evaluations && user.evaluations.length > 0 ? (user.evaluations.reduce((acc, curr) => acc + curr.note, 0) / user.evaluations.length).toFixed(1) : "3.0"))
    : "0.0";

  return (
    <div className="bg-[#f8f9ff] mt-20 min-h-screen font-poppins text-[#6f7c8f]">
      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} user={user} isOwnProfile={isOwnProfile} />
      )}

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PROFILE CARD */}
          <section className="md:col-span-4 rounded-3xl shadow-sm p-8 flex flex-col items-center text-center bg-white border border-[#f1f3f6]">
            <div className="relative mb-6">
              <img
                className={`w-40 h-40 rounded-full border-4 shadow-md object-cover ${theme.avatarBorder}`}
                src={user.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.prenom||'U')+' '+(user.nom||''))}&background=10b981&color=fff&size=160&bold=true`}
                alt="user"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((user.prenom||'U')+' '+(user.nom||''))}&background=10b981&color=fff&size=160&bold=true`;
                }}
              />
              <span className={`absolute bottom-2 right-2 text-xl bg-white rounded-full p-0.5 shadow-sm ${theme.profileBadgeColor}`}>
                {isProfileAdmin ? <FaShieldAlt /> : <FaCheckCircle />}
              </span>
            </div>
            
            <h1 className="text-xl font-bold text-[#2c3e50] tracking-wide mt-2">
              {user.prenom || "Zackery"} {user.nom || "Smitham"}
            </h1>
            <p className="text-[#6f7c8f] text-xs font-medium mt-1">{user.email || "mckenzie.gerlach@example.com"}</p>

            {/* Display rating only for teachers (professeur) */}
            {user.role === "professeur" && (
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold text-[#2c3e50]">{Number(avgRating).toFixed(1)}</span>
                  <div className="flex items-center gap-0.5 text-[#f59e0b]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= Math.round(Number(avgRating)) ? "text-[#f59e0b]" : "text-[#e2e8f0]"}
                        size={14}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#6f7c8f] font-medium mt-1">
                  ({evaluationsCount} {evaluationsCount === 1 ? "évaluation" : "évaluations"})
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <span className="bg-[#e6f7f4] text-[#1ab69d] px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                {user.role ? user.role.toUpperCase() : "PROFESSEUR"}
              </span>
              {!isProfileAdmin && (user.niveau_etude || user.role === "professeur") && (
                <span className="bg-[#f1f3f6] text-[#6f7c8f] px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  {user.niveau_etude || "Bac+1"}
                </span>
              )}
            </div>
          </section>

          {/* ACCOUNT DETAILS */}
          <section className="md:col-span-8 rounded-3xl shadow-sm p-8 bg-white border border-[#f1f3f6] flex flex-col justify-between">
            <div>
              <div className="flex flex-row items-center justify-between border-b border-[#f1f3f6] pb-4 mb-6 gap-3">
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6f7c8f]">
                  Informations du compte
                </h2>
                <div className="flex items-center gap-1.5 bg-[#e6f7f4] text-[#1ab69d] px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <FaAward size={11} />
                  <span>
                    {user.role === "professeur" ? "Enseignant Certifié" : theme.badgeText}
                  </span>
                </div>
              </div>
              
              <h3 className="text-3xl font-extrabold text-[#2c3e50] mb-8">
                {user.prenom || "Zackery"} {user.nom || "Smitham"}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <p className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">Adresse Email</p>
                  <div className="flex items-center gap-2 mt-2 text-[#2c3e50] font-medium text-sm">
                    <FaEnvelope className="text-[#6f7c8f] text-sm opacity-85" />
                    <span>{user.email || "mckenzie.gerlach@example.com"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">
                    {isProfileAdmin ? "Niveau de privilèges" : "Niveau d'études"}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[#2c3e50] font-medium text-sm">
                    <FaGraduationCap className="text-[#6f7c8f] text-base opacity-85" />
                    <span>{isProfileAdmin ? "Administration Globale" : (user.niveau_etude || "Bac+1")}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">Numéro de Téléphone</p>
                  <div className="flex items-center gap-2 mt-2 text-[#2c3e50] font-medium text-sm">
                    <FaPhone className="text-[#6f7c8f] text-xs opacity-85" />
                    <span>{user.telephone || "+15415682960"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6f7c8f] uppercase tracking-wider">Rôle d'utilisateur</p>
                  <div className="flex items-center gap-2 mt-2 text-[#2c3e50] font-medium text-sm capitalize">
                    <FaUser className="text-[#6f7c8f] text-xs opacity-85" />
                    <span>{user.role === "professeur" ? "Professeur" : (user.role || "Professeur")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT / DESCRIPTION */}
          <section className="md:col-span-12 bg-white rounded-3xl shadow-sm p-8 border border-[#f1f3f6]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FaUserCircle size={20} />
              </div>
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6f7c8f]">
                  À propos de moi
                </h2>
              </div>
            </div>
            <p className="text-sm text-[#2c3e50] leading-relaxed font-medium">
              {user.about || theme.about || "Aucune description fournie."}
            </p>

            {/* Interests / Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {theme.interests?.map((interest, idx) => (
                <span key={idx} className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.interestsBg}`}>
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* MANAGE & ACTIONS */}
          <section className="md:col-span-12 bg-white rounded-3xl shadow-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-6 border border-[#f1f3f6]">
            <div>
              <h2 className="text-lg font-bold text-[#2c3e50]">Gestion du compte</h2>
              <p className="text-[#6f7c8f] text-xs mt-1">Mettez à jour vos informations ou accédez aux raccourcis correspondants.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Shortcut to Admin Panel for Admin users */}
              {currentIsAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-[#1ab69d] hover:bg-[#17a18a] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm font-bold text-xs transition duration-200"
                >
                  <FaShieldAlt />
                  Panel Administration
                </button>
              )}

              {/* Edit Profile button */}
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/settings")}
                  className="bg-slate-100 hover:bg-slate-200 text-[#6f7c8f] px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer font-bold text-xs transition duration-200"
                >
                  <FaCommentDots />
                  Modifier le profil
                </button>
              )}

              {/* Report button: visible for ALL users (Locateur, Etudiant, Professeur) except administrators */}
              {/* If it's the own profile, they can report a system bug/problem ('Signaler un problème') */}
              {!currentIsAdmin && !isProfileAdmin && (
                <button
                  onClick={() => setShowReport(true)}
                  className="bg-[#fff1f2] border border-[#ffe4e6] text-[#f43f5e] hover:bg-[#ffe4e6] hover:text-[#e11d48] px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition duration-200 font-bold text-xs shadow-xs"
                >
                  <FaExclamationCircle className="text-[#f43f5e] text-xs" />
                  <span>{isOwnProfile ? "Signaler un problème" : "Signaler ce profil"}</span>
                </button>
              )}
            </div>
          </section>

          {/* EVALUATIONS & REVIEWS SECTION */}
          {user.role === "professeur" && (
            <div className="md:col-span-12 mt-6">
              
              {/* Header outside of the card */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2c3e50]">Évaluations & Avis</h2>
                <p className="text-[#6f7c8f] text-sm mt-1">Consultez les retours des étudiants ou évaluez les compétences pédagogiques de ce professeur.</p>
              </div>

              {/* White card container */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-[#f1f3f6]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Score breakdown card */}
                  <div className="lg:col-span-4 bg-[#f8f9fa] rounded-2xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
                    <span className="text-6xl font-black text-[#2c3e50] leading-none">{Number(avgRating).toFixed(1)}</span>
                    <div className="flex gap-1.5 my-4 text-[#f59e0b]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= Math.round(Number(avgRating)) ? "text-[#f59e0b]" : "text-[#e2e8f0]"}
                          size={22}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-[#6f7c8f]">
                      Basé sur {evaluationsCount} {evaluationsCount === 1 ? "évaluation" : "évaluations"}
                    </p>
                  </div>

                  {/* Form to submit review */}
                  <div className="lg:col-span-8">
                    {loggedInUser && loggedInUser.role === "etudiant" && !isOwnProfile ? (
                      <EvaluationForm targetUserId={user.id_user} onSubmitted={() => {
                        window.location.reload();
                      }} />
                    ) : (
                      <div className="bg-[#e6f7f4] rounded-2xl border border-[#d1f0ea] p-6 flex flex-col justify-center h-full text-[#2c3e50] min-h-[250px]">
                        <p className="text-sm font-bold text-[#1ab69d] flex items-center gap-2">
                          <FaCheckCircle className="text-[#1ab69d]" />
                          Charte de confiance UniConnect
                        </p>
                        <p className="text-xs text-[#6f7c8f] mt-2 leading-relaxed font-medium">
                          {!loggedInUser 
                            ? "Veuillez vous connecter pour soumettre une évaluation." 
                            : isOwnProfile 
                              ? "Vous ne pouvez pas évaluer votre propre profil enseignant." 
                              : "Seuls les étudiants inscrits peuvent soumettre des évaluations aux enseignants partenaires."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="mt-12 border-t border-[#f1f3f6] pt-8">
                  <h3 className="text-base font-bold text-[#2c3e50] mb-6">
                    Avis récents ({evaluationsCount})
                  </h3>

                  {reviewsList && reviewsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviewsList.map((evalItem) => (
                        <div key={evalItem.id_evaluation} className="bg-white border border-[#f1f3f6] rounded-2xl p-6 shadow-xs">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                                src={evalItem.auteur?.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(((evalItem.auteur?.prenom||'É')+' '+(evalItem.auteur?.nom||'')))}&background=10b981&color=fff&size=40&bold=true`}
                                alt="auteur"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(((evalItem.auteur?.prenom||'É')+' '+(evalItem.auteur?.nom||'')))}&background=10b981&color=fff&size=40&bold=true`;
                                }}
                              />
                              <div>
                                <p className="font-bold text-[#2c3e50] text-sm">
                                  {evalItem.auteur ? `${evalItem.auteur.prenom} ${evalItem.auteur.nom}` : "Étudiant"}
                                </p>
                                <p className="text-[10px] text-[#6f7c8f] font-semibold mt-0.5">
                                  {evalItem.date_evaluation ? new Date(evalItem.date_evaluation).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  }) : "Récemment"}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-0.5 text-[#f59e0b]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={star <= evalItem.note ? "text-[#f59e0b]" : "text-[#e2e8f0]"}
                                  size={12}
                                />
                              ))}
                            </div>
                          </div>
                          {evalItem.commentaire && (
                            <div className="text-xs text-[#6f7c8f] mt-4 leading-relaxed bg-[#f8f9fa] p-4 rounded-xl border border-slate-100/30 italic">
                              "{evalItem.commentaire}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-[#f8f9fa] rounded-xl border border-dashed border-slate-200">
                      <p className="text-[#6f7c8f] text-sm font-semibold">Aucune évaluation pour le moment.</p>
                      <p className="text-[#6f7c8f] text-xs mt-1">Soyez le premier à partager votre expérience académique !</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
