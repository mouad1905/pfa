import { useState, useEffect } from "react";

const ManageHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/homes")
      .then((res) => res.json())
      .then((data) => {
        setHomes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch homes", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      fetch(`http://localhost:5000/homes/${id}`, { method: "DELETE" })
        .then(() => {
          setHomes(homes.filter((h) => h.id !== id));
        })
        .catch(err => console.error("Failed to delete home", err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gérer les annonces</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition shadow-md">
          + Ajouter une annonce
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Titre</th>
              <th className="p-4 font-semibold text-gray-600">Prix</th>
              <th className="p-4 font-semibold text-gray-600">Localisation</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {homes.map((home) => (
              <tr key={home.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 text-gray-400">#{home.id < 10 ? `0${home.id}` : home.id}</td>
                <td className="p-4 font-medium flex items-center gap-3">
                  <img src={home.image} alt="home" className="w-10 h-10 rounded object-cover" />
                  {home.title}
                </td>
                <td className="p-4 text-teal-600 font-semibold">{home.price}</td>
                <td className="p-4 text-gray-500">{home.location}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-500 hover:underline text-sm">
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(home.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {homes.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Aucune annonce trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHomes;
