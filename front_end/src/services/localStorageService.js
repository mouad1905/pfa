const KEYS = {
  TOKEN: "token",
  USER: "user",
  NOTIFICATIONS: "unicons_notifications",
};

export const getToken = () => localStorage.getItem(KEYS.TOKEN);

export const setToken = (token) => localStorage.setItem(KEYS.TOKEN, token);

export const removeToken = () => localStorage.removeItem(KEYS.TOKEN);

export const getUser = () => {
  try {
    const stored = localStorage.getItem(KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user));

export const removeUser = () => localStorage.removeItem(KEYS.USER);

export const clearAuth = () => {
  removeToken();
  removeUser();
};

export const getNotifications = () => {
  try {
    const saved = localStorage.getItem(KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const setNotifications = (notifications) => localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
