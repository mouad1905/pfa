import { createContext, useState, useMemo } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("unicons_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const value = useMemo(() => ({ notifications, setNotifications }), [notifications]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
