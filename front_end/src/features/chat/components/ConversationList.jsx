import React from "react";
import { FaRegPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import { getRoleInfo, getAvatarUrl, formatTime } from "../utils";

export default function ConversationList({
  conversations,
  activeConversation,
  onSelect,
  loading,
  error,
  onRetry,
  searchQuery,
  currentUser,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Chargement des discussions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center px-4">
        <FaExclamationTriangle className="mx-auto text-2xl text-amber-500 mb-3" />
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
          Erreur de chargement
        </p>
        <p className="text-[11px] text-slate-400 mb-3">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-[#10b981] hover:bg-[#0b9062] text-white text-[11px] font-bold rounded-xl transition cursor-pointer border-none"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 px-4">
        <FaRegPaperPlane className="mx-auto text-2xl text-slate-350 mb-3 animate-bounce" />
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
          Aucune discussion
        </p>
        <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
          {searchQuery
            ? "Aucun salon ne correspond à votre recherche."
            : "Démarrez une discussion depuis le profil d'un membre ou l'onglet Contacts."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => {
        const isActive = activeConversation?.id_conversation === conv.id_conversation;
        const otherUser = conv.other_user;
        if (!otherUser) return null;

        const roleInfo = getRoleInfo(otherUser.role);
        const RoleIcon = roleInfo.icon;
        const avatarUrl = getAvatarUrl(otherUser);

        const isOwnLast =
          conv.dernier_message &&
          currentUser &&
          Number(conv.dernier_message.id_expediteur) === Number(currentUser.id_user);

        return (
          <button
            key={conv.id_conversation}
            onClick={() => onSelect(conv)}
            className={`w-full rounded-2xl p-3.5 transition-all text-left flex items-start gap-3 border border-transparent cursor-pointer bg-transparent ${
              isActive
                ? "bg-[#edfdf6] border-emerald-100/50 shadow-xs"
                : "hover:bg-[#eef5f2]/40"
            }`}
            aria-label={`Discussion avec ${otherUser.prenom} ${otherUser.nom}`}
          >
            <div className="relative shrink-0 mt-0.5">
              <img
                src={avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-slate-100"
              />
              {conv.unread_count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border border-white animate-pulse">
                  {conv.unread_count}
                </span>
              )}
            </div>

            <div className="grow min-w-0">
              <div className="flex justify-between items-baseline gap-1 mb-0.5">
                <h4 className="font-bold text-slate-800 text-xs truncate capitalize">
                  {otherUser.prenom} {otherUser.nom}
                </h4>
                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                  {formatTime(conv.dernier_message?.created_at || conv.updated_at)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-1.5">
                <RoleIcon className={`text-[9px] ${roleInfo.iconColor}`} />
                <span
                  className={`px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase tracking-wide border ${roleInfo.badge}`}
                >
                  {roleInfo.label}
                </span>
              </div>

              <p
                className={`text-[11px] truncate leading-relaxed ${
                  conv.unread_count > 0 ? "font-bold text-slate-800" : "text-slate-400"
                }`}
              >
                {conv.dernier_message ? (
                  isOwnLast ? (
                    `Vous : ${conv.dernier_message.contenu}`
                  ) : (
                    conv.dernier_message.contenu
                  )
                ) : (
                  <span className="italic text-slate-350">Aucun message</span>
                )}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
