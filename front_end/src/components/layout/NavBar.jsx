import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaBell,
  FaCheck,
  FaTrash,
  FaInfoCircle,
  FaCheckDouble,
  FaChartBar,
  FaCommentDots,
} from "react-icons/fa";
import { fetchData, API_URLS } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigate = useNavigate();
  const { token, user: loggedInUser, logout } = useContext(AuthContext);
  const location = useLocation();

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("unicons_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing notifications", e);
      }
    }
    return [
      {
        id: 1,
        title: "Annonce Publiée",
        text: "Félicitations ! Votre colocation 'Studio Lumineux Agdal' a été approuvée et est en ligne. 🎉",
        time: "Il y a 5 min",
        unread: true,
        type: "success",
      },
      {
        id: 2,
        title: "Demande de Coloc",
        text: "Ahmed a envoyé une demande pour rejoindre votre colocation à Agdal. 🏠",
        time: "Il y a 1 heure",
        unread: true,
        type: "request",
      },
      {
        id: 3,
        title: "Cours Confirmé",
        text: "Prof. Bensaid a accepté votre cours de révision en Algèbre pour demain à 14h. 📚",
        time: "Il y a 2 heures",
        unread: false,
        type: "info",
      },
      {
        id: 4,
        title: "Profil Incomplet",
        text: "Pensez à ajouter votre niveau d'études dans les paramètres pour de meilleures suggestions. ⚙️",
        time: "Il y a 1 jour",
        unread: false,
        type: "warning",
      },
    ];
  });

  const bustCache = (url) => {
    if (!url) return null;
    try { const u = new URL(url); u.searchParams.set("t", Date.now()); return u.toString(); } catch { return url; }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      "unicons_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  const profileMenuLinkClass = (pathMatch) => {
    const isActive =
      typeof pathMatch === "function"
        ? pathMatch(location.pathname)
        : location.pathname === pathMatch ||
          location.pathname.startsWith(`${pathMatch}/`);
    return `flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition duration-150 ${
      isActive
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
    }`;
  };

  const profileMenuIconClass = (pathMatch) => {
    const isActive =
      typeof pathMatch === "function"
        ? pathMatch(location.pathname)
        : location.pathname === pathMatch ||
          location.pathname.startsWith(`${pathMatch}/`);
    return `${isActive ? "text-emerald-500" : "text-slate-300"} text-sm`;
  };

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuOpen(false);
      setDropdownOpen(false);
      setNotificationsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location]);

  const isScrolledOrNotHome = scrolled || !isHome;

  const navLinkStyles = `font-semibold text-lg transition-colors duration-300 hover:text-emerald-500 ${
    isScrolledOrNotHome ? "text-slate-800" : "text-white"
  }`;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleNotificationRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)),
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-500">
      {/* TOP MINI NAV — desktop only */}
      <div className="bg-[#0b1716] border-b border-emerald-900/30 py-2 px-4 md:px-12 hidden lg:flex justify-between items-center text-[11px] font-medium text-slate-300">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1">
            Welcome to{" "}
            <span className="text-emerald-400 font-bold">Uniconnect</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>Connect, Study, Live Better.</span>
        </div>
        <div className="flex items-center gap-5">
          {!token && (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors uppercase tracking-wider text-[10px] font-bold"
            >
              <FaUser className="text-emerald-500" /> Login
            </Link>
          )}
        </div>
      </div>

      {/* MAIN NAV */}
      <nav
        className={`transition-all duration-500 px-4 md:px-12 py-4 flex justify-between items-center ${
          isScrolledOrNotHome || menuOpen
            ? "bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 shadow-xl"
            : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className={`text-3xl font-black tracking-tight transition-colors duration-500 ${
              isScrolledOrNotHome ? "text-slate-900" : "text-white"
            }`}
          >
            Uni<span className="text-[#10b981]">Connect</span>
          </span>
        </Link>

        {/* NAV LINKS — desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={navLinkStyles}>
            Home
          </Link>
          <Link to="/colocations" className={navLinkStyles}>
            Colocations
          </Link>
          <Link to="/revisions" className={navLinkStyles}>
            Revisions
          </Link>
          <Link to="/support" className={navLinkStyles}>
            Support
          </Link>
          {/* Dashboard link — only for professors and landlords */}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center ml-25 gap-3">
          {token && loggedInUser ? (
            <div className="flex items-center gap-3">
              {/* NOTIFICATION BELL & DRAWER */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setDropdownOpen(false);
                  }}
                  className={`relative p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isScrolledOrNotHome
                      ? "text-slate-650 hover:text-[#10b981]"
                      : "text-white/80 hover:text-white "
                  }`}
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5 shrink-0" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-black animate-pulse shadow-xs border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATIONS DRAWER DROP DOWN */}
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-[-60px] md:right-0 mt-3 w-80 sm:w-[350px] rounded-2xl bg-white border border-slate-100 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-250 text-slate-800 font-poppins">
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <span className="font-extrabold text-[10px] text-slate-450 uppercase tracking-widest">
                          Alertes ({unreadCount})
                        </span>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-[9px] font-black text-[#10b981] hover:text-[#0b9062] transition flex items-center gap-1 cursor-pointer border-none bg-transparent"
                          >
                            <FaCheckDouble className="w-2.5 h-2.5" /> Tout lire
                          </button>
                        )}
                      </div>

                      {/* Drawer List */}
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => toggleNotificationRead(notif.id)}
                              className={`group relative p-3 rounded-xl border text-left transition-all cursor-pointer shadow-xs overflow-hidden flex gap-3 items-start
                              ${
                                notif.unread
                                  ? "bg-emerald-50/20 border-emerald-100/60 hover:bg-emerald-50/40"
                                  : "bg-white border-slate-100 hover:bg-slate-50"
                              }`}
                            >
                              {/* Left icon marker depending on type */}
                              <div
                                className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                                ${
                                  notif.type === "success"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : notif.type === "request"
                                      ? "bg-blue-50 text-blue-600"
                                      : notif.type === "warning"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-slate-50 text-slate-500"
                                }`}
                              >
                                {notif.type === "success" ? (
                                  <FaCheck className="w-3 h-3" />
                                ) : (
                                  <FaInfoCircle className="w-3 h-3" />
                                )}
                              </div>

                              {/* Title / Description */}
                              <div className="flex-1 min-w-0 pr-6">
                                <h4
                                  className={`text-[10px] font-black tracking-tight leading-tight uppercase mb-0.5
                                  ${
                                    notif.unread
                                      ? "text-slate-800"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                <p
                                  className={`text-[10px] leading-relaxed font-semibold mb-1
                                  ${
                                    notif.unread
                                      ? "text-slate-650"
                                      : "text-slate-450"
                                  }`}
                                >
                                  {notif.text}
                                </p>
                                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">
                                  {notif.time}
                                </span>
                              </div>

                              {/* Quick action buttons */}
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                  }}
                                  className="w-5 h-5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition border-none bg-transparent cursor-pointer"
                                  title="Supprimer"
                                >
                                  <FaTrash className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              {/* Pulsing indicator */}
                              {notif.unread && (
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse group-hover:hidden" />
                              )}
                            </div>
                          ))
                        ) : (
                          /* Elegant Empty State illustration */
                          <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-350 mb-3 shadow-inner">
                              <FaBell className="w-6 h-6 animate-pulse" />
                            </div>
                            <h4 className="font-extrabold text-[10px] text-slate-700 uppercase tracking-widest mb-1">
                              Aucune Alerte
                            </h4>
                            <p className="text-[10px] text-slate-450 font-semibold leading-relaxed max-w-[200px]">
                              Vous êtes à jour ! Vos nouvelles alertes
                              s'afficheront ici.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Drawer Footer */}
                      {notifications.length > 0 && (
                        <div className="border-t border-slate-100 pt-3 mt-3 flex justify-center">
                          <button
                            type="button"
                            onClick={clearAllNotifications}
                            className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition cursor-pointer border-none bg-transparent"
                          >
                            Vider les notifications
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className={`relative rounded-full transition-all duration-300 cursor-pointer ${
                    isScrolledOrNotHome
                      ? "hover:bg-slate-100/50"
                      : "hover:bg-white/10"
                  }`}
                  aria-label="User menu"
                >
                  {loggedInUser?.photo_profil ? (
                    <img
                      src={bustCache(loggedInUser.photo_profil)}
                      alt="photo"
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      loggedInUser?.photo_profil ? "hidden" : ""
                    } ${
                      isScrolledOrNotHome
                        ? "text-slate-650 bg-slate-100"
                        : "text-white/80 bg-white/10"
                    }`}
                  >
                    {loggedInUser?.photo_profil ? null : (
                      <span className="text-xs font-bold">
                        {((loggedInUser?.prenom || "U")[0] + (loggedInUser?.nom || "")[0]).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <>
                    {/* Overlay to close when clicking outside */}
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-100 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                      {/* User Info Header Block */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-2">
                        <div className="relative shrink-0">
                          {loggedInUser?.photo_profil ? (
                            <img
                              src={bustCache(loggedInUser.photo_profil)}
                              alt="photo"
                              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] shadow-sm ${
                              loggedInUser?.photo_profil ? "hidden" : ""
                            }`}
                          >
                            <span className="text-sm font-bold">
                              {((loggedInUser?.prenom || "U")[0] + (loggedInUser?.nom || "")[0]).toUpperCase() || "U"}
                            </span>
                          </div>

                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                          <p className="font-bold text-slate-800 text-[13px] truncate capitalize w-full">
                            {loggedInUser.prenom} {loggedInUser.nom}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 border border-emerald-100/50">
                            {loggedInUser.role}
                          </span>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="flex flex-col gap-0.5">
                        <Link
                          to={`/profile/${loggedInUser.id_user}`}
                          onClick={() => setDropdownOpen(false)}
                          className={profileMenuLinkClass((p) =>
                            p.startsWith("/profile"),
                          )}
                        >
                          <FaUser
                            className={profileMenuIconClass((p) =>
                              p.startsWith("/profile"),
                            )}
                          />
                          <span>Voir mon profil</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className={profileMenuLinkClass("/settings")}
                        >
                          <FaCog
                            className={profileMenuIconClass("/settings")}
                          />
                          <span>Paramètres du compte</span>
                        </Link>

                        {(loggedInUser.role === "professeur" ||
                          loggedInUser.role === "locateur" ||
                          loggedInUser.role === "proprietaire") && (
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className={profileMenuLinkClass("/dashboard")}
                          >
                            <FaChartBar
                              className={profileMenuIconClass("/dashboard")}
                            />
                            <span>Tableau de Bord</span>
                          </Link>
                        )}

                        <Link
                          to="/security"
                          onClick={() => setDropdownOpen(false)}
                          className={profileMenuLinkClass("/security")}
                        >
                          <FaShieldAlt
                            className={profileMenuIconClass("/security")}
                          />
                          <span>Sécurité</span>
                        </Link>
                      </div>

                      {/* Divider line before logout */}
                      <div className="border-t border-slate-100 my-2" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 hover:text-red-800 rounded-xl transition duration-150 cursor-pointer text-left"
                      >
                        <FaSignOutAlt className="text-red-500 text-sm" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Logged out state - show "Get Started" button */
            <Link to="/login">
              <button className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2 rounded-full font-bold text-sm tracking-tight cursor-pointer transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-emerald-500/20">
                Get Started
                <div className="bg-white/20 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                  <FaArrowRight className="text-[10px]" />
                </div>
              </button>
            </Link>
          )}

          {/* Hamburger — tablet & mobile */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolledOrNotHome || menuOpen
                ? "text-slate-800 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE / TABLET DROPDOWN MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 shadow-xl`}
      >
        <nav
          className="flex flex-col px-4 sm:px-6 py-3 gap-0.5"
          aria-label="Navigation mobile"
        >
          {(() => {
            const mobileMenuItems = [
              { to: "/", label: "Home", match: (p) => p === "/" },
              {
                to: "/colocations",
                label: "Colocations",
                match: (p) => p.startsWith("/colocations"),
              },
              {
                to: "/revisions",
                label: "Revisions",
                match: (p) => p.startsWith("/revisions"),
              },
              {
                to: "/support",
                label: "Support",
                match: (p) => p.startsWith("/support"),
              },
            ];
            return mobileMenuItems.map(({ to, label, match }) => {
              const isActive = match(location.pathname);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {label}
                  <FaArrowRight
                    className={`text-xs transition-all ${
                      isActive
                        ? "text-emerald-500 opacity-100"
                        : "text-emerald-400 opacity-50"
                    }`}
                  />
                </Link>
              );
            });
          })()}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
