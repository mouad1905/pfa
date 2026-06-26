import { useState, useEffect } from "react";
import { API_URLS, fetchFormData, fetchData } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SUBJECTS = [
  { icon: "∑", label: "Mathématiques", key: "Mathématiques" },
  { icon: "< />", label: "Informatique", key: "Informatique" },
  { icon: "⚗", label: "Physique", key: "Physique" },
  { icon: "A", label: "Anglais", key: "Anglais" },
  { icon: "F", label: "Français", key: "Français" },
  { icon: "✦", label: "Philosophie", key: "Philosophie" },
];

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mode, setMode] = useState("en_ligne");
  const [rate, setRate] = useState("");
  const [niveau, setNiveau] = useState("L1");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchData(`${API_URLS.COURS}/${id}`);
        const c = res.data || res;
        setSelectedSubject(c.matiere || "");
        setMode(c.mode_enseignement || "en_ligne");
        setRate(c.prix || "");
        setNiveau(c.niveau_etude || "L1");
        setDescription(c.description || "");
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger le cours.", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!selectedSubject || !rate || !niveau || !description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("matiere", selectedSubject);
      fd.append("prix", rate);
      fd.append("type_prix", "DH/h");
      fd.append("niveau_etude", niveau);
      fd.append("description", description);
      fd.append("mode_enseignement", mode);
      fd.append("_method", "PUT");
      if (newImage) fd.append("image_cours", newImage);

      await fetchFormData(`${API_URLS.COURS}/${id}`, fd);

      Swal.fire({ icon: "success", title: "Cours mis à jour !", timer: 1500, showConfirmButton: false });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-[#f8f9ff] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#006c49] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-[#f8f9ff] font-sans text-[#0b1c30]">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-[#006c49] hover:underline mb-6 cursor-pointer bg-transparent border-none"
        >
          ← Retour au tableau de bord
        </button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Modifier le cours</h1>

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>
        )}

        <div className="space-y-6">
          {/* Matière */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Matière</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUBJECTS.map(({ icon, label, key }) => (
                <button
                  key={key}
                  onClick={() => setSelectedSubject(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedSubject === key
                      ? "border-[#006c49] bg-[#adedd3]/20 text-[#006c49]"
                      : "border-slate-100 hover:border-[#006c49] text-slate-600"
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Détails</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Niveau d'étude</label>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#006c49] transition"
              >
                <option value="L1">Licence 1 (L1)</option>
                <option value="L2">Licence 2 (L2)</option>
                <option value="L3">Licence 3 (L3)</option>
                <option value="Master 1">Master 1</option>
                <option value="Master 2">Master 2</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#006c49] transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Image du cours</label>
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 hover:border-[#006c49] rounded-xl cursor-pointer transition bg-slate-50">
                <span className="text-2xl">🖼</span>
                <span className="text-sm font-semibold text-slate-600">
                  {newImage ? newImage.name : "Cliquez pour changer l'image"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewImage(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* Mode + Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Mode d'enseignement</h2>
              <div className="space-y-3">
                {[
                  { value: "en_ligne", label: "En Ligne", sub: "Via Zoom, Teams ou Google Meet" },
                  { value: "presentiel", label: "Présentiel", sub: "Bibliothèques ou espaces coworking" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      mode === opt.value ? "bg-[#adedd3]/20 border-[#006c49]" : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={opt.value}
                      checked={mode === opt.value}
                      onChange={() => setMode(opt.value)}
                      className="accent-[#006c49] h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Tarification</h2>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">MAD</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#006c49] rounded-lg text-lg font-bold outline-none transition"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Tarif par heure (DH/h)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#006c49] text-white px-12 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer border-none"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}