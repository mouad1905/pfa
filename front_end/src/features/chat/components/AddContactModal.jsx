import React from "react";
import { FaUserPlus, FaTimes, FaSearch, FaUser } from "react-icons/fa";
import { getRoleInfo } from "../utils";

export default function AddContactModal({
  show,
  onClose,
  searchQuery,
  onSearchChange,
  loading,
  results,
  onSelectUser,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[500px]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-150 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <FaUserPlus className="text-[#10b981]" /> Ajouter un contact
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition cursor-pointer border-none bg-transparent"
            aria-label="Fermer la modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Search Input */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <div className="relative">
            <FaSearch className="text-slate-350 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher par nom, prénom ou email..."
              className="w-full bg-white text-slate-800 pl-11 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981] border border-slate-200 focus:border-transparent transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Modal Results list */}
        <div className="grow overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] font-semibold">Recherche en cours...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FaUser className="mx-auto text-xl text-slate-300 mb-2 animate-pulse" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Aucun utilisateur</p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                Aucun membre éligible ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            results.map((u) => {
              const roleInfo = getRoleInfo(u.role);
              const RoleIcon = roleInfo.icon;
              return (
                <button
                  key={u.id_user}
                  onClick={() => onSelectUser(u.id_user)}
                  className="w-full rounded-2xl p-3 border border-slate-100 hover:border-[#10b981]/30 hover:bg-[#eef5f2] transition-all text-left flex items-start gap-3 cursor-pointer group bg-transparent"
                  aria-label={`Ajouter ${u.prenom} ${u.nom}`}
                >
                  <img
                    src={
                      u.photo_profil ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.prenom + " " + u.nom
                      )}&background=edfdf6&color=10b981&size=40&bold=true`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-xs"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.prenom + " " + u.nom
                      )}&background=edfdf6&color=10b981&size=40&bold=true`;
                    }}
                  />
                  <div className="grow min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-[#10b981] transition-colors capitalize">
                      {u.prenom} {u.nom}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mb-1">
                      {u.email}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <RoleIcon className={`text-[9px] ${roleInfo.iconColor}`} />
                      <span
                        className={`px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase tracking-wide border ${roleInfo.badge}`}
                      >
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
