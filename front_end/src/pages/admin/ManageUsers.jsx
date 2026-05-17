import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import { 
  FaUserCheck, 
  FaTimes, 
  FaSpinner, 
  FaTrashAlt, 
  FaEye, 
  FaUserSlash, 
  FaCheck, 
  FaIdCard, 
  FaFileInvoice 
} from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch users from database on load
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData(`${API_BASE_URL}/admin/utilisateurs`);
      // The backend allUsers returns an array inside standard Laravel resource collections
      setUsers(data.data || data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Impossible de charger les utilisateurs depuis la base de données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Update user status (actif, suspendu, en_attente) in database
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      setActionLoading(userId);
      const response = await fetchData(`${API_BASE_URL}/admin/utilisateurs/${userId}/statut`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatus })
      });
      
      // Update local state
      setUsers(users.map(u => u.id_user === userId ? { ...u, statut: newStatus } : u));
      
      if (selectedUser && selectedUser.id_user === userId) {
        setSelectedUser({ ...selectedUser, statut: newStatus });
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      alert(`Erreur lors de la mise à jour du statut: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user from database
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible.")) {
      return;
    }

    try {
      setActionLoading(userId);
      await fetchData(`${API_BASE_URL}/admin/utilisateurs/${userId}`, {
        method: "DELETE"
      });

      // Update local state
      setUsers(users.filter(u => u.id_user !== userId));
      if (selectedUser && selectedUser.id_user === userId) {
        setSelectedUser(null);
      }
      alert("Utilisateur supprimé avec succès.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': 
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold tracking-wide uppercase">Admin</span>;
      case 'professeur': 
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wide uppercase">Professeur</span>;
      case 'proprietaire': 
      case 'locateur':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-wide uppercase">Propriétaire</span>;
      case 'etudiant': 
      default: 
        return <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold tracking-wide uppercase">Étudiant</span>;
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Gestion des utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les profils, vérifiez les pièces d'identité et gérez les accès.</p>
        </div>
        <button 
          onClick={loadUsers} 
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold"
        >
          Rafraîchir les données
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FaSpinner className="animate-spin text-teal-600 text-4xl mb-4" />
          <p className="text-gray-500 font-medium">Chargement des utilisateurs depuis la base de données...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold mb-2">{error}</p>
          <button 
            onClick={loadUsers} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-sm">Utilisateur</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Email & Téléphone</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Rôle</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Niveau d'étude</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Statut</th>
                  <th className="p-4 font-bold text-slate-600 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Aucun utilisateur trouvé dans la base de données.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id_user} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                            src={user.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom + ' ' + user.nom)}&background=0D9488&color=fff`}
                            alt="profil"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom + ' ' + user.nom)}&background=0D9488&color=fff`;
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-800 text-sm sm:text-base">
                              {user.prenom} {user.nom}
                            </div>
                            <span className="text-slate-400 text-xs font-mono">ID: #{user.id_user}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-slate-700">{user.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{user.telephone || "Aucun téléphone"}</div>
                      </td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4">
                        <span className="text-slate-600 font-medium text-sm">
                          {user.niveau_etude || "Non spécifié"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.statut === 'actif' ? 'bg-emerald-100 text-emerald-800' : 
                          user.statut === 'en_attente' ? 'bg-amber-100 text-amber-800' : 
                          'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.statut === 'actif' ? 'bg-emerald-500' : 
                            user.statut === 'en_attente' ? 'bg-amber-500' : 
                            'bg-rose-500'
                          }`} />
                          {user.statut === 'actif' ? 'Actif' : user.statut === 'en_attente' ? 'En attente' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          {/* Dedicated Verify Button for pending users */}
                          {user.statut === 'en_attente' && (
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm cursor-pointer"
                            >
                              <FaUserCheck /> Vérifier
                            </button>
                          )}

                          {/* Action to preview profile/docs even if already active */}
                          {user.statut !== 'en_attente' && (
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <FaEye /> Documents
                            </button>
                          )}

                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(user.id_user, user.statut === 'actif' ? 'suspendu' : 'actif')}
                                disabled={actionLoading === user.id_user}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                                  user.statut === 'actif'
                                    ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100"
                                }`}
                              >
                                {actionLoading === user.id_user ? (
                                  <FaSpinner className="animate-spin" />
                                ) : user.statut === 'actif' ? (
                                  <>
                                    <FaUserSlash /> Suspendre
                                  </>
                                ) : (
                                  <>
                                    <FaCheck /> Activer
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id_user)}
                                disabled={actionLoading === user.id_user}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100 cursor-pointer"
                                title="Supprimer définitivement"
                              >
                                {actionLoading === user.id_user ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaTrashAlt size={13} />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern, Beautiful verification and Document Auditing Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaUserCheck className="text-teal-400 text-xl" />
                <div>
                  <h3 className="font-bold text-lg">Vérification de l'identité</h3>
                  <p className="text-xs text-slate-400">Examinez les pièces justificatives fournies</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white transition p-1 bg-slate-800 rounded-full"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Profile Info Summary */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex gap-4 items-center">
              <img
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 bg-slate-100"
                src={selectedUser.photo_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.prenom + ' ' + selectedUser.nom)}&background=0D9488&color=fff`}
                alt="user"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-800">{selectedUser.prenom} {selectedUser.nom}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleBadge(selectedUser.role)}
                  <span className="text-xs text-slate-400">Niveau: {selectedUser.niveau_etude || "Non renseigné"}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">{selectedUser.email} · {selectedUser.telephone || "Sans téléphone"}</p>
              </div>
            </div>

            {/* Verification Documents List */}
            <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Documents d'identification</h5>
              
              {/* Document 1: Identification Document (CIN / Passport) - ALL ROLES */}
              <div className="p-4 border border-slate-100 rounded-xl bg-white flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <FaIdCard size={20} />
                  </div>
                  <div>
                    <h6 className="font-semibold text-slate-800 text-sm">Pièce d'identité (CIN / Passeport)</h6>
                    <p className="text-xs text-slate-400">Scan du document d'identité officiel</p>
                  </div>
                </div>
                {selectedUser.document_identite ? (
                  <a 
                    href={selectedUser.document_identite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 rounded-lg transition"
                    title="Voir le document"
                  >
                    <FaEye size={16} />
                  </a>
                ) : (
                  <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-md">Non fourni</span>
                )}
              </div>

              {/* Document 2: Student Card (Carte Étudiante) - STUDENTS ONLY */}
              {selectedUser.role === 'etudiant' && (
                <div className="p-4 border border-slate-100 rounded-xl bg-white flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FaIdCard size={20} />
                    </div>
                    <div>
                      <h6 className="font-semibold text-slate-800 text-sm">Carte Étudiante</h6>
                      <p className="text-xs text-slate-400">Preuve d'inscription active à l'EMSI</p>
                    </div>
                  </div>
                  {selectedUser.carte_etudiant ? (
                    <a 
                      href={selectedUser.carte_etudiant} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition"
                      title="Voir le document"
                    >
                      <FaEye size={16} />
                    </a>
                  ) : (
                    <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-md">Non fourni</span>
                  )}
                </div>
              )}

              {/* Document 3: Professional Certificate (Diplôme / Certificat) - PROFESSORS ONLY */}
              {selectedUser.role === 'professeur' && (
                <div className="p-4 border border-slate-100 rounded-xl bg-white flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FaFileInvoice size={20} />
                    </div>
                    <div>
                      <h6 className="font-semibold text-slate-800 text-sm">Diplôme / Certificat de travail</h6>
                      <p className="text-xs text-slate-400">Preuve des compétences d'enseignement</p>
                    </div>
                  </div>
                  {selectedUser.certificat ? (
                    <a 
                      href={selectedUser.certificat} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition"
                      title="Voir le document"
                    >
                      <FaEye size={16} />
                    </a>
                  ) : (
                    <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-md">Non fourni</span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions inside Modal */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
              {selectedUser.statut === 'en_attente' ? (
                <>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedUser.id_user, 'actif');
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <FaCheck /> Approuver & Activer
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedUser.id_user, 'suspendu');
                    }}
                    className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <FaUserSlash /> Suspendre
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 font-semibold">Statut actuel:</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedUser.statut === 'actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedUser.statut === 'actif' ? 'Actif' : 'Suspendu'}
                    </span>
                  </div>
                  {selectedUser.role !== 'admin' && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(
                          selectedUser.id_user, 
                          selectedUser.statut === 'actif' ? 'suspendu' : 'actif'
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition shadow-xs cursor-pointer ${
                        selectedUser.statut === 'actif' 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {selectedUser.statut === 'actif' ? "Suspendre le compte" : "Réactiver le compte"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
