import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API_BASE_URL, { fetchData } from "../../api/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCheck,
  FaSpinner,
  FaTrashAlt,
  FaBan,
  FaClock,
  FaShareAlt,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaWifi,
  FaBolt,
  FaTint,
  FaSnowflake,
  FaFire,
  FaUtensils,
  FaTshirt,
  FaParking,
  FaCheck as FaCheckIcon
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
    statut: item.statut,
    image: item.image,
    images: item.images?.length ? item.images : item.image ? [item.image] : [],
    description: item.description || "",
    poster: `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() || "Propriétaire",
    posterPhoto: item.proprietaire?.photo_profil || null,
    proprietaireId: item.proprietaire?.id_user || item.id_createur,
    occupants: item.occupants || [],
    formule: item.formule || "standard",
    created_at: item.created_at,
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
  return Icon ? <Icon className="w-4 h-4" /> : <FaCheckIcon className="w-4 h-4" />;
};

const AdminHomeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchData(`${API_BASE_URL}/admin/hebergements/${id}`);
        const item = result.data || result;
        setHome(mapApiToHome(item));
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Impossible de charger cette annonce.", "error");
        navigate("/admin/manage-homes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

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

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      await fetchData(`${API_BASE_URL}/admin/hebergements/${id}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatus })
      });
      setHome(prev => ({ ...prev, statut: newStatus }));
      const label = newStatus === "valide" ? "approuvée" : "rejetée";
      Swal.fire("Succès", `L'annonce a été ${label}.`, "success");
    } catch (err) {
      Swal.fire("Erreur", `Erreur de mise à jour: ${err.message}`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Supprimer cet hébergement définitivement ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    });
    if (!result.isConfirmed) return;
    setActionLoading(true);
    try {
      await fetchData(`${API_BASE_URL}/admin/hebergements/${id}`, {
        method: "DELETE"
      });
      Swal.fire("Succès", "Hébergement supprimé avec succès.", "success");
      navigate("/admin/manage-homes");
    } catch (err) {
      Swal.fire("Erreur", `Erreur de suppression: ${err.message}`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "valide":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Validé
          </span>
        );
      case "rejete":
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Rejeté
          </span>
        );
      case "en_attente":
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1 w-max animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> En attente
          </span>
        );
    }
  };

  const displayImages = [];
  if (home && home.image) {
    displayImages.push(home.image);
  }
  if (home && Array.isArray(home.images) && home.images.length > 0) {
    displayImages.push(...home.images);
  }

  const googleMapsUrl = home?.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(home.location)},+Morocco&output=embed&z=15`
    : "";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl mb-4" />
        <p className="text-slate-500 font-medium">Chargement de l'annonce...</p>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400">Annonce non trouvée</p>
      </div>
    );
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

  const bentoImages = [...displayImages];
  while (bentoImages.length < 5) {
    bentoImages.push(bentoImages[0] || "");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4 font-poppins text-slate-900">
      {/* Back + Status + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/manage-homes")}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-[18px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">RETOUR À LA LISTE</span>
          </button>
          {getStatusBadge(home.statut)}
        </div>
        <div className="flex gap-2">
          {home.statut !== "valide" && (
            <button
              onClick={() => handleUpdateStatus("valide")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Approuver
            </button>
          )}
          {home.statut !== "rejete" && (
            <button
              onClick={() => handleUpdateStatus("rejete")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? <FaSpinner className="animate-spin" /> : <FaBan />}
              Rejeter
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
          >
            <FaTrashAlt /> Supprimer
          </button>
        </div>
      </div>

      {/* Bento Gallery */}
      <section data-anim="stagger-fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridTemplateRows: "repeat(2, minmax(0, 200px))" }}>
        <div data-item className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <img
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            src={bentoImages[0]}
            alt="Main"
          />
        </div>
        {bentoImages.slice(1, 5).map((img, idx) => (
          <div data-item key={idx} className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              src={img}
              alt={`Photo ${idx + 2}`}
            />
          </div>
        ))}
      </section>

      {/* Property Header */}
      <section data-anim="fade-up" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
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
                  title="Location Map"
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
                      src={occ.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent((occ.prenom||'')+' '+(occ.nom||''))}&background=10b981&color=fff&size=40&bold=true`}
                      alt={occ.prenom}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-800 truncate">{occ.prenom} {occ.nom}</div>
                      <div className="text-[12px] text-slate-500">Occupant</div>
                    </div>
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
                  <img className="w-12 h-12 rounded-full object-cover" src={home.posterPhoto} alt="" />
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
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  Swal.fire("Lien copié !", "Le lien de l'annonce a été copié.", "success");
                }}
                className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FaShareAlt />
                Partager
              </button>
              <button
                onClick={() => navigate("/admin/manage-homes")}
                className="w-full py-3 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all text-sm cursor-pointer bg-white"
              >
                ← Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeDetail;
