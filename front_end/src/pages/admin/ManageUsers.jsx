import { useState } from "react";

// Mock data for users since we don't have a backend
const mockUsers = [
  { id: 1, name: "Ali Idrissi", email: "ali@student.emsi.ma", role: "student", status: "active" },
  { id: 2, name: "Dr. Lahlou", email: "lahlou@prof.emsi.ma", role: "professor", status: "active" },
  { id: 3, name: "M. Benjelloun", email: "contact@locateur.com", role: "locateur", status: "pending" },
  { id: 4, name: "Oussama El Alaoui", email: "oussama@admin.com", role: "admin", status: "active" },
  { id: 5, name: "Sara El Fassi", email: "sara.fassi@gmail.com", role: "student", status: "suspended" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(mockUsers);

  const toggleStatus = (id, currentStatus) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, status: currentStatus === "active" ? "suspended" : "active" };
      }
      return user;
    }));
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Admin</span>;
      case 'professor': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Professeur</span>;
      case 'locateur': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">Locateur</span>;
      case 'student': default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">Étudiant</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gérer les utilisateurs</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition shadow-md">
          + Nouvel Utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nom</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Rôle</th>
              <th className="p-4 font-semibold text-gray-600">Statut</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4">{getRoleBadge(user.role)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 
                    user.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Suspendu'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-500 hover:underline text-sm">Modifier</button>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={`${user.status === 'active' ? 'text-orange-500' : 'text-green-500'} hover:underline text-sm`}
                      >
                        {user.status === 'active' ? 'Suspendre' : 'Activer'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
