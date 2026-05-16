import React, { useState, useEffect } from "react";
import { API_URLS, fetchData } from "../../api/api";

const ManageRevisions = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(API_URLS.COURS);
        const mappedData = result.data.map(item => ({
          id: item.id_cours,
          name: `${item.professeur?.prenom || ""} ${item.professeur?.nom || ""}`.trim() || "Professeur",
          subject: item.matiere,
          price: `${item.prix} MAD / ${item.type_prix}`,
          image: `https://i.pravatar.cc/150?u=${item.id_cours}`
        }));
        setRevisions(mappedData);
      } catch (error) {
        console.error("Error fetching revisions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      // In a real app, you would call the DELETE API here
      setRevisions(revisions.filter((r) => r.id !== id));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gérer les cours</h1>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition shadow-md">
          + Ajouter un cours
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Professeur</th>
              <th className="p-4 font-semibold text-gray-600">Matière</th>
              <th className="p-4 font-semibold text-gray-600">Prix</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {revisions.map((rev) => (
              <tr key={rev.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 text-gray-400">#{rev.id < 10 ? `0${rev.id}` : rev.id}</td>
                <td className="p-4 font-medium flex items-center gap-3">
                  <img src={rev.image} alt={rev.name} className="w-8 h-8 rounded-full object-cover" />
                  {rev.name}
                </td>
                <td className="p-4 text-gray-500">{rev.subject}</td>
                <td className="p-4 text-teal-600 font-semibold">{rev.price}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-500 hover:underline text-sm">Modifier</button>
                    <button 
                      onClick={() => handleDelete(rev.id)} 
                      className="text-red-500 hover:underline text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {revisions.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Aucun cours de révision trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRevisions;
