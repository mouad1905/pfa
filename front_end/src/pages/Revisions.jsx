import React, { useState, useEffect } from "react";
import { API_URLS, fetchData } from "../api/api";
import { FaArrowRight } from "react-icons/fa";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const availabilityIcon = (availability) => {
  const v = availability?.toLowerCase();
  if (v?.includes("ligne"))
    return (
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        videocam
      </span>
    );
  if (v?.includes("campus") || v?.includes("presentiel"))
    return (
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        location_on
      </span>
    );
  return (
    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
      devices
    </span>
  );
};

const Revisions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(API_URLS.COURS);
        // Map backend data to frontend structure
        const mappedData = result.data.map((item) => ({
          id: item.id_cours,
          name:
            `${item.professeur?.prenom || ""} ${item.professeur?.nom || ""}`.trim() ||
            "Professeur",
          level: item.niveau_etude,
          school: item.professeur?.niveau_etude || "EMSI", // Fallback
          subject: item.matiere,
          price: `${item.prix} ${item.type_prix}`,
          availability:
            item.mode_enseignement === "en_ligne" ? "En ligne" : "Présentiel",
          image: `https://i.pravatar.cc/150?u=${item.id_cours}`,
          description: item.description,
          id_prof: item.professeur?.id_user,
          rating: item.professeur?.avg_rating || "0.0",
        }));
        setRevisions(mappedData);
      } catch (error) {
        console.error("Error fetching revisions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredData = revisions.filter((item) =>
    item.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main
        className="grow pt-24 mt-10 pb-20 px-6 bg-[#f8f9ff] text-[#0b1c30] min-h-screen"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-300 mx-auto">
          {/* Hero Header */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div className="max-w-2xl">
              <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2 block">
                Réservez un cours
              </span>
              <h1 className="text-3xl font-bold text-[#0b1c30] leading-tight tracking-tight">
                Nos <span className="text-emerald-600">Instructeurs</span>{" "}
                Experts
              </h1>
              <p className="text-slate-500 text-base mt-4">
                Trouvez le tuteur idéal parmi notre sélection rigoureuse pour
                vous accompagner dans votre réussite académique et
                professionnelle.
              </p>
            </div>
            <div className="hidden md:block">
              <Link to="/addPartenaire">
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md cursor-pointer">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}
                  >
                    handshake
                  </span>
                  Devenir Partenaire
                </button>
              </Link>
            </div>
          </motion.section>

          {/* Search & Filter Bar */}
          <section className="p-2 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 mb-12 items-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="relative grow w-full">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                style={{ fontSize: 20 }}
              >
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  setSearchParams({ search: value }); // ✅ update URL
                }}
                placeholder="Rechercher par titre, quartier, description…"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base outline-none"
              />
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all cursor-pointer">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                tune
              </span>
              Filtrer
            </button>
          </section>

          {/* Instructor Grid */}
          <motion.section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredData.map((profile) => (
              <motion.div
                variants={fadeInUp}
                key={profile.id}
                className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {profile.subject}
                    </span>
                    <span className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {profile.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <Link
                      to={`/profile/${profile.id_prof}`}
                      className="flex items-center gap-2 group"
                    >
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-emerald-500 transition-all shadow-sm"
                        src={profile.image}
                        alt={profile.name}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                          {profile.name}
                        </span>
                        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                          {profile.school}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center text-amber-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm shrink-0 ml-2">
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          fontSize: 16,
                        }}
                      >
                        star
                      </span>
                      <span className="text-xs font-bold text-[#0b1c30] ml-1">
                        {profile.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6  flex flex-col grow">
                  <p className="text-emerald-600 text-xs font-bold mb-3">
                    {profile.level}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                    {profile.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-slate-50 px-2 py-1 rounded">
                      {availabilityIcon(profile.availability)}
                      {profile.availability}
                    </span>
                    <Link
                      to={`/profile/${profile.id_prof}`}
                      className="text-emerald-600 font-bold text-sm duration-200 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Voir Profil
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>
        </div>
      </main>
    </>
  );
};

export default Revisions;
