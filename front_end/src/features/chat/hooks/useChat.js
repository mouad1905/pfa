import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchData, API_URLS } from "../../../api/api";
import { useAuth } from "../../../hooks/useAuth";

export default function useChat({ noNavigate } = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationsError, setConversationsError] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [activeTab, setActiveTab] = useState("messages");

  const [contacts, setContacts] = useState([]);
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState("");
  const [discoverResults, setDiscoverResults] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesRef = useRef(messages);
  const pollIntervalRef = useRef(null);
  const pendingRetryRef = useRef(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const loadConversations = useCallback(async (autoSelectId = null) => {
    try {
      setLoadingList(true);
      setConversationsError(null);
      const list = await fetchData(API_URLS.CONVERSATIONS);
      setConversations(list);

      const currentConvId = autoSelectId || id;
      if (currentConvId) {
        const found = list.find((c) => String(c.id_conversation) === String(currentConvId));
        if (found) {
          setActiveConversation(found);
          setMobileView("chat");
        }
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
      setConversationsError(err.message || "Impossible de charger les conversations.");
    } finally {
      setLoadingList(false);
    }
  }, [id]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      setLoadingMessages(true);
      setMessagesError(null);
      const result = await fetchData(API_URLS.conversationMessages(conversationId));
      const loaded = result.data || result;
      setMessages(loaded);

      setConversations((prev) =>
        prev.map((c) =>
          c.id_conversation === conversationId ? { ...c, unread_count: 0 } : c
        )
      );

      try {
        await fetchData(API_URLS.conversationRead(conversationId), { method: "PUT" });
      } catch { /* silent */ }
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessagesError(err.message || "Impossible de charger les messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    loadMessages(activeConversation.id_conversation);

    const startPolling = () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        try {
          const result = await fetchData(
            API_URLS.conversationMessages(activeConversation.id_conversation)
          );
          const incoming = result.data || result;
          const currentMessages = messagesRef.current;

          const seen = new Set(currentMessages.map((m) => m.id_message));
          const newMsgs = incoming.filter((m) => !seen.has(m.id_message));

          if (newMsgs.length > 0) {
            setMessages((prev) => [...prev, ...newMsgs]);
          }

          const convUpdate = incoming[incoming.length - 1];
          if (convUpdate) {
            setConversations((prev) =>
              prev.map((c) =>
                c.id_conversation === activeConversation.id_conversation
                  ? {
                      ...c,
                      dernier_message: {
                        id_message: convUpdate.id_message,
                        contenu: convUpdate.contenu,
                        created_at: convUpdate.created_at,
                        id_expediteur: convUpdate.id_expediteur,
                        statut: convUpdate.statut,
                      },
                      updated_at: convUpdate.created_at,
                      unread_count: 0,
                    }
                  : c
              )
            );
          }
        } catch { /* silent */
        }
      }, 4000);
    };

    startPolling();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [activeConversation, loadMessages]);

  const handleSendMessage = useCallback(async (textOverride) => {
    const text = (textOverride || newMessage).trim();
    if (!text || sending || !activeConversation) return null;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id_message: tempId,
      contenu: text,
      id_expediteur: currentUser?.id_user,
      created_at: new Date().toISOString(),
      statut: "envoi",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setSending(true);
    setSendError(null);

    try {
      const response = await fetchData(
        API_URLS.sendConversationMessage(activeConversation.id_conversation),
        { method: "POST", body: JSON.stringify({ contenu: text }) }
      );
      const sentMsg = response.data || response;

      setMessages((prev) => {
        const hasReal = prev.some((m) => m.id_message === sentMsg.id_message);
        if (hasReal) return prev.filter((m) => m.id_message !== tempId);
        return prev.map((m) =>
          m.id_message === tempId ? { ...sentMsg, statut: "envoye" } : m
        );
      });
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id_conversation === activeConversation.id_conversation
            ? {
                ...c,
                dernier_message: {
                  id_message: sentMsg.id_message,
                  contenu: sentMsg.contenu,
                  created_at: sentMsg.created_at,
                  id_expediteur: sentMsg.id_expediteur,
                  statut: sentMsg.statut,
                },
                updated_at: sentMsg.created_at,
              }
            : c
        );
        return updated.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });
      pendingRetryRef.current = null;
      return sentMsg;
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id_message === tempId ? { ...m, statut: "erreur", _error: true, _tempId: tempId } : m
        )
      );
      pendingRetryRef.current = { tempId, text };
      setSendError("Échec de l'envoi");
      return null;
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, activeConversation, currentUser]);

  const retrySend = useCallback(async () => {
    if (!pendingRetryRef.current) return;
    const { tempId, text } = pendingRetryRef.current;
    setMessages((prev) =>
      prev.map((m) => (m.id_message === tempId ? { ...m, statut: "envoi", _error: false } : m))
    );
    setSending(true);
    setSendError(null);

    try {
      const response = await fetchData(
        API_URLS.sendConversationMessage(activeConversation.id_conversation),
        { method: "POST", body: JSON.stringify({ contenu: text }) }
      );
      const sentMsg = response.data || response;
      setMessages((prev) => {
        const hasReal = prev.some((m) => m.id_message === sentMsg.id_message);
        if (hasReal) return prev.filter((m) => m.id_message !== tempId);
        return prev.map((m) =>
          m.id_message === tempId ? { ...sentMsg, statut: "envoye" } : m
        );
      });
      pendingRetryRef.current = null;
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id_message === tempId ? { ...m, statut: "erreur", _error: true } : m
        )
      );
      setSendError("Toujours impossible d'envoyer");
    } finally {
      setSending(false);
    }
  }, [activeConversation]);

  const handleStartConversation = useCallback(async (userId) => {
    try {
      Swal.showLoading();
      const response = await fetchData(API_URLS.CONVERSATIONS, {
        method: "POST",
        body: JSON.stringify({ id_destinataire: userId }),
      });
      Swal.close();
      const conversationId = response.id_conversation || response.data?.id_conversation;

      setShowAddContactModal(false);
      setDiscoverSearchQuery("");

      await loadConversations(conversationId);
      setActiveTab("messages");
      if (!noNavigate) {
        navigate(`/chat/${conversationId}`);
      }
      setMobileView("chat");
    } catch (err) {
      Swal.fire("Erreur", err.message || "Impossible d'ouvrir la conversation.", "error");
    }
  }, [navigate, loadConversations, noNavigate]);

  const handleSelectConversation = useCallback((conv) => {
    setActiveConversation(conv);
    if (!noNavigate) {
      navigate(`/chat/${conv.id_conversation}`);
    }
    setMobileView("chat");
  }, [navigate, noNavigate]);

  const loadContacts = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingContacts(true);
      const data = await fetchData(API_URLS.CHAT_USERS);
      setContacts(data.data || data);
    } catch (err) {
      console.error("Error loading contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "contacts") loadContacts();
  }, [activeTab, loadContacts]);

  useEffect(() => {
    if (!showAddContactModal) return;
    const timer = setTimeout(async () => {
      setLoadingDiscover(true);
      try {
        const url = discoverSearchQuery
          ? `${API_URLS.CHAT_USERS}?search=${encodeURIComponent(discoverSearchQuery)}`
          : API_URLS.CHAT_USERS;
        const data = await fetchData(url);
        setDiscoverResults(data.data || data);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setLoadingDiscover(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [discoverSearchQuery, showAddContactModal]);

  const goBack = useCallback(() => {
    setMobileView("list");
    navigate("/chat");
  }, [navigate]);

  const filteredConversations = useMemo(
    () =>
      conversations.filter((c) => {
        if (!c.other_user) return false;
        const name = `${c.other_user.prenom} ${c.other_user.nom}`.toLowerCase();
        const role = (c.other_user.role || "").toLowerCase();
        const q = searchQuery.toLowerCase();
        return name.includes(q) || role.includes(q);
      }),
    [conversations, searchQuery]
  );

  const filteredContacts = useMemo(
    () =>
      contacts.filter((c) => {
        const name = `${c.prenom} ${c.nom}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        const role = (c.role || "").toLowerCase();
        const q = contactSearchQuery.toLowerCase();
        return name.includes(q) || email.includes(q) || role.includes(q);
      }),
    [contacts, contactSearchQuery]
  );

  return {
    conversations,
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
    contacts,
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
    setActiveConversation: handleSelectConversation,
    setNewMessage,
    setSearchQuery,
    setContactSearchQuery,
    setMobileView,
    setActiveTab,
    setShowAddContactModal,
    setDiscoverSearchQuery,
    handleSendMessage,
    retrySend,
    handleStartConversation,
    goBack,
    loadConversations,
    loadMessages,
  };
}
