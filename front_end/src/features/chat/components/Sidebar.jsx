import { FaCommentDots, FaSearch } from "react-icons/fa";
import ConversationList from "./ConversationList";

export default function Sidebar({
  searchQuery,
  setSearchQuery,
  filteredConversations,
  activeConversation,
  setActiveConversation,
  loadingList,
  conversationsError,
  onRetryConversations,
  mobileView,
  currentUser,
}) {
  return (
    <aside
      className={`w-full md:w-80 border-r border-slate-100 flex flex-col h-full shrink-0 bg-white transition-all duration-300 ${
        mobileView === "chat" ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="p-5 border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4 tracking-tight">
          <FaCommentDots className="text-[#10b981]" /> Messagerie
        </h1>

        <div className="relative">
          <FaSearch className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une discussion..."
            className="w-full bg-[#f8fafc] text-slate-850 pl-11 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:bg-white border border-slate-200/60 transition-all"
            aria-label="Rechercher une discussion"
          />
        </div>
      </div>

      <div className="grow overflow-y-auto p-3 space-y-1 scrollbar-thin bg-[#eef5f2]/10">
        <ConversationList
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onSelect={setActiveConversation}
          loading={loadingList}
          error={conversationsError}
          onRetry={onRetryConversations}
          searchQuery={searchQuery}
          currentUser={currentUser}
        />
      </div>
    </aside>
  );
}
