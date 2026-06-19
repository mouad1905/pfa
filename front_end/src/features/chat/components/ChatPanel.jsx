import { useState, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPanel({
  activeConversation,
  messages,
  loadingMessages,
  messagesError,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sending,
  sendError,
  retrySend,
  currentUser,
  messagesContainerRef,
  messagesEndRef,
  onBack,
  onRetryMessages,
  onRetryMessage,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");

  const filteredMessages = useMemo(() => {
    if (!messageSearchQuery.trim()) return messages;
    return messages.filter((m) =>
      (m.contenu || "").toLowerCase().includes(messageSearchQuery.toLowerCase())
    );
  }, [messages, messageSearchQuery]);

  const handleSearchToggle = () => {
    setShowSearch((prev) => {
      if (prev) {
        setMessageSearchQuery(""); // Clear query when hiding search
      }
      return !prev;
    });
  };

  return (
    <div className="grow flex flex-col h-full bg-white">
      <ChatHeader
        conversation={activeConversation}
        onBack={onBack}
        onSearchToggle={handleSearchToggle}
        showSearch={showSearch}
      />

      {showSearch && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <input
            type="text"
            value={messageSearchQuery}
            onChange={(e) => setMessageSearchQuery(e.target.value)}
            placeholder="Rechercher dans la conversation..."
            className="w-full bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 border border-slate-200"
            autoFocus
            aria-label="Rechercher dans les messages"
          />
        </div>
      )}

      <MessageList
        messages={filteredMessages}
        loading={loadingMessages}
        error={messagesError}
        onRetry={() => onRetryMessages?.(activeConversation?.id_conversation)}
        activeConversation={activeConversation}
        currentUser={currentUser}
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        onRetryMessage={onRetryMessage}
      />

      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        sending={sending}
        sendError={sendError}
        onRetry={retrySend}
        disabled={!activeConversation}
      />
    </div>
  );
}
