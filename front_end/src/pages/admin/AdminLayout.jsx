import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = loggedInUser ? `${loggedInUser.prenom} ${loggedInUser.nom}` : "Oussama El Alaoui";
  const initials = loggedInUser 
    ? `${loggedInUser.prenom[0] || ""}${loggedInUser.nom[0] || ""}`.toUpperCase() 
    : "OA";

  const menuItems = [
    { name: "Tableau de bord", path: "/admin" },
    { name: "Gérer les annonces", path: "/admin/manage-homes" },
    { name: "Gérer les cours", path: "/admin/manage-revisions" },
    { name: "Utilisateurs", path: "/admin/users" },
    { name: "Signalements", path: "/admin/manage-signales" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 text-xl font-bold border-b border-slate-800 text-teal-400">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-teal-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="p-4 bg-slate-800 hover:bg-slate-700 transition text-sm text-center border-t border-slate-700 cursor-pointer"
        >
          ← Quitter l'admin
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-gray-700 font-semibold">
            {menuItems.find(item => item.path === location.pathname)?.name || "Tableau de bord"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">{adminName}</span>
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
