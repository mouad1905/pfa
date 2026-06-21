const API_BASE_URL = "http://127.0.0.1:8000/api";

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  HEBERGEMENTS: `${API_BASE_URL}/hebergements`,
  HEBERGEMENT_IMAGES: (id) => `${API_BASE_URL}/hebergements/${id}/images`,
  MES_HEBERGEMENTS: `${API_BASE_URL}/mes-hebergements`,
  MES_RESERVATIONS: `${API_BASE_URL}/mes-reservations`,
  reservationStatut: (id) => `${API_BASE_URL}/reservations/${id}/statut`,
  COURS: `${API_BASE_URL}/cours`,
  MES_COURS: `${API_BASE_URL}/mes-cours`,
  PROF_STATS: `${API_BASE_URL}/professeur/statistiques`,
  USER: `${API_BASE_URL}/user`,
  LOGOUT: `${API_BASE_URL}/logout`,
  MESSAGES: `${API_BASE_URL}/messages`,
  MESSAGES_INBOX: `${API_BASE_URL}/messages/inbox`,
  MESSAGES_SENT: `${API_BASE_URL}/messages/sent`,
  MESSAGES_UNREAD: `${API_BASE_URL}/messages/unread-count`,
  messageRead: (id) => `${API_BASE_URL}/messages/${id}/read`,
  SAVE_MEDIA: `${API_BASE_URL}/save-media`,
  CONVERSATIONS: `${API_BASE_URL}/conversations`,
  conversationMessages: (id) => `${API_BASE_URL}/conversations/${id}/messages`,
  sendConversationMessage: (id) => `${API_BASE_URL}/conversations/${id}/messages`,
  conversationRead: (id) => `${API_BASE_URL}/conversations/${id}/read`,
  CONVERSATIONS_UNREAD_TOTAL: `${API_BASE_URL}/conversations/unread-total`,
  CHAT_USERS: `${API_BASE_URL}/chat/users`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATIONS_UNREAD: `${API_BASE_URL}/notifications/unread-count`,
  notificationRead: (id) => `${API_BASE_URL}/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: `${API_BASE_URL}/notifications/read-all`,
  notificationDelete: (id) => `${API_BASE_URL}/notifications/${id}`,
  NOTIFICATIONS_DELETE_ALL: `${API_BASE_URL}/notifications/all`,
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchData = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        (errorData.errors ? Object.values(errorData.errors).flat().join(", ") : null) ||
        errorMessage;
    } catch {
      // Not JSON
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

/** POST/PUT avec FormData (upload fichiers) */
export const fetchFormData = async (url, formData, method = "POST") => {
  const response = await fetch(url, {
    method,
    body: formData,
    headers: authHeaders(),
  });
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        (errorData.errors ? Object.values(errorData.errors).flat().join(", ") : null) ||
        errorMessage;
    } catch {
      // Not JSON
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export default API_BASE_URL;
