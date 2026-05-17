import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URLS, fetchData } from "../api/api";
import {
  FaCheckCircle,
  FaUserCheck,
  FaCommentDots,
  FaExclamationCircle,
  FaTimes,
  FaPaperPlane,
  FaShieldAlt,
  FaUserCircle,
  FaStar
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
        primaryBg: "bg-emerald-100 border-emerald-200",
        primaryText: "text-emerald-800",
        accentText: "text-emerald-650",
        accentBg: "bg-emerald-50/60",
        accentBorder: "border-emerald-150",
        badgeText: "Enseignant Certifié",
        profileBadgeColor: "text-emerald-500",
        interestsBg: "bg-emerald-50/50 text-emerald-800 border-emerald-100",
        avatarBorder: "border-emerald-100",
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
      alert("Veuillez sélectionner un motif de signalement.");
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
      alert(`Erreur: ${err.message || "Impossible de soumettre le signalement."}`);
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
                src={`https://i.pravatar.cc/150?u=${user?.id_user}`}
                alt="user"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";
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
      alert(`Erreur: ${err.message || "Impossible de soumettre l'évaluation."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-slate-800">Évaluez ce professeur</p>
        <p className="text-xs text-slate-400 mt-0.5">Votre évaluation aide d'autres étudiants à choisir leur tuteur.</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Note :</span>
        <div className="flex gap-1.5">
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
                className={star <= (hoveredNote || note) ? "text-amber-500" : "text-slate-200"}
                size={22}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-amber-600 ml-2 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
          {(hoveredNote || note)}.0 / 5
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Votre Commentaire :</span>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Décrivez votre expérience (méthodes pédagogiques, clarté, disponibilité...)"
          className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-max bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center gap-2 self-end shadow-sm"
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4 font-semibold">Chargement du profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <p className="text-red-500 font-bold text-lg">Profil introuvable</p>
        <p className="text-slate-400 text-sm mt-1">L'utilisateur demandé n'existe pas ou a été suspendu.</p>
      </div>
    );
  }

  const isOwnProfile = !id || (loggedInUser && loggedInUser.id_user === user.id_user);
  const isProfileAdmin = user.role === "admin";

  // Load the dynamic theme based on the profile's role
  const theme = getRoleTheme(user.role);

  return (
    <div className="bg-[#f8f9ff] mt-20 min-h-screen font-sans">
      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} user={user} isOwnProfile={isOwnProfile} />
      )}

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PROFILE CARD */}
          <section className="md:col-span-4 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center bg-white border border-slate-100">
            <div className="relative mb-6">
              <img
                className={`w-40 h-40 rounded-full border-4 shadow-md object-cover ${theme.avatarBorder}`}
                src={`https://i.pravatar.cc/150?u=${user.id_user}`}
                alt="user"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                }}
              />
              <span className={`absolute bottom-2 right-2 text-xl bg-white rounded-full p-0.5 shadow-sm ${theme.profileBadgeColor}`}>
                {isProfileAdmin ? <FaShieldAlt /> : <FaCheckCircle />}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800">
              {user.prenom} {user.nom}
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">{user.email}</p>

            {/* Display rating only for teachers (professeur) */}
            {user.role === "professeur" && (
              <div className="flex flex-col items-center gap-1 mt-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-xl font-black">{user.avg_rating || "0.0"}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= Math.round(user.avg_rating || 0) ? "text-amber-500" : "text-slate-200"}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-400">
                  ({user.evaluations_count || 0} {user.evaluations_count === 1 ? "évaluation" : "évaluations"})
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.primaryBg} ${theme.primaryText}`}>
                {user.role}
              </span>
              {!isProfileAdmin && user.niveau_etude && (
                <span className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {user.niveau_etude}
                </span>
              )}
            </div>
          </section>

          {/* ACCOUNT DETAILS */}
          <section className="md:col-span-8 rounded-2xl shadow-sm p-8 bg-white border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
              <h2 className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                Informations du compte
              </h2>
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold w-max ${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`}>
                {isProfileAdmin ? <FaShieldAlt /> : <FaUserCheck />}
                <span>
                  {theme.badgeText}
                </span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-6 capitalize">
              {user.prenom} {user.nom}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Adresse Email</p>
                <p className="font-bold text-slate-700 mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {isProfileAdmin ? "Niveau de privilèges" : "Niveau d'études"}
                </p>
                <p className="font-bold text-slate-700 mt-1">
                  {isProfileAdmin ? "Administration Globale" : (user.niveau_etude || "Non spécifié")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Numéro de Téléphone</p>
                <p className="font-bold text-slate-700 mt-1">
                  {user.telephone || "Non renseigné"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rôle d'utilisateur</p>
                <p className="font-bold text-slate-700 capitalize mt-1">{user.role}</p>
              </div>
            </div>
          </section>

          {/* MANAGE & ACTIONS */}
          <section className="md:col-span-12 bg-white rounded-2xl shadow-sm p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Gestion du compte</h2>
              <p className="text-slate-400 text-sm mt-0.5">Mettez à jour vos informations ou accédez aux raccourcis correspondants.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Shortcut to Admin Panel for Admin users */}
              {currentIsAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition duration-200"
                >
                  <FaShieldAlt />
                  Panel Administration
                </button>
              )}

              {/* Edit Profile button */}
              {isOwnProfile && (
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer font-bold text-sm hover:scale-[1.02] transition duration-200">
                  <FaCommentDots />
                  Modifier le profil
                </button>
              )}

              {/* Report button: visible for ALL users (Locateur, Etudiant, Professeur) except administrators */}
              {/* If it's the own profile, they can report a system bug/problem ('Signaler un problème') */}
              {!currentIsAdmin && !isProfileAdmin && (
                <button
                  onClick={() => setShowReport(true)}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] shadow-sm transition duration-200 font-bold text-sm"
                >
                  <FaExclamationCircle />
                  {isOwnProfile ? "Signaler un problème" : "Signaler ce profil"}
                </button>
              )}
            </div>
          </section>

          {/* INTERESTS */}
          <section className="md:col-span-6 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme.accentText}`}>
              Centres d'intérêt
            </h2>
            <div className="flex flex-wrap gap-2">
              {theme.interests.map((interest, index) => (
                <span 
                  key={index}
                  className={`border px-3 py-1 rounded-lg text-xs font-semibold ${theme.interestsBg}`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section className="md:col-span-6 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme.accentText}`}>
              À propos
            </h2>
            <p className="text-slate-650 text-sm leading-relaxed font-medium">
              {theme.about}
            </p>
          </section>

          {/* EVALUATIONS & REVIEWS SECTION */}
          {user.role === "professeur" && (
            <section className="md:col-span-12 bg-white rounded-2xl shadow-sm p-8 border border-slate-100 mt-2">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Évaluations & Avis</h2>
                <p className="text-slate-400 text-sm mt-0.5">Consultez les retours des étudiants ou évaluez les compétences pédagogiques de ce professeur.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Score breakdown card */}
                <div className="lg:col-span-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-black text-slate-800">{user.avg_rating || "0.0"}</span>
                  <div className="flex gap-1 my-3 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= Math.round(user.avg_rating || 0) ? "text-amber-500" : "text-slate-200"}
                        size={20}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    Basé sur {user.evaluations_count || 0} {user.evaluations_count === 1 ? "évaluation" : "évaluations"}
                  </p>
                </div>

                {/* Form to submit review */}
                <div className="lg:col-span-8">
                  {loggedInUser && loggedInUser.role === "etudiant" && !isOwnProfile ? (
                    <EvaluationForm targetUserId={user.id_user} onSubmitted={() => {
                      window.location.reload();
                    }} />
                  ) : (
                    <div className="bg-emerald-50/55 rounded-xl border border-emerald-100/50 p-5 flex flex-col justify-center h-full text-slate-700">
                      <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500" />
                        Charte de confiance UniConnect
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
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
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  Avis récents ({user.evaluations?.length || 0})
                </h3>

                {user.evaluations && user.evaluations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.evaluations.map((evalItem) => (
                      <div key={evalItem.id_evaluation} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm transition hover:shadow">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-9 h-9 rounded-full object-cover shadow-sm"
                              src={`https://i.pravatar.cc/150?u=${evalItem.id_auteur}`}
                              alt="auteur"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";
                              }}
                            />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">
                                {evalItem.auteur ? `${evalItem.auteur.prenom} ${evalItem.auteur.nom}` : "Étudiant"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {evalItem.date_evaluation ? new Date(evalItem.date_evaluation).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                }) : "Récemment"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= evalItem.note ? "text-amber-500" : "text-slate-200"}
                                size={12}
                              />
                            ))}
                          </div>
                        </div>
                        {evalItem.commentaire && (
                          <p className="text-xs text-slate-600 mt-3.5 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-50 italic">
                            "{evalItem.commentaire}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50/55 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-semibold">Aucune évaluation pour le moment.</p>
                    <p className="text-slate-400 text-xs mt-1">Soyez le premier à partager votre expérience académique !</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
