import React from "react";
import { FaUser } from "react-icons/fa";
import { getRoleInfo, getAvatarUrl } from "../utils";

export default function ContactList({
  contacts,
  loading,
  searchQuery,
  onStartConversation,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Chargement des contacts...</span>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 px-4">
        <FaUser className="mx-auto text-2xl text-slate-300 mb-3" />
        <p className="text-xs font-bold text-slate-705 uppercase tracking-widest mb-1">
          Aucun contact
        </p>
        <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
          {searchQuery
            ? "Aucun contact ne correspond."
            : "Aucun utilisateur éligible trouvé."}
        </p>
      </div>
    );
  }

  return (
    <>
      {contacts.map((contact) => {
        const roleInfo = getRoleInfo(contact.role);
        const RoleIcon = roleInfo.icon;
        const avatarUrl = getAvatarUrl(contact);

        return (
          <button
            key={contact.id_user}
            onClick={() => onStartConversation(contact.id_user)}
            className="w-full rounded-2xl p-3.5 transition-all text-left flex items-start gap-3 border border-transparent hover:bg-[#eef5f2]/40 hover:border-emerald-100/20 cursor-pointer group bg-transparent"
            aria-label={`Contacter ${contact.prenom} ${contact.nom}`}
          >
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-slate-100"
            />
            <div className="grow min-w-0">
              <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-[#10b981] transition-colors capitalize">
                {contact.prenom} {contact.nom}
              </h4>
              <p className="text-[10px] text-slate-450 truncate mb-1">{contact.email}</p>
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
      })}
    </>
  );
}
