import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URLS, fetchData } from "../../api/api";
import { filters } from "../../data/filtersData";
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaVectorSquare,
  FaHome,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

// ── Card ─────────────────────────────────────────────────────────────────────
const ColocationCard = ({ c, onClick, plan }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const images =
    Array.isArray(c.images) && c.images.length > 0 ? c.images : [c.image];

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Dynamic values to match user screenshot 1:1 based on index
  const presets = [
    {
      campus: "5 min from Campus",
      rating: "4.8",
      tags: ["WIFI INCLUDED", "QUIET ZONE", "STUDY FRIENDLY"],
    },
    {
      campus: "2 min from Campus",
      rating: "4.9",
      tags: ["FULLY FURNISHED", "AC", "PRIVATE BATH"],
    },
    {
      campus: "8 min from Campus",
      rating: "4.7",
      tags: ["BUDGET FRIENDLY", "CENTRAL", "SECURE"],
    },
  ];

  const itemIndex = c.id % 3;
  const currentPreset = presets[isNaN(itemIndex) ? 0 : itemIndex];

  // Capacity text
  const capacityText = `CAPACITY: ${c.rooms || 1} ${c.rooms > 1 ? "STUDENTS" : "STUDENT"}`;

  // Formatting price DH / MO
  const priceDisplay = (() => {
    if (c.priceNum) {
      return `${c.priceNum} DH / M`;
    }
    const num = parseFloat(c.price);
    return !isNaN(num) ? `${num} DH / M` : `${c.price} / M`;
  })();

  // Dynamically map tags based on rules if available
  const displayTags = (() => {
    if (c.rules) {
      const parsedRules = c.rules
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
      if (parsedRules.length > 0) {
        return parsedRules
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
    }
    return currentPreset.tags;
  })();

  // Rating and campus time dynamic mapping
  const displayRating = currentPreset.rating;
  const displayCampus = currentPreset.campus;

  const isGold = plan === "gold";
  const isPremium = plan === "premium";

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-[24px] border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-4 font-poppins relative ${
        isGold
          ? "border-amber-400 shadow-amber-100 ring-1 ring-amber-300/40"
          : isPremium
          ? "border-emerald-300 shadow-emerald-50"
          : "border-slate-100"
      }`}
    >
      {/* Visual Header / Image Container with exact overlays */}
      <div className="relative h-52 overflow-hidden rounded-[18px] bg-slate-100 shadow-inner flex items-center justify-center">
        {/* Animated Stacked Carousel Images or Landscape Placeholder */}
        {images &&
        images.length > 0 &&
        images[0] &&
        !images[0].includes("unsplash.com/photo-1522708323590-d24dbb6b0267") ? (
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

        {/* Plan Boost Badges */}
        {isGold && (
          <div className="absolute bottom-3.5 right-3.5 z-10 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[8px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
            👑 GOLD CROWN
          </div>
        )}
        {isPremium && !isGold && (
          <div className="absolute bottom-3.5 right-3.5 z-10 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[8px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
            ⭐ PREMIUM BOOST
          </div>
        )}

        {/* Bottom Left: Distance from campus */}
        <div className="absolute bottom-3.5 left-3.5 bg-black/45 backdrop-blur-xs text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
          {displayCampus}
        </div>

        {/* Carousel Slider Arrows (only visible on hover) */}
        {images.length > 1 &&
          !images[0].includes(
            "unsplash.com/photo-1522708323590-d24dbb6b0267",
          ) && (
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
        {images.length > 1 &&
          !images[0].includes(
            "unsplash.com/photo-1522708323590-d24dbb6b0267",
          ) && (
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
          <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide mb-2.5">
            {capacityText}
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
              <span className="text-amber-400 text-base">★</span>
              <span className="text-slate-800 text-sm font-bold">
                {displayRating}
              </span>
            </div>
            {/* Outline Favorite Heart Icon */}
            <svg
              className="w-5 h-5 text-slate-400 hover:text-red-500 hover:fill-red-500 cursor-pointer transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
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
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl shadow-sm border transition-all duration-200
        ${
          value !== defaultId
            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
            : "border-gray-200 bg-white text-gray-600"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-wide truncate">
          {selectedLabel}
        </span>

        <FaChevronDown
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition
                hover:bg-emerald-50 ${
                  value === o.id
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-600"
                }`}
            >
              {o.label}

              {value === o.id && (
                <FaCheck className="text-emerald-500 text-xs" />
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
          area: item.superficie,
          type: item.type,
          roomType: item.type_chambre || "Chambre",
          gender: item.genre_colocataires || "mixte",
          rules: item.reglement || "",
          zone: item.prix < 3000 ? "budget" : "campus",
          image:
            item.image ||
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
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
            return [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
            ];
          })(),
          poster:
            `${item.proprietaire?.prenom || ""} ${item.proprietaire?.nom || ""}`.trim() ||
            "Propriétaire",
          id_poster: item.proprietaire?.id_user,
          description: item.description,
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

    // Filter out listings deactivated by their owner
    result = result.filter((c) => {
      const status = localStorage.getItem(`unicons_pub_status_${c.id}`);
      return status !== "false";
    });

    // Zone tab
    if (active === "campus") result = result.filter((c) => c.zone === "campus");
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

    // Sort: Gold first, then Premium, then standard
    const planWeight = (c) => {
      const plan = localStorage.getItem(`unicons_pub_formula_${c.id}`) || "standard";
      if (plan === "gold") return 2;
      if (plan === "premium") return 1;
      return 0;
    };

    if (sortBy === "price_asc") result.sort((a, b) => a.priceNum - b.priceNum);
    else if (sortBy === "price_desc") result.sort((a, b) => b.priceNum - a.priceNum);
    else result.sort((a, b) => planWeight(b) - planWeight(a));

    return result;
  }, [colocations, active, search, priceRange, roomFilter, sortBy]);

  const activeFilterCount = [
    search.trim() !== "",
    priceRange !== "all_prices",
    roomFilter !== "all",
    sortBy !== "default",
    active !== "all",
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch("");
    setPriceRange("all_prices");
    setRoomFilter("all");
    setSortBy("default");
    setActive("all");
  };

  return (
    <section className="min-h-screen bg-gray-100 py-4 mt-25 px-4 sm:px-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ── */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
          <div>
            <h1 className="text-3xl font-bold text-[#0b1c30] leading-tight tracking-tight">
              Annonces <span className="text-emerald-600">Colocation</span>
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              {visible.length} pépite{visible.length !== 1 ? "s" : ""} trouvée
              {visible.length !== 1 ? "s" : ""} à Rabat
            </p>
          </div>

          <div>
            <button
              onClick={() => navigate("/addHouse")}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
            >
              <FaHome />
              Ajouter une annonce
            </button>
          </div>
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
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {filters.map((f) => {
              const Icon = f.icon;

              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    active === f.id
                      ? "bg-emerald-400 text-white shadow-md"
                      : "text-gray-400 hover:text-emerald-700"
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

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50  border border-red-100 text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition"
            >
              <FaTimes />
              Effacer ({activeFilterCount})
            </button>
          )}
        </div>

        {/* ── ACTIVE FILTER TAGS ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                🔍 "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-700 ml-0.5"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {priceRange !== "all_prices" && (
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                💰 {PRICE_RANGES.find((r) => r.id === priceRange)?.label}
                <button
                  onClick={() => setPriceRange("all_prices")}
                  className="text-emerald-400 hover:text-emerald-700 ml-0.5"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {roomFilter !== "all" && (
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                🏠 {roomOptions.find((r) => r.id === roomFilter)?.label}
                <button
                  onClick={() => setRoomFilter("all")}
                  className="text-emerald-400 hover:text-emerald-700 ml-0.5"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {sortBy !== "default" && (
              <span className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                ↕ {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                <button
                  onClick={() => setSortBy("default")}
                  className="text-gray-400 hover:text-gray-700 ml-0.5"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {active !== "all" && (
              <span className="flex items-center gap-1.5 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {filters.find((f) => f.id === active)?.label}
                <button
                  onClick={() => setActive("all")}
                  className="text-gray-400 hover:text-white ml-0.5"
                >
                  <FaTimes />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((c) => {
              const plan = localStorage.getItem(`unicons_pub_formula_${c.id}`) || "standard";
              return (
                <ColocationCard
                  key={c.id}
                  c={c}
                  plan={plan}
                  onClick={() => navigate(`/home/${c.id}`, { state: c })}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Colocations;
