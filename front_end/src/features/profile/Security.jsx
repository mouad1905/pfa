import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { FaShieldAlt, FaLock, FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

export default function Security() {
  const { user: loggedInUser } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return Swal.fire("Attention", "Le nouveau mot de passe doit contenir au moins 6 caractères.", "warning");
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire("Attention", "Les mots de passe ne correspondent pas.", "warning");
    }
    Swal.fire(
      "Demande enregistrée",
      "La modification du mot de passe sera disponible via l'API utilisateur prochainement.",
      "info"
    );
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-12 font-poppins">
      <main className="max-w-xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FaShieldAlt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Sécurité</h1>
            <p className="text-slate-400 text-xs font-semibold">Protégez votre compte UniConnect</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-5 text-left"
        >
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <FaLock className="text-emerald-500" /> Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <FaKey className="text-emerald-500" /> Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Répétez le mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </main>
    </div>
  );
};
