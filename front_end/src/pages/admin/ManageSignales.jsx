import { useState } from "react";

// Mock data for signalements (reports)
const mockSignales = [
  {
    id: 1,
    target: "M. Benjelloun",
    reportedBy: "Sara El Fassi",
    reason: "Comportement inapproprié",
    status: "pending",
    date: "2026-05-14",
  },
  {
    id: 2,
    target: "Othmane K.",
    reportedBy: "Ali Idrissi",
    reason: "Faux profil / Arnaque",
    status: "resolved",
    date: "2026-05-12",
  },
  {
    id: 3,
    target: "Laila B.",
    reportedBy: "Youssef A.",
    reason: "Harcèlement en message privé",
    status: "pending",
    date: "2026-05-15",
  },
];

const ManageSignales = () => {
  const [signales, setSignales] = useState(mockSignales);

  const updateStatus = (id, newStatus) => {
    setSignales(
      signales.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
  };

  const deleteSignale = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce signalement ?")) {
      setSignales(signales.filter((s) => s.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
            Résolu
          </span>
        );
      case "ignored":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
            Ignoré
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
            En attente
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des signalements
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">
                Profil signalé
              </th>
              <th className="p-4 font-semibold text-gray-600">Signalé par</th>
              <th className="p-4 font-semibold text-gray-600">Motif</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Statut</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {signales.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 text-gray-400">
                  #{s.id < 10 ? `0${s.id}` : s.id}
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{s.target}</div>
                </td>
                <td className="p-4 text-gray-600">{s.reportedBy}</td>
                <td className="p-4 text-red-500 text-sm font-medium">
                  {s.reason}
                </td>
                <td className="p-4 text-gray-500 text-sm">{s.date}</td>
                <td className="p-4">{getStatusBadge(s.status)}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {s.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(s.id, "resolved")}
                          className="text-green-600 hover:underline text-xs font-semibold"
                        >
                          Résoudre
                        </button>
                        <button
                          onClick={() => updateStatus(s.id, "ignored")}
                          className="text-gray-500 hover:underline text-xs font-semibold"
                        >
                          Ignorer
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteSignale(s.id)}
                      className="text-red-500 hover:underline text-xs font-semibold ml-2"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {signales.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Aucun signalement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSignales;
