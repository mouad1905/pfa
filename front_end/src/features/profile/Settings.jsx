import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_BASE, { API_URLS, fetchData } from "../../api/api";

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
    about: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { user: loggedInUser, updateUser } = useContext(AuthContext);

  const bustCache = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      u.searchParams.set("t", Date.now());
      return u.toString();
    } catch {
      return url;
    }
  };

  useEffect(() => {
    if (!loggedInUser) {
      Swal.fire(
        "Accès refusé",
        "Veuillez vous connecter pour modifier vos paramètres.",
        "warning",
      );
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
          about: userData.about || "",
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
          about: loggedInUser.about || "",
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
      Swal.fire({
        title: "Fichier trop volumineux",
        text: "La photo ne doit pas dépasser 5 Mo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      let apiData = null;

      if (photoFile) {
        const fd = new FormData();
        fd.append("prenom", formData.prenom);
        fd.append("nom", formData.nom);
        if (formData.telephone) fd.append("telephone", formData.telephone);
        if (formData.niveau_etude)
          fd.append("niveau_etude", formData.niveau_etude);
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
            about: formData.about,
          }),
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
        photo_profil: apiData?.photo_profil || loggedInUser.photo_profil,
      };
      updateUser(updatedUser);

      // Visual feedback
      Swal.fire({
        title: "Succès !",
        text: "Vos paramètres ont été modifiés avec succès.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      // Redirect to user's profile
      navigate(`/profile/${loggedInUser.id_user}`);
    } catch (err) {
      console.error("Error updating settings:", err);
      Swal.fire({
        title: "Erreur",
        text: err.message || "Impossible de mettre à jour le profil.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4 font-semibold">
          Chargement des paramètres...
        </p>
      </div>
    );
  }

  const isStudent = loggedInUser && loggedInUser.role === "etudiant";

  const avatarSrc = photoPreview || bustCache(loggedInUser?.photo_profil);

  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-md p-5 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4 shrink-0">Paramètres du compte</h2>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1 overflow-y-auto">
            {/* Photo de profil */}
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    className="w-16 h-16 rounded-full object-cover border"
                    alt=""
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border flex items-center justify-center text-emerald-600 text-lg font-bold">
                    {((loggedInUser?.prenom?.[0] || "") + (loggedInUser?.nom?.[0] || "")).toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-md transition border-none">
                  <span class="text-lg leading-none">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold">Photo de profil</h3>
                <p className="text-sm text-gray-500">JPG, PNG ou WEBP</p>
                {photoFile && (
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    className="text-sm text-red-500 hover:text-red-600 mt-1 cursor-pointer border-none bg-transparent"
                  >
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>
            </div>

            {isStudent && (
              <div>
                <label className="text-sm font-medium">Niveau d'études</label>
                <select
                  name="niveau_etude"
                  value={formData.niveau_etude}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg bg-white"
                >
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="Bac+1">Bac+1</option>
                  <option value="Bac+2">Bac+2</option>
                  <option value="Bac+3">Bac+3</option>
                  <option value="Bac+4">Bac+4</option>
                  <option value="Bac+5">Bac+5</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={2}
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/profile/${loggedInUser.id_user}`)}
                className="px-5 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg cursor-pointer"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
