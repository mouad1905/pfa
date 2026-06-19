import { FaShieldAlt, FaGraduationCap, FaHome, FaUser } from "react-icons/fa";

export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export const formatDateSeparator = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const formatMessageTime = (timeStr) => {
  if (!timeStr) return "";
  return new Date(timeStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRoleInfo = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return {
        icon: FaShieldAlt,
        iconColor: "text-purple-500",
        label: "Administrateur",
        badge: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "professeur":
      return {
        icon: FaGraduationCap,
        iconColor: "text-emerald-500",
        label: "Enseignant",
        badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
      };
    case "locateur":
    case "proprietaire":
      return {
        icon: FaHome,
        iconColor: "text-amber-500",
        label: "Bailleur",
        badge: "bg-amber-50 text-amber-600 border-amber-200",
      };
    case "etudiant":
    default:
      return {
        icon: FaUser,
        iconColor: "text-blue-500",
        label: "Étudiant",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
      };
  }
};

export const getAvatarUrl = (user, size = 40) => {
  if (user?.photo_profil) return user.photo_profil;
  const name = encodeURIComponent(`${user?.prenom || ""} ${user?.nom || ""}`);
  return `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff&size=${size}&bold=true`;
};

export const isOwnMessage = (msg, currentUser) => {
  if (!msg || !currentUser) return false;
  return Number(msg.id_expediteur) === Number(currentUser.id_user);
};

export const deduplicateMessages = (existing, incoming) => {
  const seen = new Set(existing.map((m) => m.id_message));
  const unique = incoming.filter((m) => !seen.has(m.id_message));
  if (unique.length === 0) return existing;
  return [...existing, ...unique];
};

export const shouldShowDateSeparator = (messages, index) => {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].created_at).toDateString();
  const curr = new Date(messages[index].created_at).toDateString();
  return prev !== curr;
};

export const isNearBottom = (container, threshold = 150) => {
  if (!container) return true;
  return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
};
