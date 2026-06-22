import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const PasswordInput = ({ value, onChange, placeholder, show, toggleShow }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
      placeholder={placeholder}
    />
    <button
      type="button"
      tabIndex={-1}
      onClick={toggleShow}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer border-none bg-transparent p-0"
    >
      {show ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
    </button>
  </div>
);

export default function Security() {
  const { user: loggedInUser } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="p-6 space-y-6">

      {/* Hero Header */}
      <div className="bg-emerald-600 text-white p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Gérer vos paramètres de sécurité</h3>
          <p className="text-white/80 max-w-2xl text-sm">
            Mettez à jour votre mot de passe et configurez l'authentification à deux facteurs pour protéger votre compte académique.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none -mr-10 -mt-10 bg-white rotate-45 rounded-full blur-3xl"></div>
      </div>

      {/* Password Form */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <FaLock className="text-emerald-600 text-xl" />
          <h4 className="text-lg font-bold">Changer le mot de passe</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              MOT DE PASSE ACTUEL
            </label>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              show={showCurrent}
              toggleShow={() => setShowCurrent(!showCurrent)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                NOUVEAU MOT DE PASSE
              </label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                show={showNew}
                toggleShow={() => setShowNew(!showNew)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                CONFIRMER LE MOT DE PASSE
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                show={showConfirm}
                toggleShow={() => setShowConfirm(!showConfirm)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-gray-500 max-w-[60%]">
              Votre mot de passe doit comporter au moins 8 caractères, incluant des chiffres et des symboles.
            </p>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-transform active:scale-95 flex items-center gap-2 text-sm cursor-pointer"
            >
              <FaSave className="text-sm" />
              Mettre à jour
            </button>
          </div>

        </form>
      </section>

    </div>
  );
}
