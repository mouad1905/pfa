import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import API_BASE, { fetchData, API_URLS } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCouch,
  FaCheck,
  FaCommentAlt,
  FaFlag,
  FaUsers,
  FaClock
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
    maxCapacity: item.max_capacity || parseInt(item.nbr_chambres) || 1,
    area: item.superficie,
    roomType: item.type_chambre || "Chambre",
    gender: item.genre_colocataires || "mixte",
    studentsOnly: item.students_only ?? false,
    meuble: item.meuble ?? false,
    rules: parsed.rules,
    amenities: parsed.amenities,
    furniture: furnitureLabel,
    occupancy: item.nb_locataires || 0,
    image: item.image,
    images: item.images?.length ? item.images : item.image ? [item.image] : [],
    description: item.description || "",
    poster: `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() || "Propriétaire",
    proprietaireId: item.proprietaire?.id_user || item.id_createur,
    formule: item.formule || "standard",
    created_at: item.created_at,
  };
};

function HomeDetails() {
  const { state: stateHome } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useContext(AuthContext);
  const [home, setHome] = useState(stateHome ? mapApiToHome(stateHome) : null);
  const [loading, setLoading] = useState(!stateHome && !!id);

  useEffect(() => {
    if (stateHome) {
      setHome(mapApiToHome(stateHome));
      return;
    }
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
  }, [id, stateHome, navigate]);

  const googleMapsUrl = home?.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco&output=embed&z=15`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 mt-20">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 mt-20">
        <p className="text-stone-400 text-sm tracking-wide">Logement non trouvé</p>
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
  ];

  const displayImages = [];
  if (home && Array.isArray(home.images) && home.images.length > 0) {
    displayImages.push(...home.images);
  } else if (home && home.image) {
    displayImages.push(home.image);
  }
  while (displayImages.length < 4) {
    displayImages.push(defaultImages[displayImages.length % defaultImages.length]);
  }

  const maxCapacity = home.maxCapacity || 1;
  const currentOccupants = Math.min(home.occupancy || 0, maxCapacity);
  const spotsLeft = Math.max(0, maxCapacity - currentOccupants);

  const posterInitials = (home.poster || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleContactOwner = async () => {
    if (!loggedInUser) {
      return Swal.fire("Connexion requise", "Connectez-vous pour contacter le propriétaire.", "warning");
    }

    if (loggedInUser.role !== 'etudiant' && loggedInUser.role !== 'admin') {
      return Swal.fire("Action non autorisée", "Seuls les étudiants peuvent contacter un locateur.", "error");
    }

    try {
      Swal.showLoading();
      const res = await fetchData(API_URLS.CONVERSATIONS, {
        method: "POST",
        body: JSON.stringify({
          id_destinataire: home.proprietaireId
        })
      });
      Swal.close();
      const conversationId = res.id_conversation || res.data?.id_conversation;
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      Swal.fire("Erreur", err.message || "Impossible de démarrer la conversation.", "error");
    }
  };

  const handleRequestJoin = () => {
    if (!loggedInUser) {
      return Swal.fire("Connexion requise", "Connectez-vous pour envoyer une demande de colocation.", "warning");
    }

    if (loggedInUser.role !== 'etudiant' && loggedInUser.role !== 'admin') {
      return Swal.fire("Action non autorisée", "Seuls les étudiants peuvent postuler à une colocation.", "error");
    }

    Swal.fire({
      title: "Demande de colocation",
      input: "textarea",
      inputPlaceholder: "Présentez-vous en quelques mots au propriétaire...",
      inputAttributes: { rows: 4 },
      showCancelButton: true,
      confirmButtonText: "Envoyer la demande",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#10b981",
      preConfirm: (msg) => {
        if (!msg || !msg.trim()) {
          Swal.showValidationMessage("Veuillez écrire un message de motivation.");
          return false;
        }
        return msg.trim();
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        Swal.showLoading();
        const res = await fetchData(API_URLS.CONVERSATIONS, {
          method: "POST",
          body: JSON.stringify({
            id_destinataire: home.proprietaireId,
            contenu: `[Demande de colocation - ${home.title}]\n\n${result.value}`
          }),
        });
        Swal.close();
        const conversationId = res.id_conversation || res.data?.id_conversation;
        Swal.fire({
          title: "Envoyé !",
          text: "Votre demande a été envoyée. Redirection vers la discussion...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate(`/chat/${conversationId}`);
        });
      } catch (err) {
        Swal.fire("Erreur", err.message, "error");
      }
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
    <div className="mt-20 max-w-[1120px] mx-auto px-4 sm:px-6 py-8 font-poppins bg-[#fcfdff] text-[#0b1c30]">
      {/* HEADER NAVIGATION BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#10b981] transition-colors cursor-pointer self-start"
      >
        <FaArrowLeft className="text-[10px] shrink-0" /> Retour aux annonces
      </button>

      {/* GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="overflow-hidden rounded-[24px] h-[480px] shadow-sm hover:shadow-md transition-shadow relative">
          <img
            src={displayImages[0]}
            alt="Main Space"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
          />
        </div>
        <div className="grid grid-rows-2 gap-4 h-[480px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-[20px] h-full shadow-sm hover:shadow-md transition-shadow">
              <img
                src={displayImages[1]}
                alt="Kitchen Area"
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
              />
            </div>
            <div className="overflow-hidden rounded-[20px] h-full shadow-sm hover:shadow-md transition-shadow">
              <img
                src={displayImages[2]}
                alt="Exterior View"
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-[20px] h-full shadow-sm hover:shadow-md transition-shadow">
            <img
              src={displayImages[3]}
              alt="Living Room"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* HEADER */}
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

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Details & Map */}
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
                home.gender && { label: "Colocataires", value: home.gender === "femme" ? "Filles uniquement" : home.gender === "homme" ? "Garçons uniquement" : "Colocation Mixte" },
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
              <h3 className="font-extrabold text-slate-800 text-sm mb-4">Occupation actuelle</h3>
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <FaUsers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{currentOccupants} occupant{currentOccupants > 1 ? "s" : ""}</h4>
                  <span className="text-xs text-slate-400 font-semibold block mt-0.5">sur {maxCapacity} place{maxCapacity > 1 ? "s" : ""} disponibles</span>
                </div>
              </div>
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
              onClick={handleReportListing}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-bold mt-4 transition-colors cursor-pointer self-center"
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
