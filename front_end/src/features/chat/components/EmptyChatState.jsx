import React from "react";
import { FaCommentDots } from "react-icons/fa";

export default function EmptyChatState() {
  return (
    <div className="grow flex flex-col items-center justify-center text-center p-8 bg-[#f8fafc]/50">
      <div className="w-20 h-20 rounded-3xl bg-[#edfdf6] border border-emerald-100 flex items-center justify-center text-[#10b981] mb-5 shadow-sm animate-pulse">
        <FaCommentDots size={36} />
      </div>
      <h3 className="font-extrabold text-slate-800 text-base mb-1.5">
        Discussions Privées
      </h3>
      <p className="text-xs text-slate-450 max-w-[280px] leading-relaxed">
        Sélectionnez l'une de vos conversations en cours dans le volet de gauche ou recherchez un contact pour initier un échange.
      </p>
    </div>
  );
}
