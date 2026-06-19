import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API_BASE, { fetchData, API_URLS } from "../../api/api";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCouch,
  FaCheck,
  FaCommentAlt,
  FaFlag,
  FaUsers,
  FaClock,
  FaShareAlt,
  FaShieldAlt
} from "react-icons/fa";

const mapApiToHome = (item) => {
  let parsed = { rules: [], amenities: [] };
  if (item.reglement) {
    try {
      const data = JSON.parse(item.reglement);
      if (data && typeof data === "object") {
        parsed = { ...parsed, ...data };
      } else {
        parsed.rules = item.reglement.split(",").map((r) => r.trim()).filter(Boolean);
      }
    } catch {
      parsed.rules = item.reglement.split(",").map((r) => r.trim()).filter(Boolean);
    }
  }
  const furnitureLabel = item.meuble ? "Fully Furnished" : "";
  return {
    id: item.id_hebergement,
    title: item.titre || [item.type, item.localisation].filter(Boolean).join(" - ") || "Hébergement",
    price: `${item.prix} MAD`,
    priceNum: parseFloat(item.prix),
    location: item.localisation || "",
    type: item.type,
    rooms: item.nbr_chambres,
    maxCapacity: item.max_capacity ?? parseInt(item.nbr_chambres) ?? 0,
    area: item.superficie,
    roomType: item.type_chambre || "Chambre",
    gender: item.genre_colocataires || "mixte",
    studentsOnly: item.students_only ?? false,
    meuble: item.meuble ?? false,
    rules: parsed.rules,
    amenities: parsed.amenities,
    furniture: furnitureLabel,
    occupancy: item.nb_locataires ?? 0,
    image: item.image,
    images: item.images?.length ? item.images : item.image ? [item.image] : [],
    description: item.description || "",
    poster: `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() || "Propriétaire",
    proprietaireId: item.proprietaire?.id_user || item.id_createur,
    occupants: item.occupants || [],
    formule: item.formule || "standard",
    created_at: item.created_at,
  };
};

function HomeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchData(`${API_URLS.HEBERGEMENTS}/${id}`);
        const item = result.data || result;
        setHome(mapApiToHome(item));
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Impossible de charger cette annonce.", "error");
        navigate("/colocations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const googleMapsUrl = home?.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco&output=embed&z=15`
    : "";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center mt-20">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium mt-4">Chargement de l'annonce...</p>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center mt-20">
        <p className="text-stone-400 text-sm tracking-wide">Logement non trouvé</p>
      </div>
    );
  }

  const displayImages = [];
  if (home && home.image) {
    displayImages.push(home.image);
  }
  if (home && Array.isArray(home.images) && home.images.length > 0) {
    displayImages.push(...home.images);
  }

  const maxCapacity = Math.max(0, home.maxCapacity ?? 0);
  const currentOccupants = Math.min(home.occupancy ?? 0, maxCapacity);
  const spotsLeft = Math.max(0, maxCapacity - currentOccupants);

  const posterInitials = (home.poster || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openMessageDialog = (title, subjectPrefix) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedInUser) {
      return Swal.fire("Connexion requise", "Connectez-vous pour envoyer un message.", "warning");
    }
    Swal.fire({
      title: title,
      input: "textarea",
      inputPlaceholder: "Écrivez votre message ici...",
      inputAttributes: { rows: 4 },
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#10b981",
      preConfirm: (msg) => {
        if (!msg || !msg.trim()) {
          Swal.showValidationMessage("Veuillez écrire un message.");
          return false;
        }
        return msg.trim();
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        const res = await fetch(`${API_BASE}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            id_destinataire: home.proprietaireId,
            id_hebergement: home.id,
            sujet: `${subjectPrefix} - ${home.title}`,
            contenu: result.value,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
        Swal.fire("Envoyé !", "Votre message a été transmis au propriétaire.", "success");
      } catch (err) {
        Swal.fire("Erreur", err.message, "error");
      }
    });
  };

  const handleRequestJoin = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedInUser) {
      return Swal.fire("Connexion requise", "Connectez-vous pour faire une demande.", "warning");
    }
    if (loggedInUser.role !== "etudiant") {
      return Swal.fire("Accès refusé", "Seuls les étudiants peuvent demander à rejoindre.", "warning");
    }
    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id_hebergement: home.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Erreur lors de la demande");
      Swal.fire("Demande envoyée !", "Votre demande a été transmise au propriétaire. En attente de confirmation.", "success");
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    }
  };
  const handleContactOwner = () => openMessageDialog("Contacter le propriétaire", "Contact");

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire("Lien copié !", "Le lien de l'annonce a été copié dans le presse-papier.", "success");
    }).catch(() => {
      Swal.fire("Erreur", "Impossible de copier le lien.", "error");
    });
  };

  const handleReportListing = () => {
    Swal.fire({
      title: "Signaler l'annonce",
      text: "Merci de nous aider à maintenir notre communauté sûre. Veuillez décrire le problème :",
      input: "textarea",
      inputPlaceholder: "Décrivez la raison de votre signalement...",
      showCancelButton: true,
      confirmButtonText: "Signaler",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire("Signalé", "L'annonce a été signalée aux modérateurs.", "success");
      }
    });
  };

  return (
    <div className="mt-20 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 font-poppins text-[#0b1c30]">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
      >
        <FaArrowLeft className="text-[10px]" /> Retour aux annonces
      </button>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="overflow-hidden rounded-[24px] h-[480px] shadow-sm hover:shadow-md transition-shadow relative">
          <img
            src={displayImages[0]}
            alt="Main Space"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
          />
        </div>
        {displayImages.length > 1 && (
          <div className="grid grid-cols-2 gap-4 h-[480px] content-start">
            {displayImages.slice(1).map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-[20px] shadow-sm hover:shadow-md transition-shadow h-[230px]">
                <img
                  src={img}
                  alt={`Photo ${idx + 2}`}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-8 gap-4">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-2">
            {home.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {home.type && (
              <span className="bg-emerald-50 text-[#10b981] border border-emerald-100 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {home.type}
              </span>
            )}
            {home.studentsOnly && (
              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Students Only
              </span>
            )}
            <span className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {home.formule}
            </span>
          </div>
          {home.location && (
            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 font-semibold text-sm hover:text-[#10b981] transition-colors"
            >
              <FaMapMarkerAlt className="w-4 h-4 shrink-0 text-slate-350" />
              <span>{home.location}</span>
            </a>
          )}
          {home.created_at && (
            <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
              <FaClock className="text-[10px]" />
              Publiée le {new Date(home.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
        <div className="bg-[#10b981] text-white rounded-[20px] px-6 py-4 flex flex-col items-center justify-center min-w-[170px] text-center shadow-sm w-full md:w-auto self-stretch md:self-auto">
          <span className="text-2xl font-black">{home.priceNum} DH</span>
          <span className="text-[10px] font-bold opacity-90 mt-0.5 leading-tight uppercase tracking-wider">/ mois</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Details + Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-5 text-left">
              AMÉNAGEMENTS INCLUS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-left">
              {(home.amenities?.length > 0 ? home.amenities : ["WiFi", "Electricité", "Eau"]).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <FaCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{amenity}</h4>
                    <span className="text-xs text-slate-400 font-semibold block mt-0.5">Inclus</span>
                  </div>
                </div>
              ))}
            </div>

            {home.meuble && home.furniture && (
              <div className="flex items-center gap-4 mb-6 text-left border-t border-slate-100 pt-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <FaCouch className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{home.furniture}</h4>
                  <span className="text-xs text-slate-400 font-semibold block mt-0.5">Statut du meublement</span>
                </div>
              </div>
            )}

            {home.description && (
              <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-5 mt-2 text-left">
                {home.description}
              </p>
            )}

            {(() => {
              const specs = [
                home.area != null && { label: "Superficie", value: `${home.area} m²` },
                home.rooms != null && { label: "Chambres", value: `${home.rooms}` },
                home.gender && { label: "Colocataires", value: home.gender === "female" || home.gender === "femme" ? "Filles uniquement" : home.gender === "male" || home.gender === "homme" ? "Garçons uniquement" : "Colocation Mixte" },
                home.roomType && { label: "Type de chambre", value: home.roomType },
                { label: "Meublé", value: home.meuble ? "Oui" : "Non" },
                maxCapacity > 1 && { label: "Capacité max", value: `${maxCapacity} étudiants` },
                currentOccupants > 0 && { label: "Occupé", value: `${currentOccupants} place${currentOccupants > 1 ? "s" : ""}` },
                home.studentsOnly && { label: "Étudiants seulement", value: "Oui" },
              ].filter(Boolean);
              return specs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-100/50 p-4 rounded-2xl mt-6 text-left">
                  {specs.map((spec, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{spec.label}</span>
                      <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            {home.rules?.length > 0 && (
              <div className="border-t border-slate-100 pt-5 mt-6 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                  RÈGLES DE LA MAISON
                </span>
                <div className="flex flex-wrap gap-2">
                  {home.rules.map((rule, idx) => (
                    <span key={idx} className="bg-emerald-50 text-[#10b981] border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {home.location && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">
                LOCALISATION
              </span>
              <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-100 border border-slate-100 shadow-inner">
                <iframe
                  title="Location Map"
                  src={googleMapsUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Availability + Owner + CTAs */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                DISPONIBILITÉ
              </span>
              <span className="bg-emerald-50 text-[#10b981] px-3 py-1 rounded-full text-[10px] font-extrabold">
                {spotsLeft}/{maxCapacity} places
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
              <div className="bg-[#10b981] h-full rounded-full transition-all duration-550" style={{ width: `${Math.min(100, (spotsLeft / maxCapacity) * 100)}%` }} />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-slate-800 text-sm mb-4">
                Occupation actuelle
                {home.occupants?.length > 0 && (
                  <span className="text-[#10b981] text-xs font-bold ml-2">({home.occupants.length})</span>
                )}
              </h3>
              {home.occupants?.length > 0 ? (
                <div className="space-y-2">
                  {home.occupants.map((occ) => (
                    <div key={occ.id_user} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl">
                      <img
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                        src={occ.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent((occ.prenom||'')+' '+(occ.nom||''))}&background=10b981&color=fff&size=36&bold=true`}
                        alt={occ.prenom}
                      />
                      <div className="text-left">
                        <p className="font-bold text-slate-800 text-xs">{occ.prenom} {occ.nom}</p>
                        <span className="text-[10px] text-slate-400 font-semibold">Occupant</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Aucun occupant</h4>
                    <span className="text-xs text-slate-400 font-semibold block mt-0.5">sur {maxCapacity} place{maxCapacity > 1 ? "s" : ""} disponibles</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-center gap-4 text-left shadow-sm">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#10b981] border border-emerald-100 shadow-inner flex items-center justify-center font-extrabold text-base">
                {posterInitials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow">
                <FaCheck className="w-2 h-2 text-white" />
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">{home.poster || "Propriétaire vérifié"}</h4>
              <span className="text-xs text-slate-400 font-semibold block mt-0.5">Propriétaire</span>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 flex items-center gap-3 text-left shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <FaShieldAlt className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-800 text-xs">Annonce vérifiée</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Logement authentifié par UniConnect</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRequestJoin}
              className="w-full bg-[#10b981] hover:bg-[#0b9062] active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Demander à rejoindre
            </button>
            <button
              onClick={handleContactOwner}
              className="w-full border-2 border-[#10b981] hover:bg-emerald-50/50 active:scale-[0.98] text-[#10b981] py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <FaCommentAlt className="w-4 h-4 shrink-0" />
              Contacter le propriétaire
            </button>

            <button
              onClick={handleShare}
              className="w-full border-2 border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-600 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <FaShareAlt className="w-3.5 h-3.5 shrink-0" />
              Partager
            </button>

            <button
              onClick={handleReportListing}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-bold mt-2 transition-colors cursor-pointer self-center"
            >
              <FaFlag className="w-3.5 h-3.5 shrink-0" />
              Signaler l'annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDetails;
