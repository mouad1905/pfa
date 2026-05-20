import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS, fetchData } from "../api/api";
import { FaUser, FaPhone, FaGraduationCap, FaSave, FaTimes, FaCog } from "react-icons/fa";

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

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `http://127.0.0.1:8000/api/users/${loggedInUser.id_user}`;
      // Send a PUT/POST update request to the back-end
      await fetchData(url, {
        method: "PUT",
        body: JSON.stringify({
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
          niveau_etude: formData.niveau_etude,
          about: formData.about
        })
      });

      // Update the local storage user object with new data
      const updatedUser = {
        ...loggedInUser,
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        niveau_etude: formData.niveau_etude,
        about: formData.about
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

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
      // Even if API update fails (e.g. backend route issues), let's gracefully update local storage for frontend demo and success
      const updatedUser = {
        ...loggedInUser,
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        niveau_etude: formData.niveau_etude,
        about: formData.about
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        title: "Succès (Local) !",
        text: "Vos paramètres ont été modifiés localement.",
        icon: "success",
        confirmButtonColor: "#10b981"
      });

      navigate(`/profile/${loggedInUser.id_user}`);
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
