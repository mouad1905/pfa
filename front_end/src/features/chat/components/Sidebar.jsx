import { FaCommentDots, FaSearch, FaUsers, FaUserPlus } from "react-icons/fa";
import ConversationList from "./ConversationList";
import ContactList from "./ContactList";

export default function Sidebar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  contactSearchQuery,
  setContactSearchQuery,
  filteredConversations,
  filteredContacts,
  activeConversation,
  setActiveConversation,
  loadingList,
  conversationsError,
  onRetryConversations,
  loadingContacts,
  onStartConversation,
  setShowAddContactModal,
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

        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-none ${
              activeTab === "messages"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700 bg-transparent"
            }`}
            aria-label="Voir les discussions"
          >
            <FaCommentDots className="text-xs" />
            <span>Discussions</span>
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border-none ${
              activeTab === "contacts"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700 bg-transparent"
            }`}
            aria-label="Voir les contacts"
          >
            <FaUsers className="text-xs" />
            <span>Contacts</span>
          </button>
        </div>

        {activeTab === "messages" ? (
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
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FaSearch className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
              <input
                type="text"
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                placeholder="Rechercher un contact..."
                className="w-full bg-[#f8fafc] text-slate-850 pl-11 pr-4 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:bg-white border border-slate-200/60 transition-all"
                aria-label="Rechercher un contact"
              />
            </div>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="px-3 bg-[#10b981] hover:bg-[#0b9062] active:scale-95 text-white rounded-2xl text-xs font-bold flex items-center gap-1 transition cursor-pointer border-none shrink-0 shadow-sm shadow-emerald-500/10"
              title="Ajouter un contact"
              aria-label="Ajouter un contact"
            >
              <FaUserPlus size={13} />
            </button>
          </div>
        )}
      </div>

      <div className="grow overflow-y-auto p-3 space-y-1 scrollbar-thin bg-[#eef5f2]/10">
        {activeTab === "messages" ? (
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
        ) : (
          <ContactList
            contacts={filteredContacts}
            loading={loadingContacts}
            searchQuery={contactSearchQuery}
            onStartConversation={onStartConversation}
          />
        )}
      </div>
    </aside>
  );
}
