import React from "react";
import { FaClock, FaCheck, FaCheckDouble, FaExclamationCircle, FaRedo } from "react-icons/fa";
import { formatMessageTime } from "../utils";

export default function MessageBubble({ message, isOwn, onRetry }) {
  const isError = message.statut === "erreur" || message._error;
  const isSending = message.statut === "envoi";
  const isRead = message.statut === "lu";
  const isSent = message.statut === "envoye" || message.statut === "envoyé" || message.statut === "lu";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`relative max-w-[70%] px-4 py-2.5 text-xs shadow-xs leading-relaxed text-left transition-all duration-200
          ${
            isOwn
              ? "bg-[#edfdf6] text-emerald-800 border border-emerald-100/60 rounded-2xl rounded-tr-none"
              : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none"
          }
          ${isError ? "border-red-200 bg-red-50 text-red-800" : ""}
          ${isSending ? "opacity-70" : ""}
        `}
      >
        <p className="font-semibold break-words whitespace-pre-wrap">
          {message.contenu}
        </p>

        <div
          className={`flex items-center gap-1 mt-1 text-[8px] opacity-75 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <FaClock className="text-[7px]" />
          <span>{formatMessageTime(message.created_at)}</span>

          {isOwn && (
            <span className="flex items-center ml-1">
              {isSending && <FaClock className="animate-pulse" />}
              {isSent && !isRead && <FaCheck />}
              {isRead && <FaCheckDouble className="text-emerald-600" />}
              {isError && <FaExclamationCircle className="text-red-500" />}
            </span>
          )}
        </div>

        {isError && onRetry && (
          <button
            onClick={onRetry}
            className="absolute -bottom-2 -left-6 p-1 bg-red-50 rounded-full border border-red-200 text-red-500 hover:bg-red-100 transition cursor-pointer flex items-center justify-center"
            aria-label="Réessayer d'envoyer le message"
            title="Réessayer l'envoi"
          >
            <FaRedo size={8} className="animate-spin-once" />
          </button>
        )}
      </div>
    </div>
  );
}
