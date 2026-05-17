import { useState } from "react";
import { API_URLS, fetchData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SUBJECTS = [
  { icon: "∑", label: "Mathématiques", key: "Mathématiques" },
  { icon: "< />", label: "Informatique", key: "Informatique" },
  { icon: "⚗", label: "Physique", key: "Physique" },
  { icon: "A", label: "Anglais", key: "Anglais" },
  { icon: "F", label: "Français", key: "Français" },
  { icon: "✦", label: "Philosophie", key: "Philosophie" },
];

const BentoCard = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    {children}
  </div>
);

const StepLabel = ({ num }) => (
  <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">
    Étape {num}
  </span>
);

const steps = [
  { label: "Expertise", icon: "✏️" },
  { label: "Détails", icon: "📄" },
  { label: "Logistique", icon: "🚌" },
  { label: "Tarification", icon: "💳" },
];

export default function DevenirPartenaire() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mode, setMode] = useState("en_ligne");
  const [rate, setRate] = useState("");
  const [niveau, setNiveau] = useState("L1");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dynamically calculate the active step based on filled fields
  const getActiveStep = () => {
    let step = 0;
    if (selectedSubject) step = 1;
    if (selectedSubject && description.trim().length > 0) step = 2;
    if (selectedSubject && description.trim().length > 0 && rate) step = 3;
    if (selectedSubject && description.trim().length > 0 && rate && niveau) step = 4;
    return step;
  };
  
  const currentStep = getActiveStep();

  const handleContinue = async () => {
    if (!selectedSubject || !rate || !niveau || !description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchData(API_URLS.COURS, {
        method: "POST",
        body: JSON.stringify({
          matiere: selectedSubject,
          prix: rate,
          type_prix: "DH/h",
          niveau_etude: niveau,
          description: description,
          mode_enseignement: mode,
        }),
      });

      Swal.fire({
        title: "Cours soumis !",
        text: "Votre cours a été enregistré et est en attente de vérification par l'administration. Il sera visible dès sa validation.",
        icon: "success",
        confirmButtonColor: "#059669"
      });
      navigate("/revisions");
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message || "Erreur lors de l'ajout du cours. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const net = rate ? (parseFloat(rate) * 0.85).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen mt-20 bg-[#f8f9ff] font-sans text-[#0b1c30]">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Ajouter un Cours de Révision
          </h1>

          {/* Stepper */}
          <div className="flex items-center max-w-2xl">
            {steps.map((step, i) => {
              const isActive = i === currentStep || (i === 3 && currentStep === 4);
              const isDone = i < currentStep;
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm transition-all
                        ${isActive ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" : isDone ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-slate-400 bg-white"}`}
                    >
                      {isDone ? "✓" : step.icon}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wide ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-16 md:w-24 mx-3 mb-5 rounded-full ${i < currentStep ? "bg-emerald-500" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Body Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Step 1 — Expertise */}
            <BentoCard className="p-6">
              <StepLabel num={1} />
              <h2 className="text-2xl font-semibold mt-1 mb-1">
                Matière du Cours
              </h2>
              <p className="text-slate-500 text-sm mb-5">
                Quelle matière souhaitez-vous enseigner ?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUBJECTS.map(({ icon, label, key }) => {
                  const active = selectedSubject === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSubject(key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
                        ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-100 hover:border-emerald-300 text-slate-600"}`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </BentoCard>

            {/* Step 2 — Détails */}
            <BentoCard className="p-6">
              <StepLabel num={2} />
              <h2 className="text-2xl font-semibold mt-1 mb-5">
                Détails du Cours
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Niveau d'étude cible</label>
                  <select 
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition"
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description du cours</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre méthodologie, les sujets abordés, etc."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>
            </BentoCard>

            {/* Steps 3 & 4 side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 3 — Logistique */}
              <BentoCard className="p-6">
                <StepLabel num={3} />
                <h2 className="text-2xl font-semibold mt-1 mb-4">Logistique</h2>
                <div className="space-y-3">
                  {[
                    {
                      value: "en_ligne",
                      label: "En Ligne",
                      sub: "Via Zoom, Teams ou Google Meet",
                    },
                    {
                      value: "presentiel",
                      label: "Présentiel",
                      sub: "Bibliothèques ou espaces coworking",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors
                        ${mode === opt.value ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100 hover:bg-emerald-50/50"}`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={opt.value}
                        checked={mode === opt.value}
                        onChange={() => setMode(opt.value)}
                        className="accent-emerald-600 h-4 w-4"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-500">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </BentoCard>

              {/* Step 4 — Tarification */}
              <BentoCard className="p-6">
                <StepLabel num={4} />
                <h2 className="text-2xl font-semibold mt-1 mb-4">
                  Tarification
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      MAD
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg text-lg font-bold text-slate-800 outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex gap-1 items-start">
                    <span className="mt-0.5">ℹ️</span>
                    Tarif par heure (DH/h).
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">
                      Revenu net estimé :
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      {net} MAD/h
                    </span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-2 pb-8">
              <button 
                onClick={() => navigate("/revisions")}
                className="px-8 py-3 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleContinue}
                disabled={loading}
                className="bg-emerald-600 text-white px-12 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Publier le Cours"}
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <BentoCard className="overflow-hidden">
              <div className="h-44 bg-emerald-600 relative overflow-hidden flex items-end">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
                  alt="Campus"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#6ee7b7_0%,_transparent_60%)] opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                <div className="relative z-10 p-4 pb-4">
                  <span className="bg-white/90 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                    Conseil d'Expert
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-4">
                  Conseils pour réussir
                </h4>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "📝",
                      title: "Détails Clairs",
                      sub: "Une bonne description augmente vos chances de 40%.",
                    },
                    {
                      icon: "💰",
                      title: "Prix Juste",
                      sub: "Comparez vos tarifs avec d'autres professeurs.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-base">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoCard>

            <BentoCard className="p-6 bg-emerald-50/60 border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
                <span>🎧</span> Besoin d'aide ?
              </h4>
              <p className="text-sm text-emerald-900/70 leading-relaxed">
                Contactez notre support si vous avez des questions sur l'ajout de cours.
              </p>
              <button className="mt-4 w-full py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">
                Contacter le Support
              </button>
            </BentoCard>
          </aside>
        </div>
      </main>
    </div>
  );
}

