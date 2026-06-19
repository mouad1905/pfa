import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URLS, fetchFormData } from "../../api/api";
import { compressImageFiles } from "../../utils/compressImage";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaUsers,
  FaClipboardList,
  FaImage,
  FaMapMarkerAlt,
  FaBuilding,
  FaUser,
  FaBox,
  FaSmokingBan,
  FaMoon,
  FaBookOpen,
  FaPaw,
  FaUserFriends,
  FaGraduationCap,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaTrash,
  FaPlus,
  FaLightbulb,
  FaExpandArrowsAlt,
  FaBroom,
  FaColumns,
  FaThList,
  FaWifi,
  FaBolt,
  FaTint,
  FaSnowflake,
  FaFire,
  FaUtensils,
  FaTshirt,
  FaCar,
  FaCheck,
} from "react-icons/fa";

const TOTAL_STEPS = 4;

const PRESET_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    label: "Chambre Cosy Minimaliste",
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    label: "Espace Bureau / Études",
  },
  {
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    label: "Chambre Élégante",
  },
  {
    url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    label: "Chambre Lumineuse",
  },
  {
    url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    label: "Appartement Design",
  },
];



export default function UniConnectListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [layoutMode, setLayoutMode] = useState("sidebar"); // 'sidebar' or 'horizontal'

  // Step 1: Basic Details state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Rabat");
  const [neighborhood, setNeighborhood] = useState("Agdal");
  const [price, setPrice] = useState("2500");
  const [type, setType] = useState("Studio");
  
  // Dynamic Flexible Amenities
  const [amenitiesList, setAmenitiesList] = useState([
    { id: "wifi", label: "WiFi", icon: <FaWifi className="text-slate-800 text-[15px] shrink-0" />, active: true, desc: "High-speed wireless internet" },
    { id: "electricity", label: "Electricity", icon: <FaBolt className="text-slate-800 text-[15px] shrink-0" />, active: true, desc: "Power grid connection" },
    { id: "water", label: "Water", icon: <FaTint className="text-slate-800 text-[15px] shrink-0" />, active: true, desc: "Running hot/cold water" },
    { id: "ac", label: "Air Conditioning", icon: <FaSnowflake className="text-slate-800 text-[15px] shrink-0" />, active: false, desc: "In-unit cooling system" },
    { id: "heating", label: "Heating", icon: <FaFire className="text-slate-800 text-[15px] shrink-0" />, active: false, desc: "Central or space heating" },
    { id: "kitchen", label: "Kitchen", icon: <FaUtensils className="text-slate-800 text-[15px] shrink-0" />, active: false, desc: "Full kitchen utilities" },
    { id: "washing", label: "Washing Machine", icon: <FaTshirt className="text-slate-800 text-[15px] shrink-0" />, active: false, desc: "In-unit laundry machine" },
    { id: "parking", label: "Parking", icon: <FaCar className="text-slate-800 text-[15px] shrink-0" />, active: false, desc: "Reserved parking space" },
  ]);
  const [newAmenityText, setNewAmenityText] = useState("");

  // Step 2: Capacity state
  const [capacity, setCapacity] = useState(3); // Total Rooms
  const [spots, setSpots] = useState(4); // Max Student Capacity
  const [roomType, setRoomType] = useState("Shared Room");
  const [occupancy, setOccupancy] = useState(1); // Current occupancy slider
  const [furnitureStatus, setFurnitureStatus] = useState("Fully Furnished");
  const [area, setArea] = useState(50);

  // Step 3: House Rules state
  const [rules, setRules] = useState({
    noSmoking: false,
    quietHours: true,
    studyFriendly: true,
    petsAllowed: false,
  });
  const [customRules, setCustomRules] = useState("");
  const [gender, setGender] = useState("all");
  const [studentsOnly, setStudentsOnly] = useState(true);

  // Step 4: Media state
  const [selectedImages, setSelectedImages] = useState([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [imageFileMap, setImageFileMap] = useState({});

  const toggleAmenity = (id) => {
    setAmenitiesList(
      amenitiesList.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (!newAmenityText.trim()) return;
    const newId = `custom_${Date.now()}`;
    setAmenitiesList([
      ...amenitiesList,
      {
        id: newId,
        label: newAmenityText.trim(),
        icon: <FaCheck className="text-slate-800 text-[15px] shrink-0" />,
        active: true,
        desc: "Custom added amenity",
      },
    ]);
    setNewAmenityText("");
  };



  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }
    
    // Incrementally validate up to targetStep - 1
    let current = step;
    while (current < targetStep) {
      if (!validateStep(current)) return;
      current++;
    }
    setStep(targetStep);
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!title.trim()) {
        Swal.fire("Attention", "Veuillez entrer un titre pour votre annonce.", "warning");
        return false;
      }
      if (!location.trim() || !neighborhood.trim()) {
        Swal.fire("Attention", "Veuillez spécifier la ville et le quartier.", "warning");
        return false;
      }
      if (!price || parseFloat(price) <= 0) {
        Swal.fire("Attention", "Veuillez entrer un loyer valide.", "warning");
        return false;
      }
      if (!description.trim() || description.length < 10) {
        Swal.fire("Attention", "La description doit faire au moins 10 caractères.", "warning");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handlePublish();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Local File Upload Handlers
  const MAX_GALLERY_IMAGES = 6;

  const addFilesToGallery = async (files) => {
    const remaining = MAX_GALLERY_IMAGES - selectedImages.length;
    if (remaining <= 0) {
      Swal.fire("Limite atteinte", `Maximum ${MAX_GALLERY_IMAGES} photos par annonce.`, "info");
      return;
    }

    const toAdd = files.slice(0, remaining);
    const validFiles = [];
    for (const f of toAdd) {
      if (!f.type.startsWith("image/")) {
        Swal.fire("Format non supporté", `${f.name} n'est pas une image valide. Utilisez JPG, PNG ou WEBP.`, "error");
        continue;
      }
      validFiles.push(f);
    }
    if (validFiles.length === 0) return;

    let compressed;
    try {
      compressed = await compressImageFiles(validFiles, remaining);
    } catch {
      compressed = validFiles;
    }

    const mapUpdate = { ...imageFileMap };
    const newUrls = [];
    let hasError = false;
    for (const file of compressed) {
      try {
        const url = URL.createObjectURL(file);
        mapUpdate[url] = file;
        newUrls.push(url);
      } catch {
        hasError = true;
      }
    }
    if (hasError) {
      Swal.fire("Erreur", "Certaines photos n'ont pas pu être chargées (format HEIC/iCloud). Essayez JPG ou PNG.", "warning");
    }
    setImageFileMap(mapUpdate);
    setSelectedImages((prev) => [...prev, ...newUrls]);

    if (files.length > remaining) {
      Swal.fire(
        "Photos limitées",
        `Seules ${remaining} photo(s) ont été ajoutées (max ${MAX_GALLERY_IMAGES}).`,
        "info"
      );
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    await addFilesToGallery(files);
    e.target.value = "";
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void addFilesToGallery(Array.from(e.dataTransfer.files));
    }
  };

  const handleAddCustomImage = (e) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    if (!customImageUrl.startsWith("http")) {
      return Swal.fire("Erreur", "L'URL doit commencer par http:// ou https://", "error");
    }
    setSelectedImages([...selectedImages, customImageUrl.trim()]);
    setCustomImageUrl("");
  };

  const removeSelectedImage = (url) => {
    const nextMap = { ...imageFileMap };
    delete nextMap[url];
    setImageFileMap(nextMap);
    setSelectedImages(selectedImages.filter((img) => img !== url));
  };

  const handlePublish = async () => {
    if (selectedImages.length < 3) {
      return Swal.fire("Attention", "Veuillez sélectionner au moins 3 images pour votre hébergement.", "warning");
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user) {
      return Swal.fire("Connexion requise", "Connectez-vous en tant que locateur ou propriétaire pour publier.", "warning");
    }

    setLoading(true);

    const rulesList = [];
    if (rules.noSmoking) rulesList.push("Non fumeur");
    if (rules.quietHours) rulesList.push("Heures calmes");
    if (rules.studyFriendly) rulesList.push("Idéal pour étudier");
    if (rules.petsAllowed) rulesList.push("Animaux acceptés");
    if (customRules.trim()) rulesList.push(customRules.trim());

    const activeAmenities = amenitiesList.filter((a) => a.active).map((a) => a.label);

    const reglementData = {
      rules: rulesList,
      amenities: activeAmenities,
    };

    const formData = new FormData();
    formData.append("titre", title);
    formData.append("description", description);
    formData.append("localisation", `${location} – ${neighborhood}`);
    formData.append("prix", String(parseFloat(price)));
    formData.append("type", type);
    formData.append("type_chambre", roomType);
    formData.append("nbr_chambres", String(Math.max(0, parseInt(capacity, 10) || 0)));
    formData.append("superficie", String(parseFloat(area) || 0));
    formData.append("nb_locataires", String(Math.max(0, Number(occupancy) || 0)));
    formData.append("genre_colocataires", gender === "all" ? "mixte" : gender);
    formData.append("max_capacity", String(Math.max(0, parseInt(spots, 10) || 0)));
    formData.append("students_only", studentsOnly ? "1" : "0");
    formData.append("reglement", JSON.stringify(reglementData));
    formData.append("meuble", furnitureStatus === "Fully Furnished" ? "1" : "0");

    let files = [];
    const httpUrls = [];
    selectedImages.forEach((img) => {
      if (imageFileMap[img]) files.push(imageFileMap[img]);
      else if (img.startsWith("http")) httpUrls.push(img);
    });

    if (files.length > 0) {
      try {
        files = await compressImageFiles(files, MAX_GALLERY_IMAGES);
      } catch {
        // garde les fichiers originaux si la compression échoue
      }
      formData.append("image_principale", files[0]);
      files.slice(1).forEach((f) => formData.append("images_galerie[]", f));
    }
    if (httpUrls.length > 0) {
      if (files.length === 0) {
        formData.append("image_principale_url", httpUrls[0]);
        httpUrls.forEach((u) => formData.append("images_galerie_urls[]", u));
      } else {
        httpUrls.forEach((u) => formData.append("images_galerie_urls[]", u));
      }
    }

    try {
      await fetchFormData(API_URLS.HEBERGEMENTS, formData);

      localStorage.removeItem(`unicons_user_pubs_${user.id_user}`);

      await Swal.fire({
        title: "Félicitations !",
        text: "Votre annonce a été enregistrée en base de données et sera visible après validation.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      Swal.fire("Erreur", error.message || "Erreur lors de la publication.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1c30] font-poppins pb-12 pt-24">
      <main className="max-w-[1120px] mx-auto px-4">
        <div className="bg-white border border-slate-100 rounded-2xl px-4 md:px-6 py-4 mb-6 flex flex-wrap justify-between items-center gap-3 shadow-sm">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-800">Ajouter une annonce</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Étape {step} sur 4</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <button
              type="button"
              onClick={() => setLayoutMode(layoutMode === "sidebar" ? "horizontal" : "sidebar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#10b981] hover:text-[#10b981] transition-all cursor-pointer bg-slate-50/50"
            >
              {layoutMode === "sidebar" ? (
                <>
                  <FaThList className="w-3 h-3 shrink-0" />
                  <span>Vue horizontale</span>
                </>
              ) : (
                <>
                  <FaColumns className="w-3 h-3 shrink-0" />
                  <span>Vue sidebar</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/colocations")}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-red-300 hover:text-red-600 transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
        
        {/* Horizontal Top Stepper Component */}
        {layoutMode === "horizontal" && (
          <div className="mb-10 text-center">
            <h2 className="text-xl font-black text-[#0b1c30] mb-6">Créer votre annonce</h2>
            
            {/* Horizontal Stepper Row */}
            <div className="max-w-xl mx-auto flex items-center justify-between relative mb-6">
              {[
                { stepNum: 1, label: "Details" },
                { stepNum: 2, label: "Capacity" },
                { stepNum: 3, label: "Rules" },
                { stepNum: 4, label: "Media" },
              ].map((s, idx) => {
                const isCompleted = step > s.stepNum;
                const isActive = step === s.stepNum;
                
                return (
                  <div key={s.stepNum} className="flex items-center flex-1 last:flex-initial">
                    <div 
                      onClick={() => handleStepClick(s.stepNum)}
                      className="flex items-center gap-2 cursor-pointer z-10"
                    >
                      {/* Circle Badge */}
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300
                          ${isCompleted 
                            ? "bg-[#edfdf6] text-[#10b981] border border-[#10b981]" 
                            : isActive 
                              ? "bg-[#10b981] text-white" 
                              : "bg-white border-2 border-slate-200 text-slate-400"
                          }`}
                      >
                        {isCompleted ? "✓" : s.stepNum}
                      </div>
                      
                      {/* Text label */}
                      <span 
                        className={`text-xs font-bold transition-colors duration-300
                          ${isActive 
                            ? "text-[#10b981]" 
                            : isCompleted 
                              ? "text-slate-600" 
                              : "text-slate-400"
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    
                    {/* Connecting line to the next step */}
                    {idx < 3 && (
                      <div className="flex-1 mx-4 h-0.5 relative">
                        <div className="absolute inset-0 bg-slate-200 rounded-full" />
                        <div 
                          className="absolute inset-0 bg-[#10b981] rounded-full transition-all duration-500" 
                          style={{ width: step > s.stepNum ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="h-px bg-slate-200/80 mb-2" />
          </div>
        )}

        <div className={layoutMode === "sidebar" ? "grid grid-cols-1 md:grid-cols-4 gap-8 items-start" : "block"}>
          
          {/* LEFT STEP SIDEBAR NAVIGATION (Sidebar Layout Mode only) */}
          {layoutMode === "sidebar" && (
            <div className="md:col-span-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs text-left sticky top-28">
              <div className="mb-6 px-2">
                <h3 className="font-black text-[#0b1c30] text-sm leading-tight uppercase tracking-wider">Post a Listing</h3>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">Step {step} of 4</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  { stepNum: 1, label: "Basic Details", icon: <FaEdit className="w-4 h-4 shrink-0" /> },
                  { stepNum: 2, label: "Capacity", icon: <FaUsers className="w-4 h-4 shrink-0" /> },
                  { stepNum: 3, label: "House Rules", icon: <FaClipboardList className="w-4 h-4 shrink-0" /> },
                  { stepNum: 4, label: "Media", icon: <FaImage className="w-4 h-4 shrink-0" /> }
                ].map((itemOption) => {
                  const isActive = step === itemOption.stepNum;
                  return (
                    <div
                      key={itemOption.stepNum}
                      onClick={() => handleStepClick(itemOption.stepNum)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-xs cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#edfdf6] text-[#10b981]"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span className="shrink-0">{itemOption.icon}</span>
                      <span>{itemOption.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN WIZARD FORMS */}
          <div className={layoutMode === "sidebar" ? "md:col-span-3" : "w-full max-w-5xl mx-auto"}>
            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* STEP 1: BASIC DETAILS */}
              {step === 1 && (
                <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-black text-[#0b1c30] mb-1">Basic Details</h2>
                    <p className="text-xs text-slate-400 font-semibold mb-6">Provide the fundamental information about your student housing listing.</p>

                    {/* Listing Title */}
                    <div className="mb-6">
                      <label className="block text-xs font-extrabold text-slate-550 mb-2 uppercase tracking-wide">Listing Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Modern Studio near EMI"
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all duration-200 outline-none focus:border-[#10b981]"
                        required
                      />
                    </div>

                    {/* Property Type & Rent Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-550 mb-2 uppercase tracking-wide">Property Type</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all outline-none focus:border-[#10b981] appearance-none"
                        >
                          <option value="Studio">Studio</option>
                          <option value="Appartement">Appartement</option>
                          <option value="Chambre">Chambre Seule</option>
                          <option value="Colocation">Grande Colocation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-550 mb-2 uppercase tracking-wide">Monthly Rent (DH)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="2500"
                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 pr-12 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all outline-none focus:border-[#10b981]"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">DH</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Details section */}
                    <div className="border border-slate-100 rounded-2xl p-5 mb-6 bg-slate-50/20">
                      <h4 className="text-xs font-extrabold text-[#10b981] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="w-4 h-4 shrink-0" />
                        Location Details
                      </h4>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">City</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City"
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Neighborhood</label>
                          <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder="Neighborhood"
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]"
                          />
                        </div>
                      </div>

                      {/* Location Map */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase mb-2 block">Location Map</span>
                        <div className="bg-slate-100 border border-slate-200 rounded-xl h-44 overflow-hidden relative shadow-inner">
                          <iframe
                            title="Location preview"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location + " " + neighborhood)},+Morocco&output=embed&z=14`}
                            className="absolute inset-0 w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <label className="block text-xs font-extrabold text-slate-550 mb-2 uppercase tracking-wide">Description</label>
                      <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the property, proximity to schools, and atmosphere..."
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all outline-none focus:border-[#10b981] resize-none"
                        required
                      />
                    </div>

                    {/* Key Amenities Included */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-550 mb-3 uppercase tracking-wide">Key Amenities Included</h4>
                      
                      {/* Amenities grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {amenitiesList.map((amenity) => (
                          <button
                            type="button"
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs relative overflow-hidden group
                            ${
                              amenity.active
                                ? "bg-[#edfdf6] border-[#10b981] text-[#10b981]"
                                : "bg-white border-slate-200 text-slate-550 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{amenity.icon}</span>
                              <span className="font-extrabold text-xs tracking-tight">{amenity.label}</span>
                            </div>
                            <span className={`text-[9px] leading-none block font-medium mt-0.5 ${amenity.active ? "text-emerald-600/70" : "text-slate-400"}`}>
                              {amenity.desc}
                            </span>
                            {amenity.active && (
                              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amenity Adder Field */}
                      <div className="flex gap-2 mt-4 max-w-md">
                        <input
                          type="text"
                          value={newAmenityText}
                          onChange={(e) => setNewAmenityText(e.target.value)}
                          placeholder="Add custom amenity (e.g. Balcony, AC...)"
                          className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all outline-none focus:border-[#10b981]"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomAmenity}
                          className="bg-[#10b981] hover:bg-[#0b9062] text-white text-xs font-black px-5 py-2.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer border-none shadow-xs"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: CAPACITY & CONFIGURATION */}
              {step === 2 && (
                <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-black text-[#0b1c30] mb-1">Capacity & Configuration</h2>
                    <p className="text-xs text-slate-400 font-semibold mb-6">Define the general capacity, room types, and furniture status of your listing.</p>

                    {/* General Capacity */}
                    <div className="border-b border-slate-100 pb-6 mb-6">
                      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">General Capacity</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Total Rooms</label>
                          <div className="relative">
                            <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs shrink-0" />
                            <input
                              type="number"
                              value={capacity}
                              onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                              placeholder="e.g. 3"
                              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 pl-10 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Max Student Capacity</label>
                          <div className="relative">
                            <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs shrink-0" />
                            <input
                              type="number"
                              value={spots}
                              onChange={(e) => setSpots(Math.max(1, parseInt(e.target.value) || 1))}
                              placeholder="e.g. 4"
                              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 pl-10 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Surface (m²)</label>
                          <div className="relative">
                            <FaExpandArrowsAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs shrink-0" />
                            <input
                              type="number"
                              value={area}
                              onChange={(e) => setArea(Math.max(1, parseFloat(e.target.value) || 0))}
                              placeholder="e.g. 75"
                              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 pl-10 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 outline-none focus:border-[#10b981]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Room Types & Occupancy split */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 mb-6 border-b border-slate-100">
                      <div className="md:col-span-7">
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Room Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "Single Room", label: "Single Room", icon: <FaUser className="text-xs shrink-0" /> },
                            { id: "Shared Room", label: "Shared Room", icon: <FaUsers className="text-xs shrink-0" /> },
                            { id: "Studio", label: "Studio", icon: <FaBox className="text-xs shrink-0" /> }
                          ].map((itemOption) => {
                            const active = roomType === itemOption.id;
                            return (
                              <button
                                type="button"
                                key={itemOption.id}
                                onClick={() => setRoomType(itemOption.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs
                                ${
                                  active
                                    ? "bg-[#edfdf6] border-[#10b981] text-[#10b981]"
                                    : "bg-white border-slate-200 text-slate-555 hover:bg-slate-50"
                                }`}
                              >
                                {itemOption.icon}
                                <span>{itemOption.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="md:col-span-5 bg-slate-50/40 border border-slate-100 rounded-2xl p-4 text-left">
                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Current Occupancy</h4>
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <input
                            type="range"
                            min="0"
                            max={spots}
                            value={occupancy}
                            onChange={(e) => setOccupancy(parseInt(e.target.value))}
                            className="flex-1 accent-[#10b981] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                          <span className="text-sm font-extrabold text-slate-800 shrink-0">
                            {occupancy} <span className="text-xs text-slate-400 font-semibold">/ {spots}</span>
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block leading-tight">
                          Number of spots already reserved or occupied.
                        </span>
                      </div>
                    </div>

                    {/* Furniture Status */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-550 mb-3 uppercase tracking-wide">Furniture Status</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        <div className="lg:col-span-2 flex flex-col gap-3 justify-between">
                          {[
                            { id: "Fully Furnished", desc: "Ready to move in with all essentials." },
                            { id: "Semi-furnished", desc: "Basic pieces like bed and desk provided." },
                            { id: "Unfurnished", desc: "Bring your own furniture and decor." }
                          ].map((f) => {
                            const active = furnitureStatus === f.id;
                            return (
                              <div
                                key={f.id}
                                onClick={() => setFurnitureStatus(f.id)}
                                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-center shadow-xs
                                ${
                                  active
                                    ? "border-[#10b981] bg-emerald-50/15"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">{f.id}</h4>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{f.desc}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bedroom config stock preview */}
                        <div className="lg:col-span-1 rounded-2xl overflow-hidden shadow-xs h-full border border-slate-100 min-h-36 relative">
                          <img
                            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                            className="w-full h-full object-cover absolute inset-0"
                            alt="Bedroom details"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: HOUSE RULES */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Left Column (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6 text-left">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <h2 className="text-xl font-black text-[#0b1c30] mb-1">House Rules</h2>
                      <p className="text-xs text-slate-400 font-semibold mb-6">Define the regulations and roommate preferences.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {[
                          { id: "noSmoking", title: "No Smoking", icon: <FaSmokingBan className="w-5 h-5 text-slate-500 shrink-0" /> },
                          { id: "quietHours", title: "Quiet Hours", icon: <FaMoon className="w-5 h-5 text-slate-500 shrink-0" /> },
                          { id: "studyFriendly", title: "Study Friendly", icon: <FaBookOpen className="w-5 h-5 text-slate-500 shrink-0" /> },
                          { id: "petsAllowed", title: "Pets Allowed", icon: <FaPaw className="w-5 h-5 text-slate-500 shrink-0" /> }
                        ].map((rule) => {
                          const val = rules[rule.id];
                          return (
                            <div
                              key={rule.id}
                              onClick={() => setRules((prev) => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-xs
                              ${
                                val ? "border-[#10b981] bg-[#edfdf6]/40" : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="shrink-0">{rule.icon}</div>
                                <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">{rule.title}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={val}
                                onChange={() => {}} // handled by parent onClick click
                                className="rounded border-slate-350 text-[#10b981] focus:ring-[#10b981] w-4.5 h-4.5 cursor-pointer accent-[#10b981]"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Rules */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-550 mb-2 uppercase tracking-wide">Custom Rules (Optional)</label>
                        <textarea
                          rows={4}
                          value={customRules}
                          onChange={(e) => setCustomRules(e.target.value)}
                          placeholder="Describe any additional rules or expectations for your future tenants..."
                          className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-xs font-semibold focus:ring-2 focus:ring-[#10b981]/15 transition-all outline-none focus:border-[#10b981] resize-none"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold block mt-2">
                          These rules will be displayed clearly on your property listing page.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column sidebar widgets */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Gender Preference widget */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FaUserFriends className="w-4 h-4 text-slate-400 shrink-0" />
                        Gender Preference
                      </h4>
                      <div className="space-y-4">
                        {[
                          { value: "all", label: "Mixed / Any" },
                          { value: "female", label: "Female Only" },
                          { value: "male", label: "Male Only" }
                        ].map((g) => (
                          <label key={g.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value={g.value}
                              checked={gender === g.value}
                              onChange={() => setGender(g.value)}
                              className="text-[#10b981] focus:ring-[#10b981] h-4.5 w-4.5 cursor-pointer accent-[#10b981]"
                            />
                            <span className="text-xs font-bold text-slate-700">{g.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Students Only widget */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <FaGraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                          Students Only?
                        </h4>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={studentsOnly}
                            onChange={() => setStudentsOnly(!studentsOnly)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                        </label>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-2 leading-relaxed">
                        Restricts applicants to verified student accounts.
                      </span>
                    </div>

                    {/* Owner Tip box */}
                    <div className="bg-[#edfdf6] border border-emerald-100 rounded-3xl p-5 text-left flex gap-3 shadow-xs">
                      <div className="text-[#10b981] shrink-0 mt-0.5">
                        <FaInfoCircle className="w-5 h-5 text-[#10b981] shrink-0" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider mb-1">Owner Tip</h5>
                        <span className="text-[10px] text-emerald-700/90 font-medium leading-relaxed block">
                          Properties that allow light cooking and have 'Quiet Hours' enforced see a 35% higher interest from graduate students.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MEDIA */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Left Main Gallery (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6 text-left">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <h2 className="text-xl font-black text-[#0b1c30] mb-1">Step 4: Media</h2>
                      <p className="text-xs text-slate-400 font-semibold mb-6">Bring your listing to life with high-quality photos.</p>

                      {/* Hidden File Input for browser selection */}
                      <input
                        type="file"
                        id="local-media-uploader"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {/* Dotted Upload Drag & Drop Area */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center shadow-xs mb-6 transition-all duration-300
                          ${dragActive 
                            ? "bg-[#edfdf6] border-[#10b981] scale-[1.01]" 
                            : "bg-white border-slate-200  hover:bg-slate-50/30"
                          }`}
                      >
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100/50">
                          <FaCloudUploadAlt className="w-8 h-8 text-[#10b981] shrink-0" />
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-base mb-1">Upload your property photos</h3>
                        <span className="text-xs text-slate-400 font-semibold mb-6">
                          Drag and drop your images here, or{" "}
                          <label 
                            htmlFor="local-media-uploader" 
                            className="text-[#10b981] font-extrabold cursor-pointer underline hover:text-[#0b9062]"
                          >
                            browse files
                          </label>
                        </span>
                        
                        {/* URL Paste backup */}
                        <div className="flex gap-2 w-full max-w-sm mb-2">
                          <input
                            type="url"
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            placeholder="Paste picture URL (http://...)"
                            className="flex-1 p-2.5 bg-white border border-slate-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/15 rounded-xl outline-none text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomImage}
                            className="bg-slate-900 hover:bg-slate-950 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer border-none"
                          >
                            Add URL
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                          Supports JPG, PNG, WEBP (Max 10MB per photo)
                        </span>
                      </div>

                      {/* Gallery Preview Container */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">GALLERY PREVIEW</h4>
                          <span className="text-xs text-[#10b981] font-extrabold">{selectedImages.length}/6 · min 3</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {selectedImages.map((imgUrl, index) => (
                            <div
                              key={imgUrl}
                              className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative group border border-slate-150 shadow-xs"
                            >
                              <img src={imgUrl} alt="Room" className="w-full h-full object-cover" />
                              
                              {/* Overlay for actions */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeSelectedImage(imgUrl)}
                                  className="text-white bg-red-600 p-2 rounded-full shadow hover:bg-red-700 transition active:scale-95 cursor-pointer border-none flex items-center justify-center"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Cover photo badge on the first item */}
                              {index === 0 && (
                                <span className="absolute top-2 left-2 bg-[#10b981] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                  ★ Cover Photo
                                </span>
                              )}
                            </div>
                          ))}

                          {/* Dotted ADD MORE placeholder box */}
                          <label
                            htmlFor="local-media-uploader"
                            className="aspect-video bg-white border-2 border-dashed border-slate-200 hover:border-[#10b981] rounded-2xl flex flex-col gap-1 items-center justify-center cursor-pointer hover:bg-slate-50/55 transition-all shadow-xs"
                          >
                            <FaPlus className="w-5 h-5 text-slate-400 shrink-0" />
                            <span className="text-[10px] text-slate-400 font-extrabold">Add more</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column sidebar media requirements */}
                  <div className="lg:col-span-1 space-y-6 text-left">
                    {/* Photo Requirements */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">PHOTO REQUIREMENTS</h4>
                      
                      <div className="space-y-4">
                        {[
                          {
                            title: "Lighting is Key",
                            desc: "Take bright photos of the common areas. Open all blinds and turn on lights to make spaces feel larger.",
                            icon: <FaLightbulb className="w-5 h-5 text-[#10b981] shrink-0" />
                          },
                          {
                            title: "Wide Angles",
                            desc: "Shoot from corners to capture the full scale of the rooms. Landscapes are preferred over portraits.",
                            icon: <FaExpandArrowsAlt className="w-5 h-5 text-[#10b981] shrink-0" />
                          },
                          {
                            title: "De-clutter",
                            desc: "Remove personal items from surfaces. A clean space appears more professional and appealing to students.",
                            icon: <FaBroom className="w-5 h-5 text-[#10b981] shrink-0" />
                          }
                        ].map((req, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="shrink-0 mt-0.5">{req.icon}</div>
                            <div>
                              <h5 className="font-extrabold text-slate-800 text-xs leading-none mb-1">{req.title}</h5>
                              <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">{req.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-[#edfdf6] border border-emerald-100 rounded-3xl p-5 shadow-xs">
                      <div className="flex gap-2 items-center mb-1 text-emerald-800">
                        <span className="font-extrabold text-xs uppercase tracking-wider">Pro Tip:</span>
                      </div>
                      <span className="text-[10px] text-emerald-700/90 font-medium leading-relaxed block">
                        Ajoutez entre 3 et 6 photos pour maximiser l'intérêt. Incluez la cuisine et la salle de bain !
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER WIZARD NAVIGATION BAR */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/80">
                <button
                  onClick={prevStep}
                  type="button"
                  className={`flex items-center gap-2 border border-slate-250 text-slate-500 font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95 duration-150 bg-white
                  ${step === 1 ? "invisible" : ""}`}
                >
                  Previous Step
                </button>
                
                {step === TOTAL_STEPS ? (
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    type="button"
                    className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0b9062] text-white font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 border-none"
                  >
                    {loading ? "Publishing..." : "Publish Listing 🚀"}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    type="button"
                    className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0b9062] text-white font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none"
                  >
                    Continue to Step {step + 1} →
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
