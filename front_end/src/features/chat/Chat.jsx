import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import EmptyChatState from "./components/EmptyChatState";
import useChat from "./hooks/useChat";

export default function Chat({ noFrame }) {
  const {
    activeConversation,
    messages,
    newMessage,
    searchQuery,
    loadingList,
    loadingMessages,
    conversationsError,
    messagesError,
    sending,
    sendError,
    mobileView,
    currentUser,
    filteredConversations,
    messagesEndRef,
    messagesContainerRef,
    pendingRetryRef,
    setActiveConversation,
    setNewMessage,
    setSearchQuery,
    handleSendMessage,
    retrySend,
    handleStartConversation,
    goBack,
    loadConversations,
    loadMessages,
  } = useChat({ noNavigate: !!noFrame });

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
    <div className={`${noFrame ? "" : "bg-[#f8fafc]"}`}>
      <div
        className={`${noFrame ? "h-full" : "px-0 h-[calc(100vh-112px)] min-h-[500px]"}`}
      >
        <div className="bg-white h-full overflow-hidden flex">
          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredConversations={filteredConversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            loadingList={loadingList}
            conversationsError={conversationsError}
            onRetryConversations={loadConversations}
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
    </div>
  );
}
