import React from "react";
import { FaExclamationTriangle, FaCommentAlt } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import { isOwnMessage, shouldShowDateSeparator, formatDateSeparator } from "../utils";

export default function MessageList({
  messages,
  loading,
  error,
  onRetry,
  currentUser,
  messagesContainerRef,
  messagesEndRef,
  onRetryMessage,
}) {
  if (loading) {
    return (
      <div className="grow overflow-y-auto p-6 flex flex-col items-center justify-center text-slate-400 gap-3 h-full">
        <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Chargement des messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grow overflow-y-auto p-6 flex flex-col items-center justify-center text-center h-full px-4">
        <FaExclamationTriangle className="mx-auto text-2xl text-amber-500 mb-3" />
        <p className="text-xs font-bold text-slate-705 uppercase tracking-widest mb-1">
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

  if (messages.length === 0) {
    return (
      <div className="grow overflow-y-auto p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-16 h-16 rounded-3xl bg-[#edfdf6] flex items-center justify-center text-[#10b981] mb-4 shadow-xs">
          <FaCommentAlt size={22} className="animate-pulse" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-sm mb-1">Dites bonjour !</h3>
        <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
          Écrivez votre premier message pour lancer la discussion.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="grow overflow-y-auto p-6 space-y-4 scrollbar-thin bg-[#f8fafc]/30 flex flex-col"
    >
      {messages.map((msg, index) => {
        const isOwn = isOwnMessage(msg, currentUser);
        const showDateSeparator = shouldShowDateSeparator(messages, index);

        return (
          <div key={msg.id_message || index} className="flex flex-col">
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="bg-[#eef5f2] text-emerald-800 text-[9px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-100/30">
                  {formatDateSeparator(msg.created_at)}
                </span>
              </div>
            )}

            <MessageBubble
              message={msg}
              isOwn={isOwn}
              onRetry={onRetryMessage ? () => onRetryMessage(msg.id_message) : undefined}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
