import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URLS, fetchData, fetchFormData } from "../../api/api";
import Swal from "sweetalert2";
import {
  FaArrowLeft, FaImage,
  FaMapMarkerAlt, FaSmokingBan,
  FaMoon, FaBookOpen, FaPaw, FaUserFriends, FaGraduationCap,
} from "react-icons/fa";

const TOTAL_STEPS = 4;

export default function EditHouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1: Basic Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("appartement");

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [newAmenityText, setNewAmenityText] = useState("");

  // Step 2: Capacity
  const [capacity, setCapacity] = useState(1);
  const [spots, setSpots] = useState(1);
  const [roomType, setRoomType] = useState("Shared Room");
  const [occupancy, setOccupancy] = useState(0);
  const [furnitureStatus, setFurnitureStatus] = useState("Fully Furnished");
  const [area, setArea] = useState(0);
  const [neighborhood, setNeighborhood] = useState("");

  // Step 3: House Rules
  const [rules, setRules] = useState({
    noSmoking: false, quietHours: true, studyFriendly: true, petsAllowed: false,
  });
  const [customRules, setCustomRules] = useState("");
  const [gender, setGender] = useState("mixte");
  const [studentsOnly, setStudentsOnly] = useState(true);

  // Step 4: Media
  const [selectedImages, setSelectedImages] = useState([]);
  const [newMainImage, setNewMainImage] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchData(`${API_URLS.HEBERGEMENTS}/${id}`);
        const h = data.data || data;

        setTitle(h.titre || "");
        setDescription(h.description || "");
        const loc = h.localisation || "";
        const dashIdx = loc.indexOf(" – ");
        setLocation(dashIdx > 0 ? loc.slice(0, dashIdx) : loc);
        setNeighborhood(dashIdx > 0 ? loc.slice(dashIdx + 3) : "");
        setPrice(h.prix || "");
        setType(h.type || "appartement");
        setCapacity(parseInt(h.nbr_chambres) || 1);
        setSpots(parseInt(h.max_capacity) || 1);
        setRoomType(h.type_chambre || "Shared Room");
        setOccupancy(parseInt(h.nb_locataires) || 0);
        setFurnitureStatus(h.meuble ? "Fully Furnished" : "Unfurnished");
        setArea(parseFloat(h.superficie) || 0);
        setGender(h.genre_colocataires || "mixte");
        setStudentsOnly(h.students_only !== false);
        if (h.images && h.images.length > 0) {
          setSelectedImages(h.images);
        } else if (h.image) {
          setSelectedImages([h.image]);
        }

        // Parse reglement JSON for rules & amenities
        let reg = h.reglement;
        if (typeof reg === "string") { try { reg = JSON.parse(reg); } catch {} }
        if (reg && typeof reg === "object") {
          const r = reg.rules || [];
          setRules({
            noSmoking: r.includes("Non fumeur"),
            quietHours: r.includes("Heures calmes"),
            studyFriendly: r.includes("Idéal pour étudier"),
            petsAllowed: r.includes("Animaux acceptés"),
          });
          const custom = r.filter(x => !["Non fumeur","Heures calmes","Idéal pour étudier","Animaux acceptés"].includes(x));
          setCustomRules(custom.join(", "));

          const defaultAmenities = [
            { id: "wifi", label: "WiFi", active: false, desc: "High-speed internet" },
            { id: "electricity", label: "Electricity", active: false, desc: "Power grid" },
            { id: "water", label: "Water", active: false, desc: "Running water" },
            { id: "ac", label: "Air Conditioning", active: false, desc: "Cooling system" },
            { id: "heating", label: "Heating", active: false, desc: "Space heating" },
            { id: "kitchen", label: "Kitchen", active: false, desc: "Full kitchen" },
            { id: "washing", label: "Washing Machine", active: false, desc: "In-unit laundry" },
            { id: "parking", label: "Parking", active: false, desc: "Reserved parking" },
          ];
          const ams = reg.amenities || [];
          defaultAmenities.forEach(a => { if (ams.includes(a.label)) a.active = true; });
          setAmenitiesList(defaultAmenities);
        } else {
          setAmenitiesList([
            { id: "wifi", label: "WiFi", active: true, desc: "High-speed internet" },
            { id: "electricity", label: "Electricity", active: true, desc: "Power grid" },
            { id: "water", label: "Water", active: true, desc: "Running water" },
            { id: "ac", label: "Air Conditioning", active: false, desc: "Cooling system" },
            { id: "heating", label: "Heating", active: false, desc: "Space heating" },
            { id: "kitchen", label: "Kitchen", active: false, desc: "Full kitchen" },
            { id: "washing", label: "Washing Machine", active: false, desc: "In-unit laundry" },
            { id: "parking", label: "Parking", active: false, desc: "Reserved parking" },
          ]);
        }
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger l'annonce.", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const toggleAmenity = (amenityId) => {
    setAmenitiesList(prev => prev.map(a => a.id === amenityId ? { ...a, active: !a.active } : a));
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (!newAmenityText.trim()) return;
    setAmenitiesList([...amenitiesList, { id: `c_${Date.now()}`, label: newAmenityText.trim(), active: true, desc: "" }]);
    setNewAmenityText("");
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!title.trim()) { Swal.fire("Attention", "Veuillez entrer un titre.", "warning"); return false; }
      if (!location.trim()) { Swal.fire("Attention", "Veuillez spécifier la ville.", "warning"); return false; }
      if (!price || parseFloat(price) <= 0) { Swal.fire("Attention", "Veuillez entrer un loyer valide.", "warning"); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < TOTAL_STEPS) setStep(step + 1);
      else handleSave();
    }
  };

  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleStepClick = (target) => {
    if (target < step) { setStep(target); return; }
    let cur = step;
    while (cur < target) { if (!validateStep(cur)) return; cur++; }
    setStep(target);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rulesList = [];
      if (rules.noSmoking) rulesList.push("Non fumeur");
      if (rules.quietHours) rulesList.push("Heures calmes");
      if (rules.studyFriendly) rulesList.push("Idéal pour étudier");
      if (rules.petsAllowed) rulesList.push("Animaux acceptés");
      if (customRules.trim()) customRules.split(",").map(s => s.trim()).filter(Boolean).forEach(r => rulesList.push(r));

      const activeAmenities = amenitiesList.filter(a => a.active).map(a => a.label);

      const body = {
        titre: title,
        description,
        localisation: `${location} – ${neighborhood}`,
        prix: parseFloat(price),
        type,
        type_chambre: roomType,
        nbr_chambres: parseInt(capacity) || 1,
        superficie: parseFloat(area) || 0,
        nb_locataires: Number(occupancy) || 0,
        max_capacity: parseInt(spots) || 1,
        genre_colocataires: gender,
        students_only: studentsOnly,
        meuble: furnitureStatus === "Fully Furnished",
        reglement: JSON.stringify({ rules: rulesList, amenities: activeAmenities }),
      };

      await fetchData(`${API_URLS.HEBERGEMENTS}/${id}`, {
        method: "PUT", body: JSON.stringify(body),
      });

      // Upload images if changed
      if (newMainImage || newGalleryImages.length > 0 || removedImages.length > 0) {
        const keptUrls = selectedImages.filter(u => !removedImages.includes(u));
        const fd = new FormData();
        if (newMainImage) fd.append("image_principale", newMainImage);
        if (!newMainImage && keptUrls[0]) fd.append("image_principale_url", keptUrls[0]);
        newGalleryImages.forEach(f => fd.append("images_galerie[]", f));
        keptUrls.slice(1).forEach(u => fd.append("images_galerie_urls[]", u));
        await fetchFormData(API_URLS.HEBERGEMENT_IMAGES(id), fd, "PUT");
      }

      Swal.fire({ icon: "success", title: "Annonce mise à jour !", timer: 1500, showConfirmButton: false });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1c30] font-poppins pb-12 pt-24">
      <main className="max-w-[1120px] mx-auto px-4">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-[#10b981] hover:underline mb-6 cursor-pointer bg-transparent border-none">
          <FaArrowLeft /> Retour au tableau de bord
        </button>

        <div className="bg-white border border-slate-100 rounded-2xl px-4 md:px-6 py-4 mb-6 flex flex-wrap justify-between items-center gap-3 shadow-sm">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-800">Modifier l'annonce</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Étape {step} sur 4</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="max-w-xl mx-auto flex items-center justify-between relative mb-10">
          {[{ n: 1, label: "Details" }, { n: 2, label: "Capacity" }, { n: 3, label: "Rules" }, { n: 4, label: "Media" }].map((s, idx) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <div key={s.n} className="flex items-center flex-1 last:flex-initial">
                <div onClick={() => handleStepClick(s.n)} className="flex items-center gap-2 cursor-pointer z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${done ? "bg-[#edfdf6] text-[#10b981] border border-[#10b981]" : active ? "bg-[#10b981] text-white" : "bg-white border-2 border-slate-200 text-slate-400"}`}>
                    {done ? "✓" : s.n}
                  </div>
                  <span className={`text-xs font-bold ${active ? "text-[#10b981]" : done ? "text-slate-600" : "text-slate-400"}`}>{s.label}</span>
                </div>
                {idx < 3 && <div className="flex-1 mx-4 h-0.5 bg-slate-200 rounded-full"><div className="h-full bg-[#10b981] rounded-full transition-all" style={{ width: step > s.n ? "100%" : "0%" }} /></div>}
              </div>
            );
          })}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-[#0b1c30]">Basic Details</h2>
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Titre</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]">
                    <option value="appartement">Appartement</option>
                    <option value="studio">Studio</option>
                    <option value="chambre">Chambre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Loyer (DH/mois)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                </div>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20">
                <h4 className="text-xs font-extrabold text-[#10b981] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <FaMapMarkerAlt /> Localisation
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase block">Ville</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase block">Quartier</label>
                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Description</label>
                <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981] resize-none" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-3">Équipements</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenitiesList.map(a => (
                    <button type="button" key={a.id} onClick={() => toggleAmenity(a.id)}
                      className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${a.active ? "bg-[#edfdf6] border-[#10b981] text-[#10b981]" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      <span className="font-extrabold text-xs">{a.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4 max-w-md">
                  <input type="text" value={newAmenityText} onChange={(e) => setNewAmenityText(e.target.value)}
                    placeholder="Ajouter un équipement..."
                    className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                  <button type="button" onClick={handleAddCustomAmenity}
                    className="bg-[#10b981] text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer border-none">+ Ajouter</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CAPACITY */}
          {step === 2 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-[#0b1c30]">Capacity & Configuration</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase block">Pièces</label>
                  <input type="number" value={capacity} onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase block">Capacité max</label>
                  <input type="number" value={spots} onChange={(e) => setSpots(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase block">Surface (m²)</label>
                  <input type="number" value={area} onChange={(e) => setArea(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]" />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Type de chambre</h4>
                <div className="flex flex-wrap gap-2">
                  {["Single Room", "Shared Room", "Studio"].map(r => (
                    <button type="button" key={r} onClick={() => setRoomType(r)}
                      className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${roomType === r ? "bg-[#edfdf6] border-[#10b981] text-[#10b981]" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-3">Meubles</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "Fully Furnished", label: "Entièrement meublé" },
                    { id: "Semi-furnished", label: "Semi-meublé" },
                    { id: "Unfurnished", label: "Non meublé" },
                  ].map(f => (
                    <div key={f.id} onClick={() => setFurnitureStatus(f.id)}
                      className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${furnitureStatus === f.id ? "border-[#10b981] bg-emerald-50/15" : "border-slate-200 hover:bg-slate-50"}`}>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase">{f.label}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HOUSE RULES */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-black text-[#0b1c30] mb-1">House Rules</h2>
                  <p className="text-xs text-slate-400 font-semibold mb-6">Définissez les règles et préférences pour vos colocataires.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { id: "noSmoking", title: "Non fumeur", icon: <FaSmokingBan /> },
                      { id: "quietHours", title: "Heures calmes", icon: <FaMoon /> },
                      { id: "studyFriendly", title: "Study Friendly", icon: <FaBookOpen /> },
                      { id: "petsAllowed", title: "Animaux acceptés", icon: <FaPaw /> },
                    ].map(rule => (
                      <div key={rule.id} onClick={() => setRules(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-xs ${rules[rule.id] ? "border-[#10b981] bg-[#edfdf6]/40" : "border-slate-200 hover:bg-slate-50"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-sm">{rule.icon}</span>
                          <span className="font-extrabold text-slate-800 text-xs uppercase">{rule.title}</span>
                        </div>
                        <input type="checkbox" checked={rules[rule.id]} onChange={() => {}}
                          className="rounded accent-[#10b981] w-4.5 h-4.5 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Règles personnalisées (séparées par des virgules)</label>
                    <textarea rows={3} value={customRules} onChange={(e) => setCustomRules(e.target.value)}
                      placeholder="Ex: Pas de soirée après 23h, Éco-responsable..."
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981] resize-none" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaUserFriends /> Préférence de genre
                  </h4>
                  {["mixte", "femme", "homme"].map(g => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer mb-3">
                      <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)}
                        className="accent-[#10b981] h-4.5 w-4.5 cursor-pointer" />
                      <span className="text-xs font-bold text-slate-700 capitalize">{g === "mixte" ? "Mixte" : g === "femme" ? "Femmes uniquement" : "Hommes uniquement"}</span>
                    </label>
                  ))}
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FaGraduationCap /> Étudiants seulement ?
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={studentsOnly} onChange={() => setStudentsOnly(!studentsOnly)} className="sr-only peer" />
                      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {step === 4 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-[#0b1c30]">Media</h2>

              {/* Image principale actuelle */}
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Image principale</label>
                {selectedImages[0] && !removedImages.includes(selectedImages[0]) ? (
                  <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={selectedImages[0]} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setRemovedImages(prev => [...prev, selectedImages[0]])}
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer border-none">X</button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mb-2">Image principale supprimée ou absente.</p>
                )}
                <label className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50 transition">
                  <FaImage /> Changer l'image principale
                  <input type="file" accept="image/*" onChange={(e) => setNewMainImage(e.target.files[0])} className="hidden" />
                </label>
                {newMainImage && <span className="text-xs text-[#10b981] ml-3 font-semibold">{newMainImage.name}</span>}
              </div>

              {/* Galerie */}
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2 block">Galerie</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedImages.slice(1).map((img, i) => (
                    removedImages.includes(img) ? null : (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setRemovedImages(prev => [...prev, img])}
                          className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer border-none">X</button>
                      </div>
                    )
                  ))}
                  {newGalleryImages.map((file, i) => (
                    <div key={`new-${i}`} className="relative aspect-video rounded-xl overflow-hidden border border-[#10b981]">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <label className="aspect-video rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#10b981] transition bg-slate-50/50">
                    <FaImage className="text-slate-400 text-lg" />
                    <span className="text-[10px] font-bold text-slate-400">Ajouter</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => setNewGalleryImages(prev => [...prev, ...Array.from(e.target.files)])} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button type="button" onClick={step === 1 ? () => navigate("/dashboard") : prevStep}
              className="px-8 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
              {step === 1 ? "Annuler" : "Précédent"}
            </button>
            <button type="button" onClick={nextStep} disabled={saving}
              className="px-8 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:opacity-90 transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {step === TOTAL_STEPS ? "Enregistrer" : "Suivant"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}