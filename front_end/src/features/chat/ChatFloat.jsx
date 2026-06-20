import { useState, useEffect, useContext } from "react";
import { FaCommentDots, FaTimes, FaCheck, FaCheckDouble, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchData, API_URLS } from "../../api/api";

export default function ChatFloat() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchConvs = async () => {
      setLoading(true);
      try {
        const data = await fetchData(API_URLS.CONVERSATIONS);
        const list = Array.isArray(data) ? data : data.data || [];
        setConversations(list.slice(0, 5));
        const unread = list.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        setTotalUnread(unread);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleOpenChat = (convId) => {
    setOpen(false);
    navigate(`/chat/${convId}`);
  };

  const handleSeeAll = () => {
    setOpen(false);
    navigate("/chat");
  };

  if (!isAuthenticated || isChatPage) return null;

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#10b981] hover:bg-[#0b9062] active:scale-90 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all cursor-pointer border-none group"
        aria-label="Messages"
      >
        <span className="absolute inset-0 rounded-full bg-[#10b981] animate-ping opacity-30 group-hover:opacity-40" />
        <FaCommentDots size={20} className="relative z-10" />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px] font-black leading-none px-1 shadow-lg shadow-red-500/30 animate-bounce z-20">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-white">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <FaCommentDots className="text-[#10b981] text-xs" />
              Messages
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none">
                  {totalUnread}
                </span>
              )}
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 flex items-center justify-center transition cursor-pointer border-none"
            >
              <FaTimes size={11} />
            </button>
          </div>

          <div className="grow overflow-y-auto max-h-80 scrollbar-thin">
            {loading && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <FaCommentDots className="text-slate-200 text-4xl mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">Aucune conversation</p>
                <p className="text-[11px] text-slate-300 font-semibold mt-1">
                  Commencez une discussion depuis une annonce
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {conversations.map((conv) => {
                  const other = conv.other_user || {};
                  const lastMsg = conv.dernier_message;
                  const isUnread = (conv.unread_count || 0) > 0;
                  const initials = ((other.prenom?.[0] || "") + (other.nom?.[0] || "")).toUpperCase();
                  const avatarUrl = other.photo_profil;
                  return (
                    <button
                      key={conv.id_conversation}
                      onClick={() => handleOpenChat(conv.id_conversation)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition cursor-pointer border-none hover:bg-slate-50 ${
                        isUnread ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="grow min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs truncate ${isUnread ? "font-extrabold text-slate-800" : "font-bold text-slate-600"}`}>
                            {other.prenom || ""} {other.nom || ""}
                          </span>
                          {lastMsg && (
                            <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                              {formatTime(lastMsg.created_at)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {lastMsg && lastMsg.id_expediteur !== other.id_user && (
                            <span className="text-[9px] text-slate-300 shrink-0">
                              {lastMsg.statut === "lu" ? <FaCheckDouble className="text-emerald-500" /> : <FaCheck className="text-slate-300" />}
                            </span>
                          )}
                          <p className={`text-[11px] truncate ${isUnread ? "font-bold text-slate-700" : "text-slate-400"}`}>
                            {lastMsg ? lastMsg.contenu : "Démarrez la conversation"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleSeeAll}
            className="flex items-center justify-center gap-2 py-3.5 px-4 border-t border-slate-100 text-[11px] font-extrabold text-[#10b981] hover:bg-emerald-50/50 transition cursor-pointer border-x-0 border-b-0 bg-white"
          >
            Voir tous les messages
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
