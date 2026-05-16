const AdminDashboard = () => {
  const stats = [
    { label: "Total Annonces", value: "24", color: "border-teal-500" },
    { label: "Vues (30j)", value: "1,280", color: "border-blue-500" },
    { label: "Nouveaux Messages", value: "7", color: "border-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${s.color}`}
          >
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              {s.label}
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4">Activité récente</h3>
        <p className="text-gray-400 text-sm">
          Aucune activité suspecte détectée aujourd'hui.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
