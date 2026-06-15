import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { fetchData, API_URLS } from "../../api/api";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCouch,
  FaCheck,
  FaCommentAlt,
  FaFlag,
  FaUsers
} from "react-icons/fa";

// Geolocation mapper to retrieve realistic coordinates for Moroccan cities/neighborhoods
const getCoordinates = (locationText) => {
  const query = (locationText || "").toLowerCase();
  // Standard Rabat locations
  if (query.includes("agdal")) return [33.9980, -6.8521];
  if (query.includes("hay riad") || query.includes("riad")) return [33.9667, -6.8778];
  if (query.includes("ocean") || query.includes("océan")) return [34.0250, -6.8450];
  if (query.includes("souissi")) return [33.9780, -6.8290];
  if (query.includes("takaddoum")) return [33.9910, -6.8120];
  if (query.includes("qamra") || query.includes("kamra")) return [34.0040, -6.8590];
  if (query.includes("rabat")) return [34.020882, -6.841650];
  // Casablanca locations
  if (query.includes("casablanca") || query.includes("casa")) {
    if (query.includes("maarif") || query.includes("maârif")) return [33.5833, -7.6333];
    if (query.includes("gauthier")) return [33.5900, -7.6250];
    if (query.includes("sidi maarouf") || query.includes("sidi maârouf")) return [33.5290, -7.6410];
    return [33.5731, -7.5898];
  }
  // Marrakech
  if (query.includes("marrakech") || query.includes("kech")) return [31.6295, -7.9811];
  // Tangier
  if (query.includes("tanger") || query.includes("tangier")) return [35.7595, -5.8340];
  // Fes
  if (query.includes("fes") || query.includes("fès")) return [34.0181, -5.0078];
  // Default to Rabat Agdal if empty
  return [33.9980, -6.8521];
};

const mapApiToHome = (item) => {
  let parsed = { rules: [], amenities: [], furniture: "Fully Furnished", occupancy: 1, maxCapacity: parseInt(item.nbr_chambres) || 1 };
  if (item.reglement) {
    try {
      const data = JSON.parse(item.reglement);
      if (data && typeof data === "object" && (data.rules || data.amenities)) {
        parsed = { ...parsed, ...data };
      } else {
        parsed.rules = item.reglement.split(",").map((r) => r.trim()).filter(Boolean);
      }
    } catch {
      parsed.rules = item.reglement.split(",").map((r) => r.trim()).filter(Boolean);
    }
  }
  return {
    id: item.id_hebergement,
    title: item.titre || `${item.type} - ${item.localisation}`,
    price: `${item.prix} MAD`,
    priceNum: parseFloat(item.prix),
    location: item.localisation,
    rooms: item.nbr_chambres,
    area: item.superficie,
    type: item.type,
    roomType: item.type_chambre || "Chambre",
    gender: item.genre_colocataires || "mixte",
    rules: parsed.rules,
    amenities: parsed.amenities,
    furniture: parsed.furniture,
    occupancy: parsed.occupancy,
    maxCapacity: parsed.maxCapacity,
    image: item.image,
    images: item.images?.length ? item.images : item.image ? [item.image] : [],
    description: item.description,
    poster:
      `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() ||
      "Propriétaire",
  };
};

function HomeDetails() {
  const { state: stateHome } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
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

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!home || !window.L || !mapContainerRef.current) return;

    const coords = getCoordinates(home.location || "");

    // Clean up any existing map instance before creating a new one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        center: coords,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      window.L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);

      const emeraldIcon = window.L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="relative w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg">
            <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          </div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker(coords, { icon: emeraldIcon }).addTo(mapInstanceRef.current);

      const displayLocation = home.location || "Rabat";
      const displayTitle = home.title || "Colocation Étudiante";
      const displayPrice = home.price || "Non renseigné";

      marker.bindPopup(`
        <div class="p-2 font-poppins text-left min-w-[150px]">
          <p class="text-xs font-black text-slate-800 uppercase tracking-wide mb-0.5">${displayTitle}</p>
          <p class="text-[10px] font-bold text-emerald-650 mb-1">📍 ${displayLocation}</p>
          <p class="text-[10px] font-bold text-slate-800 mb-1">💰 ${displayPrice} DH / mois</p>
          <p class="text-[9px] text-slate-500 font-semibold leading-normal">Colocation vérifiée par UniConnect.</p>
        </div>
      `, {
        closeButton: false,
        offset: [0, -5]
      }).openPopup();
    } catch (err) {
      console.error("Error initializing Leaflet map in InfoHome:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [home]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 mt-20">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!home)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 mt-20">
        <p className="text-stone-400 text-sm tracking-wide">
          Logement non trouvé
        </p>
      </div>
    );

  // Dynamic image construction with high-fidelity premium fallbacks matching green/wood color vibes
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

  // Parse details
  const cleanPriceNum = (() => {
    if (home.priceNum) return home.priceNum;
    const num = parseFloat(home.price);
    return !isNaN(num) ? num : 1800;
  })();

  const posterInitials = (home.poster || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const maxCapacity = home.maxCapacity || parseInt(home.rooms) || 4;
  const spotsLeft = Math.max(0, maxCapacity - (home.occupancy || 1));
  const progressPercent = Math.min(100, (spotsLeft / maxCapacity) * 100);

  // Alerts
  const handleRequestJoin = () => {
    Swal.fire({
      title: "Demande envoyée !",
      text: "Votre demande de colocation a été transmise avec succès au propriétaire.",
      icon: "success",
      confirmButtonColor: "#10b981",
    });
  };

  const handleContactOwner = () => {
    Swal.fire({
      title: "Contacter le propriétaire",
      text: `Vous pouvez joindre ${home.poster || "le propriétaire"} par messagerie instantanée ou par e-mail.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Envoyer un message",
      cancelButtonText: "Retour",
      confirmButtonColor: "#10b981",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Envoyé", "Votre message a été envoyé !", "success");
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
        <FaArrowLeft className="text-[10px] shrink-0" /> Back to Listings
      </button>

      {/* GALLERY — Asymmetric multi-image high-fidelity grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Left Large Portrait Block */}
        <div className="overflow-hidden rounded-[24px] h-[480px] shadow-sm hover:shadow-md transition-shadow relative">
          <img
            src={displayImages[0]}
            alt="Main Space"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
          />
        </div>

        {/* Right Split Rows */}
        <div className="grid grid-rows-2 gap-4 h-[480px]">
          {/* Top Row: Side by Side */}
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

          {/* Bottom Row: Wide Landscape */}
          <div className="overflow-hidden rounded-[20px] h-full shadow-sm hover:shadow-md transition-shadow">
            <img
              src={displayImages[3]}
              alt="Living Room"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-8 gap-4">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-2">
            {home.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm">
            <FaMapMarkerAlt className="w-4 h-4 shrink-0 text-slate-350" />
            <span>{home.location}</span>
          </div>
        </div>

        {/* Big Premium Green Price Badge */}
        <div className="bg-[#10b981] text-white rounded-[20px] px-6 py-4 flex flex-col items-center justify-center min-w-[170px] text-center shadow-sm w-full md:w-auto self-stretch md:self-auto">
          <span className="text-2xl font-black">{cleanPriceNum} DH</span>
          <span className="text-[10px] font-bold opacity-90 mt-0.5 leading-tight uppercase tracking-wider">
            / month per student
          </span>
        </div>
      </div>

      {/* TWO-COLUMN DETAIL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PROPERTY HIGHLIGHTS & MAP */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Highlights Bento Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-5 text-left">
              KEY AMENITIES INCLUDED
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-left">
              {(home.amenities?.length > 0 ? home.amenities : ["WiFi", "Electricity", "Water"]).map((amenity, idx) => (
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

            {home.furniture && (
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

            {/* Dynamic Description Area */}
            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-5 mt-2 text-left">
              {home.description}
            </p>

            {/* Dynamic Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-100/50 p-4 rounded-2xl mt-6 text-left">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Superficie</span>
                <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">{home.area || "—"} m²</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Chambres</span>
                <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">{home.rooms || "—"} Chambres</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Colocataires</span>
                <span className="text-sm font-extrabold text-slate-800 capitalize mt-0.5 block">
                  {home.gender === "girls" || home.gender === "femme" || home.gender === "female" ? "Filles uniquement" : home.gender === "boys" || home.gender === "homme" || home.gender === "male" ? "Garçons uniquement" : "Colocation Mixte"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Lit</span>
                <span className="text-sm font-extrabold text-slate-800 truncate block mt-0.5">{home.roomType || "Individuelle"}</span>
              </div>
            </div>

            {/* Dynamic House Rules Section */}
            {home.rules?.length > 0 && (
              <div className="border-t border-slate-100 pt-5 mt-6 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                  HOUSE RULES & PREFERENCES
                </span>
                <div className="flex flex-wrap gap-2">
                  {home.rules.map((rule, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-[#10b981] border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Styled Map Location Bento Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">
              LOCATION
            </span>
            <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-100 border border-slate-100 shadow-inner z-10">
              {/* Live interactive Leaflet Map container */}
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0 animate-in fade-in duration-300" />
              
              {/* Safe CDN loading fallback overlay */}
              {!window.L && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                  <span className="text-xs font-bold font-poppins">Chargement de la carte interactive...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AVAILABILITY & CTAs */}
        <div className="space-y-6">
          
          {/* Availability Status Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                AVAILABILITY
              </span>
              <span className="bg-emerald-50 text-[#10b981] px-3 py-1 rounded-full text-[10px] font-extrabold">
                {spotsLeft}/{maxCapacity} Places left
              </span>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
              <div className="bg-[#10b981] h-full rounded-full transition-all duration-550" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Current Occupancy section */}
            <div className="text-left">
              <h3 className="font-extrabold text-slate-800 text-sm mb-4">Current Occupancy</h3>
              
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <FaUsers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{home.occupancy || 1} occupant{home.occupancy > 1 ? "s" : ""}</h4>
                  <span className="text-xs text-slate-400 font-semibold block mt-0.5">sur {maxCapacity} place{maxCapacity > 1 ? "s" : ""} disponibles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Owner Widget */}
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
              <h4 className="font-extrabold text-slate-800 text-sm">{home.poster || "Verified Owner"}</h4>
              <span className="text-xs text-slate-400 font-semibold block mt-0.5">Propriétaire Vérifié • Member since 2022</span>
            </div>
          </div>

          {/* Direct CTA Buttons Container */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRequestJoin}
              className="w-full bg-[#10b981] hover:bg-[#0b9062] active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Request to Join
            </button>
            <button
              onClick={handleContactOwner}
              className="w-full border-2 border-[#10b981] hover:bg-emerald-50/50 active:scale-[0.98] text-[#10b981] py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <FaCommentAlt className="w-4 h-4 shrink-0" />
              Contact Owner
            </button>

            {/* Report Listing link */}
            <button
              onClick={handleReportListing}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-bold mt-4 transition-colors cursor-pointer self-center"
            >
              <FaFlag className="w-3.5 h-3.5 shrink-0" />
              Report Listing
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HomeDetails;
