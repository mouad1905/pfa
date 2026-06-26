import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import API_BASE, { fetchData, API_URLS } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCheck,
  FaCommentAlt,
  FaFlag,
  FaClock,
  FaShareAlt,
  FaShieldAlt,
  FaUserPlus,
  FaEnvelope,
  FaExternalLinkAlt,
  FaWifi,
  FaBolt,
  FaTint,
  FaSnowflake,
  FaFire,
  FaUtensils,
  FaTshirt,
  FaParking,
  FaStar as FaStarFilled,
  FaRegStar as FaStarEmpty,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
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
  const furnitureLabel = item.meuble ? "Entièrement meublé" : "";
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
    posterPhoto: item.proprietaire?.photo_profil || null,
    proprietaireId: item.proprietaire?.id_user || item.id_createur,
    occupants: item.occupants || [],
    formule: item.formule || "standard",
    created_at: item.created_at,
    avgRating: item.avg_rating_hebergement || 0,
  };
};

const amenityIconMap = {
  wifi: FaWifi,
  electricity: FaBolt,
  eau: FaTint,
  water: FaTint,
  "air conditioning": FaSnowflake,
  climatisation: FaSnowflake,
  heating: FaFire,
  chauffage: FaFire,
  kitchen: FaUtensils,
  cuisine: FaUtensils,
  "washing machine": FaTshirt,
  "machine à laver": FaTshirt,
  parking: FaParking,
};

const getAmenityIcon = (name) => {
  const key = name.toLowerCase().trim();
  const Icon = amenityIconMap[key];
  return Icon ? <Icon className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />;
};

function HomeDetails() {
  const bustCache = (url, t) => {
    if (!url) return null;
    try { const u = new URL(url); u.searchParams.set("t", t || Date.now()); return u.toString(); } catch { return url; }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateHome = location.state;
  const [home, setHome] = useState(stateHome ? mapApiToHome(stateHome) : null);
  const [loading, setLoading] = useState(!stateHome && !!id);
  const { user: loggedInUser } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalEval, setTotalEval] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");

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

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/hebergements/${id}/evaluations`)
      .then(r => r.json())
      .then(data => {
        setAvgRating(data.avg_rating || 0);
        setTotalEval(data.total || 0);
        setEvaluations(data.evaluations || []);
        const mine = (data.evaluations || []).find(
          e => e.auteur?.id_user === loggedInUser?.id_user
        );
        if (mine) setUserRating(mine.note);
      })
      .catch(() => {});
  }, [id, loggedInUser?.id_user]);

  useEffect(() => {
    const sections = gsap.utils.toArray("[data-anim]");
    sections.forEach((section) => {
      const anim = section.getAttribute("data-anim");
      const items = section.querySelectorAll("[data-item]");
      if (anim === "stagger-fade-up" && items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1,
            scrollTrigger: { trigger: section, start: "top 82%" } }
        );
      }
      if (anim === "fade-up") {
        gsap.fromTo(section,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 82%" } }
        );
      }
    });
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  const googleMapsUrl = home?.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco&output=embed&z=15`
    : "";

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center mt-20">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium mt-4">Chargement de l'annonce...</p>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center mt-20">
        <p className="text-slate-400 text-sm">Logement non trouvé</p>
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
  const currentOccupants = Math.min(home.occupants?.length ?? home.occupancy ?? 0, maxCapacity);
  const spotsLeft = Math.max(0, maxCapacity - currentOccupants);

  const posterInitials = (home.poster || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire("Lien copié !", "Le lien de l'annonce a été copié dans le presse-papier.", "success");
    }).catch(() => {
      Swal.fire("Erreur", "Impossible de copier le lien.", "error");
    });
  };

  const handleRateHebergement = async (note) => {
    if (!loggedInUser) return Swal.fire("Connexion requise", "Connectez-vous pour évaluer.", "warning");
    if (userRating) return;
    if (!commentText.trim()) return Swal.fire("Commentaire requis", "Veuillez écrire un commentaire.", "warning");
    setUserRating(note);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/hebergements/${id}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ note, commentaire: commentText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUserRating(0);
        throw new Error(data.message || "Erreur");
      }
      const evalRes = await fetch(`${API_BASE}/hebergements/${id}/evaluations`);
      const evalData = await evalRes.json();
      setAvgRating(evalData.avg_rating || 0);
      setTotalEval(evalData.total || 0);
      setEvaluations(evalData.evaluations || []);
      setCommentText("");
      Swal.fire("Merci !", "Votre évaluation a été enregistrée.", "success");
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    } finally {
      setSubmitting(false);
    }
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
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await fetchData(`http://127.0.0.1:8000/api/signalements`, {
            method: "POST",
            body: JSON.stringify({
              id_cible: home.proprietaireId,
              id_hebergement: home.id,
              raison: "Problème d'annonce",
              details: result.value,
            }),
          });
          Swal.fire("Signalé", "L'annonce a été signalée aux modérateurs.", "success");
        } catch (err) {
          Swal.fire("Erreur", err.message || "Impossible de soumettre le signalement.", "error");
        }
      }
    });
  };

  const bentoImages = [...displayImages];

  const openGallery = (idx) => {
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4 mt-28 font-poppins text-slate-900">
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer mb-2"
      >
        <FaArrowLeft className="text-[18px]" />
        <span className="text-[10px] font-bold uppercase tracking-widest">RETOUR AUX ANNONCES</span>
      </button>

      {/* Bento Gallery */}
      <section data-anim="stagger-fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridTemplateRows: "repeat(2, minmax(0, 200px))" }}>
        <div data-item className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            src={bentoImages[0]}
            alt="Main"
            onClick={() => openGallery(0)}
          />
        </div>
        {bentoImages.slice(1, 5).map((img, idx) => (
          <div data-item key={idx} className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              src={img}
              alt={`Photo ${idx + 2}`}
              onClick={() => openGallery(idx + 1)}
            />
            {idx === 3 && bentoImages.length > 5 && (
              <button
                onClick={() => openGallery(5)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-black/60 transition"
              >
                +{bentoImages.length - 5} Voir tout
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl z-10 cursor-pointer hover:opacity-70"
          >
            <FaTimes />
          </button>
          <button
            onClick={() => setGalleryIndex((galleryIndex - 1 + bentoImages.length) % bentoImages.length)}
            className="absolute left-4 text-white text-3xl z-10 cursor-pointer hover:opacity-70"
          >
            <FaChevronLeft />
          </button>
          <img
            src={bentoImages[galleryIndex]}
            alt={`Photo ${galleryIndex + 1}`}
            className="max-w-full max-h-full object-contain px-16"
          />
          <button
            onClick={() => setGalleryIndex((galleryIndex + 1) % bentoImages.length)}
            className="absolute right-4 text-white text-3xl z-10 cursor-pointer hover:opacity-70"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-4 text-white text-sm font-medium">
            {galleryIndex + 1} / {bentoImages.length}
          </div>
        </div>
      )}

      {/* Property Header */}
      <section data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {home.type && (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[12px] font-bold uppercase">{home.type}</span>
            )}
            {home.studentsOnly && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-[12px] font-bold uppercase">STUDENTS ONLY</span>
            )}
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[12px] font-bold uppercase">{home.formule}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{home.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm flex-wrap">
            {home.location && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-[18px] text-emerald-600" />
                <span>{home.location}</span>
              </div>
            )}
            {home.created_at && (
              <div className="flex items-center gap-1">
                <FaClock className="text-[18px] text-emerald-600" />
                <span>Publiée le {new Date(home.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-emerald-600 px-6 py-4 rounded-xl text-center min-w-[180px]">
          <div className="text-white text-2xl font-black leading-tight">{home.priceNum} DH</div>
          <div className="text-emerald-200 text-[14px]">/ mois</div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amenities */}
          <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Aménagements inclus</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(home.amenities?.length > 0 ? home.amenities : ["WiFi", "Electricité", "Eau"]).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-emerald-600 text-lg">{getAmenityIcon(amenity)}</span>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{amenity}</div>
                    <div className="text-[12px] text-emerald-600">Inclus</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {home.description && (
            <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {home.description}
              </p>
            </div>
          )}

          {/* Specs Table */}
          <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {(() => {
              const specs = [
                home.area != null && { label: "SUPERFICIE", value: `${home.area} m²` },
                home.rooms != null && { label: "CHAMBRES", value: `${home.rooms}` },
                { label: "COLOCATAIRES", value: home.gender === "femme" ? "Filles uniquement" : home.gender === "homme" ? "Garçons uniquement" : "Colocation Mixte" },
                home.roomType && { label: "TYPE DE CHAMBRE", value: home.roomType },
                { label: "MEUBLÉ", value: home.meuble ? "Oui" : "Non" },
                maxCapacity > 0 && { label: "CAPACITÉ MAX", value: `${maxCapacity} étudiants` },
                currentOccupants > 0 && { label: "OCCUPÉ", value: `${currentOccupants} place${currentOccupants > 1 ? "s" : ""}` },
                home.studentsOnly && { label: "ÉTUDIANTS SEULEMENT", value: "Oui" },
              ].filter(Boolean);
              return specs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-slate-200">
                  {specs.map((spec, idx) => (
                    <div key={idx} className={`p-4 ${idx % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{spec.label}</div>
                      <div className="font-bold text-slate-900">{spec.value}</div>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          {/* House Rules */}
          {home.rules?.length > 0 && (
            <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Règles de la maison</h3>
              <div className="flex flex-wrap gap-3">
                {home.rules.map((rule, idx) => (
                  <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          {home.location && (
            <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-bold mb-4">Localisation</h3>
              </div>
              <div className="relative h-[400px] border-t border-slate-200">
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded shadow-md border border-slate-200 flex items-center gap-2 text-emerald-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  <FaExternalLinkAlt className="text-[14px]" />
                  Ouvrir dans Maps
                </a>
                <iframe
                  title="Carte"
                  src={googleMapsUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Availability */}
          <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">DISPONIBILITÉ</span>
              <span className="text-emerald-600 font-bold text-sm">{spotsLeft}/{maxCapacity} places</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${maxCapacity > 0 ? (spotsLeft / maxCapacity) * 100 : 0}%` }} />
            </div>
            <div className="text-[12px] text-slate-500">Occupation actuelle ({currentOccupants}/{maxCapacity})</div>
            {home.occupants?.length > 0 ? (
              <div className="space-y-2">
                {home.occupants.map((occ) => (
                  <div key={occ.id_user} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={bustCache(occ.photo_profil) || `https://ui-avatars.com/api/?name=${encodeURIComponent((occ.prenom||'')+' '+(occ.nom||''))}&background=10b981&color=fff&size=40&bold=true`}
                      alt={occ.prenom}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-800 truncate">{occ.prenom} {occ.nom}</div>
                      <div className="text-[12px] text-slate-500">Occupant</div>
                    </div>
                    <button
                      type="button"
                      title={`Contacter ${occ.prenom}`}
                      onClick={async () => {
                        try {
                          const res = await fetchData(API_URLS.CONVERSATIONS, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id_destinataire: occ.id_user }),
                          });
                          const convId = res.id_conversation || res.data?.id_conversation;
                          if (convId) navigate(`/chat/${convId}`);
                        } catch {}
                      }}
                      className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <FaCommentAlt size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-slate-500 italic">Aucun occupant actuellement</div>
            )}
          </div>

          {/* Owner Profile */}
          <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="relative">
                {home.posterPhoto ? (
                  <img className="w-12 h-12 rounded-full object-cover" src={bustCache(home.posterPhoto)} alt="" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                    {posterInitials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                  <FaCheck className="text-[10px]" />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold leading-tight">{home.poster || "Propriétaire"}</div>
                <div className="text-slate-500 text-sm">Propriétaire</div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
              <FaShieldAlt className="text-emerald-600 shrink-0" />
              <div className="text-[12px] leading-snug">
                <span className="font-bold text-emerald-700">Annonce vérifiée</span><br />
                <span className="text-slate-500">Logement authentifié par UniConnect</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleRequestJoin}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FaUserPlus />
                Demander à rejoindre
              </button>
              <button
                onClick={handleContactOwner}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FaEnvelope />
                Contacter le propriétaire
              </button>
              <button
                onClick={handleShare}
                className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FaShareAlt />
                Partager
              </button>
            </div>
            <button
              onClick={handleReportListing}
              className="w-full py-2 text-red-500 text-[12px] font-bold flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent"
            >
              <FaFlag className="text-[16px]" />
              Signaler l'annonce
            </button>
          </div>

          {/* Rating */}
          <div data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">ÉVALUATION DU LOGEMENT</h3>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-slate-200">
                    <FaStarEmpty />
                  </span>
                ))}
              </div>
              <span className="text-slate-500 text-sm italic">
                {avgRating > 0 ? `${avgRating.toFixed(1)} / 5 (${totalEval} avis)` : "Aucune évaluation"}
              </span>
            </div>
            {!userRating && loggedInUser && (
              <>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={!!userRating || submitting}
                      onClick={() => handleRateHebergement(star)}
                      onMouseEnter={() => !userRating && setHoverRating(star)}
                      onMouseLeave={() => !userRating && setHoverRating(0)}
                      className={`text-lg transition-colors ${
                        userRating ? "cursor-default" : "cursor-pointer"
                      } ${(hoverRating || userRating) >= star ? "text-amber-400" : "text-slate-200"}`}
                    >
                      {(hoverRating || userRating) >= star ? <FaStarFilled /> : <FaStarEmpty />}
                    </button>
                  ))}
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  placeholder="Écrire un commentaire..."
                  rows={3}
                />
                <div className="text-center text-[11px] text-slate-400 italic">Cliquez sur une étoile pour publier</div>
              </>
            )}
            {userRating > 0 && (
              <p className="text-[12px] text-emerald-600 font-bold text-center">Votre note : {userRating}/5</p>
            )}
            {evaluations.length > 0 && (
              <div className="max-h-36 overflow-y-auto space-y-2">
                {evaluations.map((ev) => (
                  <div key={ev.id_evaluation} className="bg-slate-50 rounded-xl p-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => navigate(`/profile/${ev.auteur?.id_user}`)}
                        className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 hover:ring-2 hover:ring-emerald-300 transition-all cursor-pointer overflow-hidden"
                      >
                        {ev.auteur?.photo_profil ? (
                          <img src={bustCache(ev.auteur.photo_profil)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          ((ev.auteur?.prenom?.[0] || "") + (ev.auteur?.nom?.[0] || "")).toUpperCase()
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/profile/${ev.auteur?.id_user}`)}
                        className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {ev.auteur ? `${ev.auteur.prenom} ${ev.auteur.nom}` : "Anonyme"}
                      </button>
                      <span className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStarFilled key={s} className={`w-2.5 h-2.5 ${s <= ev.note ? "text-amber-400" : "text-slate-200"}`} />
                        ))}
                      </span>
                    </div>
                    {ev.commentaire && (
                      <p className="text-[11px] text-slate-500 leading-relaxed">{ev.commentaire}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDetails;
