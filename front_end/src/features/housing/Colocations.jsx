import { useState, useEffect, useMemo, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useNavigate, Link } from "react-router-dom";
import API_BASE, { API_URLS, fetchData } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { filters } from "../../data/filtersData";
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

// ── Card ─────────────────────────────────────────────────────────────────────
const ColocationCard = ({ c, onClick, isFavori, onToggleFavori }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const images = (() => {
    const result = [];
    if (c.image) result.push(c.image);
    if (Array.isArray(c.images) && c.images.length > 0)
      result.push(...c.images);
    return result;
  })();

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const spotsText =
    c.maxCapacity > 0
      ? `${c.occupancy}/${c.maxCapacity} spots`
      : `${c.occupancy} occupé`;

  // Formatting price DH / MO
  const priceDisplay = (() => {
    if (c.priceNum) {
      return `${c.priceNum} DH / M`;
    }
    const num = parseFloat(c.price);
    return !isNaN(num) ? `${num} DH / M` : `${c.price} / M`;
  })();

  const displayTags = (() => {
    if (Array.isArray(c.rules) && c.rules.length > 0) {
      return c.rules
        .map((r) => {
          const ruleLower = r.toLowerCase();
          if (ruleLower.includes("fumeur")) return "NO SMOKING";
          if (ruleLower.includes("calme") || ruleLower.includes("bruit"))
            return "QUIET ZONE";
          if (ruleLower.includes("animaux")) return "PETS ALLOWED";
          if (ruleLower.includes("étude") || ruleLower.includes("etude"))
            return "STUDY FRIENDLY";
          if (ruleLower.includes("wifi")) return "WIFI INCLUDED";
          return r.toUpperCase();
        })
        .slice(0, 3);
    }
    const genre =
      c.gender === "femme"
        ? "FEMALE ONLY"
        : c.gender === "homme"
          ? "MALE ONLY"
          : "MIXED";
    const meuble = c.meuble ? "FULLY FURNISHED" : "";
    return [genre, meuble, c.type?.toUpperCase()].filter(Boolean).slice(0, 3);
  })();

  const displayRating = c.avgRating > 0 ? c.avgRating.toFixed(1) : null;

  return (
    <div
      onClick={onClick}
      data-item
      className={`group bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-4 font-poppins relative`}
    >
      {/* Visual Header / Image Container with exact overlays */}
      <div className="relative h-52 overflow-hidden rounded-[18px] bg-slate-100 shadow-inner flex items-center justify-center">
        {/* Animated Stacked Carousel Images or Landscape Placeholder */}
        {images && images.length > 0 && images[0] ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={c.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                idx === activeSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            />
          ))
        ) : (
          /* Landscape Placeholder matching user's image exactly */
          <div className="w-full h-full bg-gradient-to-br from-slate-200/60 via-slate-350/40 to-slate-400/30 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/20 flex items-center justify-center text-slate-450">
              <svg
                className="w-9 h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Dynamic Badges Overlay */}
        {/* Top Left: AVAILABLE NOW with pulsing green dot */}
        <div className="absolute top-3.5 left-3.5 bg-white rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm border border-slate-100/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 text-[9px] font-extrabold uppercase tracking-wide">
            AVAILABLE NOW
          </span>
        </div>

        {/* Top Right: Rent Price Badge */}
        <div className="absolute top-3.5 right-3.5 bg-[#0f9669] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
          {priceDisplay}
        </div>

        {/* Bottom Left: Distance from campus */}
        <div className="absolute bottom-3.5 left-3.5 bg-black/45 backdrop-blur-xs text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
          {c.location || "Logement"}
        </div>

        {/* Carousel Slider Arrows (only visible on hover) */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              onClick={prevSlide}
              className="w-7 h-7 rounded-full bg-white/95 backdrop-blur border border-slate-100 shadow flex items-center justify-center text-slate-700 hover:scale-105 active:scale-95 hover:bg-white transition-all pointer-events-auto cursor-pointer"
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              onClick={nextSlide}
              className="w-7 h-7 rounded-full bg-white/95 backdrop-blur border border-slate-100 shadow flex items-center justify-center text-slate-700 hover:scale-105 active:scale-95 hover:bg-white transition-all pointer-events-auto cursor-pointer"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        )}

        {/* Bullet Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(i);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "bg-[#10b981] w-3" : "bg-white/60 w-1"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="px-1.5 pb-1 flex flex-col justify-between flex-1">
        <div className="text-left">
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-[18px] leading-snug tracking-tight truncate mt-3.5 mb-1 group-hover:text-[#0f9669] transition-colors duration-300">
            {c.title}
          </h3>

          {/* Location details */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-3">
            <FaMapMarkerAlt className="text-slate-350 shrink-0" size={13} />
            <span className="truncate">{c.location}</span>
          </div>

          {/* Capacity Text */}
          <div className="text-[11px] ml-1 font-extrabold text-slate-700 uppercase tracking-wide mb-2.5">
            {spotsText}
          </div>

          {/* Elegant Tinted Green Tag Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayTags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#edfdf6] text-[#0f9669] border border-[#d2fae6] px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Rating & View Details row */}
        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-slate-100/80">
          {/* Rating and Favorite */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {displayRating ? (
                <>
                  <span className="text-amber-400 text-base">★</span>
                  <span className="text-slate-800 text-sm font-bold">
                    {displayRating}
                  </span>
                </>
              ) : (
                <span className="text-slate-400 text-[11px] font-semibold">
                  Nouveau
                </span>
              )}
            </div>
            {/* Favorite Heart Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavori(c.id);
              }}
              className={`p-1 rounded-lg transition-all active:scale-90 cursor-pointer border-none ${
                isFavori ? "text-red-500" : "text-slate-400 hover:text-red-400"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill={isFavori ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </button>
          </div>

          {/* Exact screenshot-style Green Button */}
          <button className="bg-[#0f9669] hover:bg-[#0b6c49] text-white text-[12px] font-bold px-5 py-2.5 rounded-[10px] shadow-sm hover:shadow-md transition-all active:scale-[0.97] cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Constants ─────────────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { id: "all_prices", label: "Tous les prix" },
  { id: "0-1500", label: "< 1 500 MAD" },
  { id: "1500-3000", label: "1 500 – 3 000 MAD" },
  { id: "3000-5000", label: "3 000 – 5 000 MAD" },
  { id: "5000+", label: "> 5 000 MAD" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Par défaut" },
  { id: "price_asc", label: "Prix croissant" },
  { id: "price_desc", label: "Prix décroissant" },
  { id: "newest", label: "Les plus récents" },
];

// ── Select helper ─────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, options, defaultId }) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.id === value)?.label || "Select";

  return (
    <div className="relative min-w-[180px]">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all duration-200 active:scale-[0.98]
        ${
          value !== defaultId
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 shadow-sm"
        }`}
      >
        <span className="text-xs font-bold truncate">{selectedLabel}</span>

        <FaChevronDown
          className={`text-[10px] transition-transform ${open ? "rotate-180" : ""} ${value !== defaultId ? "text-emerald-500" : "text-slate-400"}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition hover:bg-emerald-50 ${
                value === o.id
                  ? "text-emerald-700 bg-emerald-50/50"
                  : "text-slate-600"
              }`}
            >
              {o.label}

              {value === o.id && (
                <span className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
                  <FaCheck className="text-emerald-600 text-[10px]" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Colocations = () => {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all_prices");
  const [roomFilter, setRoomFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [colocations, setColocations] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [favoris, setFavoris] = useState([]);
  const [favoriFilter, setFavoriFilter] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(API_URLS.HEBERGEMENTS);
        const mappedData = result.data.map((item) => ({
          id: item.id_hebergement,
          title: item.titre || `${item.type} - ${item.localisation}`,
          price: `${item.prix} MAD`,
          priceNum: parseFloat(item.prix),
          location: item.localisation,
          rooms: item.nbr_chambres,
          maxCapacity: item.max_capacity ?? 0,
          occupancy: item.nb_locataires ?? 0,
          area: item.superficie,
          type: item.type,
          roomType: item.type_chambre || "Chambre",
          gender: item.genre_colocataires || "mixte",
          rules: (() => {
            if (!item.reglement) return [];
            try {
              const parsed =
                typeof item.reglement === "string"
                  ? JSON.parse(item.reglement)
                  : item.reglement;
              return Array.isArray(parsed) ? parsed : parsed.rules || [];
            } catch {
              return item.reglement
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean);
            }
          })(),
          image: item.image || null,
          images: (() => {
            if (item.images) {
              try {
                const parsed =
                  typeof item.images === "string"
                    ? JSON.parse(item.images)
                    : item.images;
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
              } catch {
                // Ignore parse errors
              }
            }
            if (item.image) return [item.image];
            return [];
          })(),
          poster:
            `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() ||
            "Propriétaire",
          id_poster: item.proprietaire?.id_user,
          description: item.description,
          avgRating: item.avg_rating_hebergement || 0,
          meuble: item.meuble ?? false,
        }));
        setColocations(mappedData);
      } catch (error) {
        console.error("Error fetching colocations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchFavoris = async () => {
      try {
        const res = await fetch(`${API_BASE}/favoris`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) setFavoris(await res.json());
      } catch {}
    };
    fetchFavoris();
  }, [isAuthenticated]);

  const toggleFavori = async (hebergementId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/favoris/${hebergementId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.favori) {
          setFavoris((prev) => [...prev, hebergementId]);
        } else {
          setFavoris((prev) => prev.filter((id) => id !== hebergementId));
        }
      }
    } catch {}
  };

  // Build room options dynamically from data
  const roomOptions = useMemo(() => {
    const counts = [
      ...new Set(colocations.map((c) => c.rooms).filter(Boolean)),
    ].sort((a, b) => a - b);
    return [
      { id: "all", label: "Toutes chambres" },
      ...counts.map((r) => ({
        id: String(r),
        label: `${r} chambre${r > 1 ? "s" : ""}`,
      })),
    ];
  }, [colocations]);

  const visible = useMemo(() => {
    let result = [...colocations];

    if (active === "budget") result = result.filter((c) => c.priceNum < 3000);

    // Full-text search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.poster?.toLowerCase().includes(q),
      );
    }

    // Price range
    if (priceRange !== "all_prices") {
      result = result.filter((c) => {
        const p = c.priceNum;
        if (priceRange === "0-1500") return p < 1500;
        if (priceRange === "1500-3000") return p >= 1500 && p < 3000;
        if (priceRange === "3000-5000") return p >= 3000 && p < 5000;
        if (priceRange === "5000+") return p >= 5000;
        return true;
      });
    }

    // Rooms
    if (roomFilter !== "all") {
      result = result.filter((c) => String(c.rooms) === roomFilter);
    }

    if (favoriFilter) {
      result = result.filter((c) => favoris.includes(c.id));
    }

    if (sortBy === "price_asc") result.sort((a, b) => a.priceNum - b.priceNum);
    else if (sortBy === "price_desc")
      result.sort((a, b) => b.priceNum - a.priceNum);

    return result;
  }, [
    colocations,
    active,
    search,
    priceRange,
    roomFilter,
    sortBy,
    favoriFilter,
    favoris,
  ]);

  const activeFilterCount = [
    search.trim() !== "",
    priceRange !== "all_prices",
    roomFilter !== "all",
    sortBy !== "default",
    active !== "all",
    favoriFilter,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch("");
    setPriceRange("all_prices");
    setRoomFilter("all");
    setSortBy("default");
    setActive("all");
    setFavoriFilter(false);
  };

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

  return (
    <section className="min-h-screen bg-gray-100 py-4 mt-32 px-4 sm:px-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ── */}
        <div data-anim="fade-up" className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
          <h1 className="text-4xl font-extrabold text-[#0b1c30] leading-tight tracking-tight">
            Annonces <span className="text-emerald-600">Colocation</span>
          </h1>

          {(!isAuthenticated || user?.role === "locateur" || user?.role === "proprietaire") && (
            <div>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/register/locateur");
                  } else {
                    navigate("/addHouse");
                  }
                }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
              >
                <FaHome />
                Ajouter une annonce
              </button>
            </div>
          )}
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FaSearch />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, quartier, description…"
            className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-700 transition"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* ── FILTER ROW ── */}
        <div className="flex  flex-wrap items-center gap-3 mb-4">
          {/* Zone quick filters */}
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
            {filters.map((f) => {
              const Icon = f.icon;

              return f.disabled ? (
                <div
                  key={f.id}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-300 cursor-not-allowed select-none"
                  title="Bientôt disponible"
                >
                  <Icon className="text-sm" />
                  {f.label}
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-sm">
                    BIENTÔT
                  </span>
                </div>
              ) : (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.97] ${
                    active === f.id
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <Icon className="text-sm" />
                  {f.label}
                </button>
              );
            })}
          </div>

          <FilterSelect
            value={priceRange}
            onChange={setPriceRange}
            options={PRICE_RANGES}
            defaultId="all_prices"
          />
          <FilterSelect
            value={roomFilter}
            onChange={setRoomFilter}
            options={roomOptions}
            defaultId="all"
          />
          <FilterSelect
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
            defaultId="default"
          />

          {/* Favoris toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setFavoriFilter((p) => !p)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.97] ${
                favoriFilter
                  ? "bg-red-50 border border-red-200 text-red-600"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={favoriFilter ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              Favoris
            </button>
          )}
        </div>

        {/* ── ACTIVE FILTER TAGS ── */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2.5 mb-6 overflow-x-auto scrollbar-thin">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition shrink-0 border-none cursor-pointer"
            >
              <FaTimes className="text-[9px]" />
              Effacer ({activeFilterCount})
            </button>
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {search}
                <button
                  onClick={() => setSearch("")}
                  className="w-4 h-4 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 transition"
                >
                  <FaTimes className="text-[7px]" />
                </button>
              </span>
            )}
            {priceRange !== "all_prices" && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {PRICE_RANGES.find((r) => r.id === priceRange)?.label}
                <button
                  onClick={() => setPriceRange("all_prices")}
                  className="w-4 h-4 rounded bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center text-emerald-600 transition"
                >
                  <FaTimes className="text-[7px]" />
                </button>
              </span>
            )}
            {roomFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {roomOptions.find((r) => r.id === roomFilter)?.label}
                <button
                  onClick={() => setRoomFilter("all")}
                  className="w-4 h-4 rounded bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center text-emerald-600 transition"
                >
                  <FaTimes className="text-[7px]" />
                </button>
              </span>
            )}
            {sortBy !== "default" && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                <button
                  onClick={() => setSortBy("default")}
                  className="w-4 h-4 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 transition"
                >
                  <FaTimes className="text-[7px]" />
                </button>
              </span>
            )}
            {active !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {filters.find((f) => f.id === active)?.label}
                <button
                  onClick={() => setActive("all")}
                  className="w-4 h-4 rounded bg-blue-200 hover:bg-blue-300 flex items-center justify-center text-blue-600 transition"
                >
                  <FaTimes className="text-[7px]" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── GRID or EMPTY STATE ── */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Essayez d'ajuster vos filtres ou votre recherche.
            </p>
            <button
              onClick={clearAll}
              className="bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-gray-900 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div data-anim="stagger-fade-up" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((c) => (
              <ColocationCard
                key={c.id}
                c={c}
                isFavori={favoris.includes(c.id)}
                onToggleFavori={toggleFavori}
                onClick={() => navigate(`/home/${c.id}`, { state: c })}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Colocations;
