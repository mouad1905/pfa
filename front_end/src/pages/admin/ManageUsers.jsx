import { useState, useEffect } from "react";
import API_BASE_URL, { fetchData } from "../../api/api";
import Swal from "sweetalert2";
import { 
  FaUserCheck, 
  FaTimes, 
  FaSpinner, 
  FaTrashAlt, 
  FaEye, 
  FaUserSlash, 
  FaCheck, 
  FaIdCard, 
  FaFileInvoice,
  FaUserShield
} from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchEmail, setSearchEmail] = useState("");

  // States for creating a new administrator
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: ""
  });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.nom || !adminForm.prenom || !adminForm.email || !adminForm.password) {
      Swal.fire("Attention", "Veuillez remplir tous les champs obligatoires.", "warning");
      return;
    }

    try {
      setCreateAdminLoading(true);
      const data = await fetchData(`${API_BASE_URL}/admin/utilisateurs/admin`, {
        method: "POST",
        body: JSON.stringify(adminForm)
      });
      
      const newAdmin = data.data || data;
      setUsers([newAdmin, ...users]);
      
      setAdminForm({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: ""
      });
      setShowCreateAdminModal(false);
      Swal.fire("Succès", "Nouvel administrateur créé avec succès !", "success");
    } catch (err) {
      console.error("Error creating admin:", err);
      Swal.fire("Erreur", `Erreur de création de l'admin: ${err.message || "Erreur de connexion."}`, "error");
    } finally {
      setCreateAdminLoading(false);
    }
  };

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
      Swal.fire("Erreur", `Erreur lors de la mise à jour du statut: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user from database
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler"
    });

    if (!result.isConfirmed) return;

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
      Swal.fire("Succès", "Utilisateur supprimé avec succès.", "success");
    } catch (err) {
      console.error("Error deleting user:", err);
      Swal.fire("Erreur", `Erreur lors de la suppression: ${err.message}`, "error");
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

  const filteredUsers = users.filter((user) => {
    // Check Role
    const roleMatch = filterRole === "all" || 
                      (filterRole === "locateur" ? (user.role === "locateur" || user.role === "proprietaire") : user.role === filterRole);
    
    // Check Email Search
    const searchMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    return roleMatch && searchMatch;
  });

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Gestion des utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les profils, vérifiez les pièces d'identité et gérez les accès.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateAdminModal(true)} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <FaUserShield /> + Ajouter un Admin
          </button>
          <button 
            onClick={loadUsers} 
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            Rafraîchir les données
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Email Search Bar */}
          <div className="flex items-center w-full sm:w-auto bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Rechercher par email..." 
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="py-2 pr-3 w-full sm:w-64 text-sm focus:outline-none bg-transparent"
            />
          </div>

          <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mr-1">Rôle:</span>
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {[
              { id: "all", label: "Tous" },
              { id: "etudiant", label: "Étudiants" },
              { id: "professeur", label: "Professeurs" },
              { id: "locateur", label: "Locateurs" },
              { id: "admin", label: "Admins" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterRole(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  filterRole === f.id ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400 whitespace-nowrap px-3 mt-2 lg:mt-0">
          Total filtré: <span className="text-slate-700 font-bold">{filteredUsers.length}</span> utilisateurs
        </div>
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Aucun utilisateur ne correspond à ce filtre.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
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

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.45)" }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <FaUserShield size={16} />
                </div>
                <h2 className="font-extrabold text-slate-800 text-lg">Ajouter un Administrateur</h2>
              </div>
              <button 
                onClick={() => setShowCreateAdminModal(false)}
                className="text-gray-400 hover:text-gray-650 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={adminForm.prenom}
                    onChange={(e) => setAdminForm({...adminForm, prenom: e.target.value})}
                    placeholder="Prénom"
                    className="w-full border border-slate-205 rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={adminForm.nom}
                    onChange={(e) => setAdminForm({...adminForm, nom: e.target.value})}
                    placeholder="Nom"
                    className="w-full border border-slate-205 rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email *</label>
                <input 
                  type="email" 
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  placeholder="admin@uniconnect.ma"
                  className="w-full border border-slate-205 rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mot de passe *</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full border border-slate-205 rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Téléphone (Optionnel)</label>
                <input 
                  type="text" 
                  value={adminForm.telephone}
                  onChange={(e) => setAdminForm({...adminForm, telephone: e.target.value})}
                  placeholder="+212 600-000000"
                  className="w-full border border-slate-205 rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createAdminLoading}
                  className="flex-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-750 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {createAdminLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaUserShield /> Enregistrer l'Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
