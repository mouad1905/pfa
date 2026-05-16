import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function HomeDetails() {
  const { state: home } = useLocation();
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  if (!home)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400 text-sm tracking-wide">
          Logement non trouvé
        </p>
      </div>
    );

  const images = home.images || [home.image];

  return (
    <div className="mt-13 max-w-6xl mx-auto px-6 py-8 font-[system-ui]">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">
          ←
        </span>
        Retour
      </button>

      {/* TITLE + ACTIONS */}
      <div className="flex items-start justify-between mb-5">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 leading-tight">
          {home.title}
        </h1>
        <div className="flex gap-3 text-sm text-stone-600 mt-1">
          <button className="flex items-center gap-1.5 underline underline-offset-2 hover:text-stone-900 transition">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12v1a8 8 0 0016 0v-1M12 3v12m0-12l-3 3m3-3l3 3"
              />
            </svg>
            Partager
          </button>
          <button
            onClick={() => setFav(!fav)}
            className="flex items-center gap-1.5 underline underline-offset-2 hover:text-stone-900 transition"
          >
            <svg
              className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`}
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
            {fav ? "Enregistré" : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* GALLERY — Airbnb-style asymmetric grid */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-[440px] grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2">
        {/* Main large image */}
        <div className="row-span-2 overflow-hidden">
          <img
            src={images[0]}
            alt=""
            className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 cursor-pointer"
          />
        </div>

        {/* Remaining thumbnails */}
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="relative overflow-hidden">
            {images[idx] ? (
              <img
                src={images[idx]}
                alt=""
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500 cursor-pointer"
              />
            ) : (
              <div className="w-full h-full bg-stone-200" />
            )}
            {/* "Show all photos" on last cell */}
            {idx === 4 && (
              <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm flex items-center gap-1.5 hover:bg-white transition">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 14h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"
                  />
                </svg>
                Afficher toutes les photos
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* LOCATION */}
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {home.location}
          </div>

          {/* DIVIDER */}
          <hr className="border-stone-200" />

          {/* OWNER */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700 text-lg shadow-sm">
              {home.initials}
            </div>
            <div>
              <p className="font-medium text-stone-800">{home.poster}</p>
              <p className="text-xs text-stone-400">Propriétaire</p>
            </div>
          </div>

          {/* DIVIDER */}
          <hr className="border-stone-200" />

          {/* DESCRIPTION */}
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">
              À propos de ce logement
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              {home.description}
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-100 rounded-2xl p-6 h-fit sticky top-6 space-y-4">
          {/* PRICE */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900">
              {home.price}
            </span>
            <span className="text-stone-400 text-sm">/ mois</span>
          </div>

          <hr className="border-stone-100" />

          {/* DATE INPUTS */}
          <div className="space-y-2">
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
              <div className="flex flex-col px-3 py-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Arrivée
                </label>
                <input
                  type="date"
                  className="text-sm text-stone-700 outline-none bg-transparent"
                />
              </div>
              <div className="flex flex-col px-3 py-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Départ
                </label>
                <input
                  type="date"
                  className="text-sm text-stone-700 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-emerald-100">
            Contacter le propriétaire
          </button>

          {/* FAVORITE */}
          <button
            onClick={() => setFav(!fav)}
            className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-all ${
              fav
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-stone-200 text-stone-600 hover:border-stone-300"
            }`}
          >
            <svg
              className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`}
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
            {fav ? "Retiré des favoris" : "Ajouter aux favoris"}
          </button>

          <p className="text-center text-xs text-stone-400">
            Aucun montant débité pour l'instant
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeDetails;
