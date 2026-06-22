import { FaArrowLeft, FaCircle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getRoleInfo, getAvatarUrl } from "../utils";

export default function ChatHeader({
  conversation,
  onBack,
  onSearchToggle,
  showSearch,
}) {
  const navigate = useNavigate();

  if (!conversation) return null;

  const otherUser = conversation.other_user;
  if (!otherUser) return null;

  const roleInfo = getRoleInfo(otherUser.role);
  const avatarUrl = getAvatarUrl(otherUser, 44);

  const handleViewProfile = () => {
    navigate(`/profile/${otherUser.id_user}`);
  };

  return (
    <header className="bg-white p-4 border-b border-slate-100 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Back button on mobile */}
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-[#eef5f2] hover:text-[#10b981] transition border-none bg-transparent cursor-pointer"
          aria-label="Retour"
        >
          <FaArrowLeft size={14} />
        </button>

        {/* Participant Profile Card */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewProfile}
            className="border-none bg-transparent p-0 cursor-pointer"
            aria-label={`Voir le profil de ${otherUser.prenom} ${otherUser.nom}`}
          >
            <img
              src={avatarUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-xs hover:scale-105 transition-transform"
            />
          </button>
          <div className="text-left">
            <h3 className="font-extrabold text-slate-800 text-sm leading-tight capitalize">
              {otherUser.prenom} {otherUser.nom}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                {roleInfo.label}
              </span>
              <FaCircle className="text-emerald-500 text-[6px]" />
              <button
                onClick={handleViewProfile}
                className="text-[9px] text-[#10b981] font-bold hover:underline cursor-pointer border-none bg-transparent p-0"
              >
                Voir le profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (e.g. Search messages toggle) */}
      <div className="flex items-center gap-2">
        {onSearchToggle && (
          <button
            onClick={onSearchToggle}
            className={`p-2.5 rounded-xl border-none bg-transparent hover:bg-[#eef5f2] transition cursor-pointer ${
              showSearch ? "text-[#10b981]" : "text-slate-400 hover:text-[#10b981]"
            }`}
            aria-label="Rechercher des messages"
            title="Rechercher dans la conversation"
          >
            <FaSearch size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
