import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import EmptyChatState from "./components/EmptyChatState";
import AddContactModal from "./components/AddContactModal";
import useChat from "./hooks/useChat";

export default function Chat() {
  const {
    activeConversation,
    messages,
    newMessage,
    searchQuery,
    contactSearchQuery,
    loadingList,
    loadingMessages,
    conversationsError,
    messagesError,
    sending,
    sendError,
    mobileView,
    activeTab,
    loadingContacts,
    showAddContactModal,
    discoverSearchQuery,
    discoverResults,
    loadingDiscover,
    currentUser,
    filteredConversations,
    filteredContacts,
    messagesEndRef,
    messagesContainerRef,
    pendingRetryRef,
    setActiveConversation,
    setNewMessage,
    setSearchQuery,
    setContactSearchQuery,
    setActiveTab,
    setShowAddContactModal,
    setDiscoverSearchQuery,
    handleSendMessage,
    retrySend,
    handleStartConversation,
    goBack,
    loadConversations,
    loadMessages,
  } = useChat();

  const handleRetryMessages = () => {
    if (activeConversation) loadMessages(activeConversation.id_conversation);
  };

  const handleRetryMessage = (tempId) => {
    const failedMsg = messages.find((m) => m.id_message === tempId && m._error);
    if (failedMsg) {
      pendingRetryRef.current = { tempId, text: failedMsg.contenu };
      retrySend();
    }
  };

  return (
    <div className="bg-[#f8fafc] pt-20 pb-4 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-[calc(100vh-100px)] min-h-[500px]">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            contactSearchQuery={contactSearchQuery}
            setContactSearchQuery={setContactSearchQuery}
            filteredConversations={filteredConversations}
            filteredContacts={filteredContacts}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            loadingList={loadingList}
            conversationsError={conversationsError}
            onRetryConversations={loadConversations}
            loadingContacts={loadingContacts}
            onStartConversation={handleStartConversation}
            setShowAddContactModal={setShowAddContactModal}
            mobileView={mobileView}
            currentUser={currentUser}
          />

          <main
            className={`grow flex flex-col transition-all duration-300 ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}
          >
            {activeConversation ? (
              <ChatPanel
                activeConversation={activeConversation}
                messages={messages}
                loadingMessages={loadingMessages}
                messagesError={messagesError}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                sending={sending}
                sendError={sendError}
                retrySend={retrySend}
                currentUser={currentUser}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                onBack={goBack}
                onRetryMessages={handleRetryMessages}
                onRetryMessage={handleRetryMessage}
              />
            ) : (
              <EmptyChatState />
            )}
          </main>
        </div>
      </div>

      <AddContactModal
        show={showAddContactModal}
        onClose={() => {
          setShowAddContactModal(false);
          setDiscoverSearchQuery("");
        }}
        searchQuery={discoverSearchQuery}
        onSearchChange={setDiscoverSearchQuery}
        results={discoverResults}
        loading={loadingDiscover}
        onSelectUser={handleStartConversation}
      />
    </div>
  );
}
