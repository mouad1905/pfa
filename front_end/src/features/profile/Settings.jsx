import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_BASE, { API_URLS, fetchData } from "../../api/api";
import { FaUser, FaPhone, FaGraduationCap, FaSave, FaTimes, FaCog, FaCamera } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    niveau_etude: "",
    about: ""
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { user: loggedInUser, updateUser } = useContext(AuthContext);

  const bustCache = (url) => {
    if (!url) return null;
    try { const u = new URL(url); u.searchParams.set("t", Date.now()); return u.toString(); } catch { return url; }
  };

  useEffect(() => {
    if (!loggedInUser) {
      Swal.fire("Accès refusé", "Veuillez vous connecter pour modifier vos paramètres.", "warning");
      navigate("/login");
      return;
    }

    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        // Fetch fresh details from the backend to populate the form
        const url = `http://127.0.0.1:8000/api/users/${loggedInUser.id_user}`;
        const res = await fetchData(url);
        const userData = res.data || res;
        
        setFormData({
          prenom: userData.prenom || "",
          nom: userData.nom || "",
          email: userData.email || "",
          telephone: userData.telephone || "",
          niveau_etude: userData.niveau_etude || "",
          about: userData.about || ""
        });
      } catch (err) {
        console.error("Error loading user settings:", err);
        // Fallback to local storage if API call fails
        setFormData({
          prenom: loggedInUser.prenom || "",
          nom: loggedInUser.nom || "",
          email: loggedInUser.email || "",
          telephone: loggedInUser.telephone || "",
          niveau_etude: loggedInUser.niveau_etude || "",
          about: loggedInUser.about || ""
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ title: "Fichier trop volumineux", text: "La photo ne doit pas dépasser 5 Mo.", icon: "error", confirmButtonColor: "#ef4444" });
      e.target.value = "";
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${API_BASE}/users/${loggedInUser.id_user}`;
      let body;
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      let apiData = null;

      if (photoFile) {
        const fd = new FormData();
        fd.append("prenom", formData.prenom);
        fd.append("nom", formData.nom);
        if (formData.telephone) fd.append("telephone", formData.telephone);
        if (formData.niveau_etude) fd.append("niveau_etude", formData.niveau_etude);
        if (formData.about) fd.append("about", formData.about);
        fd.append("photo_profil", photoFile);
        const res = await fetch(url, { method: "POST", headers, body: fd });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Erreur lors de la mise à jour");
        }
        const resJson = await res.json();
        apiData = resJson.data || null;
      } else {
        const res = await fetchData(url, {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: formData.prenom,
            nom: formData.nom,
            telephone: formData.telephone,
            niveau_etude: formData.niveau_etude,
            about: formData.about
          })
        });
        apiData = res.data || null;
      }

      // Update the local storage user object with new data
      const updatedUser = {
        ...loggedInUser,
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        niveau_etude: formData.niveau_etude,
        about: formData.about,
        photo_profil: apiData?.photo_profil || loggedInUser.photo_profil
      };
      updateUser(updatedUser);

      // Visual feedback
      Swal.fire({
        title: "Succès !",
        text: "Vos paramètres ont été modifiés avec succès.",
        icon: "success",
        confirmButtonColor: "#10b981"
      });

      // Redirect to user's profile
      navigate(`/profile/${loggedInUser.id_user}`);
    } catch (err) {
      console.error("Error updating settings:", err);
      Swal.fire({
        title: "Erreur",
        text: err.message || "Impossible de mettre à jour le profil.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4 font-semibold">Chargement des paramètres...</p>
      </div>
    );
  }

  const isStudent = loggedInUser && loggedInUser.role === "etudiant";

  return (
    <div className="bg-[#f8f9ff] mt-20 min-h-screen font-sans">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          
          {/* Header block */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FaCog size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Paramètres du compte</h1>
              <p className="text-slate-400 text-xs mt-0.5">Modifiez vos informations personnelles et mettez à jour votre compte.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo de profil */}
            <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-slate-200 overflow-hidden flex items-center justify-center text-emerald-600 text-2xl font-bold">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                  ) : loggedInUser?.photo_profil ? (
                    <img src={bustCache(loggedInUser.photo_profil)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    ((loggedInUser?.prenom?.[0] || "") + (loggedInUser?.nom?.[0] || "")).toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-md shadow-emerald-200 transition border-none">
                  <FaCamera size={12} />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Photo de profil</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">JPG, PNG ou WEBP. Max 2 Mo.</p>
                {photoFile && (
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    className="text-[11px] text-red-500 font-bold hover:text-red-600 mt-1 cursor-pointer border-none bg-transparent"
                  >
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Prénom */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <FaUser className="text-slate-400 text-[10px]" /> Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-slate-50/50"
                  required
                />
              </div>

              {/* Nom */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <FaUser className="text-slate-400 text-[10px]" /> Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-slate-50/50"
                  required
                />
              </div>

              {/* Email Address (Read-only for safety/security) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Adresse Email (Non modifiable)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-slate-100 rounded-xl p-3.5 text-xs font-semibold text-slate-400 bg-slate-50 cursor-not-allowed"
                />
              </div>

              {/* Numéro de Téléphone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <FaPhone className="text-slate-400 text-[10px]" /> Numéro de Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Ex: 06 12 34 56 78"
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-slate-50/50"
                />
              </div>

              {/* Niveau d'études (Visible & required only for Student role) */}
              {isStudent && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <FaGraduationCap className="text-slate-400 text-sm" /> Niveau d'études
                  </label>
                  <select
                    name="niveau_etude"
                    value={formData.niveau_etude}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="">Sélectionnez votre niveau d'études</option>
                    <option value="Bac+1">Bac+1</option>
                    <option value="Bac+2">Bac+2</option>
                    <option value="Bac+3">Bac+3</option>
                    <option value="Bac+4">Bac+4</option>
                    <option value="Bac+5">Bac+5</option>
                  </select>
                </div>
              )}

              {/* About/Description field */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Description / À propos de vous
                </label>
                <textarea
                  rows={4}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Parlez de vous, vos centres d'intérêt, etc."
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-slate-50/50 resize-none"
                />
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(`/profile/${loggedInUser.id_user}`)}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaTimes /> Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                {loading ? "Enregistrement..." : (
                  <>
                    <FaSave /> Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
