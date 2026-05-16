import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { colocationData } from "../data/colocationData";
import { filters } from "../data/filtersData";
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaVectorSquare,
  FaHome,
  FaCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// ── Card ─────────────────────────────────────────────────────────────────────
const ColocationCard = ({ c, onClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const images = Array.isArray(c.images) ? c.images : [c.image];

  return (
    <motion.div
      variants={fadeInUp}
      onClick={onClick}
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative h-56 overflow-hidden rounded-2xl m-3">
        <img
          src={images[activeSlide]}
          alt={c.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-gray-800 text-xs font-semibold">
            {c.zone === "campus" ? "Proche Campus" : "Prime Pick"}
          </span>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(i);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${i === activeSlide ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-gray-900">
            {c.price}
          </span>
          <span className="text-gray-400 text-sm">/ mois</span>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <span className="font-bold text-gray-900 text-sm truncate">
            {c.title}
          </span>
          <span className="text-gray-300 mx-1">•</span>
          <span className="text-gray-500 text-sm truncate">{c.location}</span>
        </div>

        <hr className="border-gray-100 mb-4" />

        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2 flex-1">
            <FaVectorSquare />
            <span className="text-gray-800 text-sm">
              <strong>{c.area || "—"}</strong>{" "}
              <span className="text-gray-400">m²</span>
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2 flex-1 pl-4">
            <FaHome />
            <span className="text-gray-800 text-sm">
              <strong>{c.rooms || "—"}</strong>{" "}
              <span className="text-gray-400">Chambres</span>
            </span>
          </div>
        </div>

        <hr className="border-gray-100 mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>Par</span>
            <span className="text-gray-300">•</span>
            <span className="font-bold text-gray-900 underline underline-offset-2">
              {c.poster}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {c.postedAt || "Récemment"}
          </span>
        </div>

        <button className="w-full bg-gray-800 hover:bg-gray-900 transition-colors duration-200 text-white font-medium text-sm rounded-2xl py-3.5">
          Voir les détails
        </button>
      </div>
    </motion.div>
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
  const navigate = useNavigate();

  // Build room options dynamically from data
  const roomOptions = useMemo(() => {
    const counts = [
      ...new Set(colocationData.map((c) => c.rooms).filter(Boolean)),
    ].sort((a, b) => a - b);
    return [
      { id: "all", label: "Toutes chambres" },
      ...counts.map((r) => ({
        id: String(r),
        label: `${r} chambre${r > 1 ? "s" : ""}`,
      })),
    ];
  }, []);

  const visible = useMemo(() => {
    let result = [...colocationData];

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

    // Sort
    if (sortBy === "price_asc") result.sort((a, b) => a.priceNum - b.priceNum);
    if (sortBy === "price_desc") result.sort((a, b) => b.priceNum - a.priceNum);

    return result;
  }, [active, search, priceRange, roomFilter, sortBy]);

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
    <section className="min-h-screen bg-gray-100 py-4 mt-25 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 "
        >
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
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md cursor-pointer">
              <FaHome />
              Ajouter une annonce
            </button>
          </div>
        </motion.div>

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
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {visible.map((c) => (
              <ColocationCard
                key={c.id}
                c={c}
                onClick={() => navigate(`/home/${c.id}`, { state: c })}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Colocations;
