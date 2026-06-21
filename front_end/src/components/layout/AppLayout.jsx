import { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaChartLine,
  FaComment,
  FaUsers,
  FaFolderOpen,
  FaCog,
  FaShieldAlt,
} from "react-icons/fa";

function bustCache(url, t) {
  if (!url) return null;
  try {
    const u = new URL(url);
    u.searchParams.set("t", t || Date.now());
    return u.toString();
  } catch {
    return url;
  }
}

function avatarFallback(prenom, nom, size = 40) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent((prenom || "") + "+" + (nom || ""))}&background=0D9488&color=fff&size=${size}`;
}

const sidebarLinks = [
  {
    icon: <FaChartLine size={18} />,
    label: "Tableau de bord",
    path: "/dashboard",
  },
  { icon: <FaComment size={18} />, label: "Messages", path: "/chat" },
  { icon: <FaUsers size={18} />, label: "Communautés", path: "/colocations" },
  { icon: <FaFolderOpen size={18} />, label: "Ressources", path: "/revisions" },
  { icon: <FaCog size={18} />, label: "Paramètres", path: "/settings" },
  { icon: <FaShieldAlt size={18} />, label: "Sécurité", path: "/security" },
];

const AppLayout = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#191c1d] font-['Inter',sans-serif] pt-28">
      <aside className="h-[calc(100vh-116px)] w-[300px] sticky left-0 top-20 bg-[#f8f9fa] shadow-sm flex-col p-4 border-r border-[#bccac2] hidden md:flex z-40">
        <div className="mb-8 px-2">
          <h1 className="font-bold text-2xl text-[#006b53] tracking-tight">
            Academic Portal
          </h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-4 w-full text-left px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#d0e2f3] text-[#546573] font-semibold"
                    : "text-[#4f606f] hover:bg-[#e7e8e9]"
                }`}
              >
                {link.icon}
                <span className="text-base">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {loggedInUser && (
          <div className="mt-auto pt-2 border-t border-[#bccac2]">
            <div className="flex items-center gap-4 p-2 rounded-lg bg-[#f3f4f5]">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={
                  bustCache(
                    loggedInUser.photo_profil,
                    loggedInUser.updated_at,
                  ) || avatarFallback(loggedInUser.prenom, loggedInUser.nom, 40)
                }
                alt={loggedInUser.prenom}
                onError={(e) => {
                  e.target.src = avatarFallback(
                    loggedInUser.prenom,
                    loggedInUser.nom,
                    40,
                  );
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate font-bold">
                  {loggedInUser.prenom} {loggedInUser.nom}
                </p>
                <p className="text-xs text-[#4f606f] truncate">
                  {loggedInUser.niveau_etude
                    ? `${loggedInUser.niveau_etude} - `
                    : ""}
                  {loggedInUser.role || ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
