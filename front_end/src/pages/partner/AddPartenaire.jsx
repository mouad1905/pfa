import { useState } from "react";

const SUBJECTS = [
  { icon: "∑", label: "Mathématiques", key: "math" },
  { icon: "< />", label: "Programming", key: "code" },
  { icon: "⚗", label: "Physique", key: "physics" },
  { icon: "A", label: "Langues", key: "lang" },
  { icon: "₿", label: "Économie", key: "eco" },
  { icon: "✦", label: "Design UI/UX", key: "design" },
  { icon: "🧠", label: "IA & Data", key: "ai" },
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
  { label: "Preuve", icon: "📄" },
  { label: "Logistique", icon: "🚌" },
  { label: "Tarification", icon: "💳" },
];

export default function DevenirPartenaire() {
  const [selected, setSelected] = useState(["math"]);
  const [mode, setMode] = useState("online");
  const [rate, setRate] = useState("");
  const [fileName, setFileName] = useState(null);
  const [activeStep] = useState(0);

  const toggle = (key) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const net = rate ? (parseFloat(rate) * 0.85).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen mt-20 bg-[#f8f9ff] font-sans text-[#0b1c30]">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Devenir Partenaire — Onboarding
          </h1>

          {/* Stepper */}
          <div className="flex items-center max-w-2xl">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;
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
                      className={`h-0.5 w-16 md:w-24 mx-3 mb-5 rounded-full ${i < activeStep ? "bg-emerald-500" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Step 1 — Expertise */}
            <BentoCard className="p-6">
              <StepLabel num={1} />
              <h2 className="text-2xl font-semibold mt-1 mb-1">
                Domaines d'Expertise
              </h2>
              <p className="text-slate-500 text-sm mb-5">
                Sélectionnez les matières que vous maîtrisez pour aider les
                étudiants.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUBJECTS.map(({ icon, label, key }) => {
                  const active = selected.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
                        ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-100 hover:border-emerald-300 text-slate-600"}`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  );
                })}
                <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-emerald-600 hover:border-emerald-400 transition-all">
                  <span className="text-2xl">＋</span>
                  <span className="text-xs font-semibold">Autre</span>
                </button>
              </div>
            </BentoCard>

            {/* Step 2 — Upload */}
            <BentoCard className="p-6">
              <StepLabel num={2} />
              <h2 className="text-2xl font-semibold mt-1 mb-5">
                Preuve de Compétence
              </h2>
              <label className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow">
                  <span className="text-3xl">☁️</span>
                </div>
                <p className="font-semibold text-base text-slate-800">
                  {fileName
                    ? fileName
                    : "Télécharger vos diplômes ou relevés de notes"}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  PDF, JPG ou PNG (Max 5MB par fichier)
                </p>
                <span className="mt-6 bg-emerald-600 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md active:scale-95 inline-block">
                  Parcourir les fichiers
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files[0] && setFileName(e.target.files[0].name)
                  }
                />
              </label>
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
                      value: "online",
                      label: "En Ligne",
                      sub: "Via Zoom, Teams ou Google Meet",
                    },
                    {
                      value: "campus",
                      label: "Sur Campus",
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
                    Le tarif moyen pour les Mathématiques est de 150 MAD/h.
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
              <button className="px-8 py-3 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Sauvegarder et quitter
              </button>
              <button className="bg-emerald-600 text-white px-12 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                Continuer
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {/* Why UniConnect */}
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
                    Rejoignez la communauté
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-4">
                  Pourquoi UniConnect?
                </h4>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "🛡️",
                      title: "Visibilité Garantie",
                      sub: "Accédez à plus de 5,000 étudiants actifs.",
                    },
                    {
                      icon: "🕐",
                      title: "Flexibilité Totale",
                      sub: "Gérez votre emploi du temps en un clic.",
                    },
                    {
                      icon: "💳",
                      title: "Paiements Sécurisés",
                      sub: "Recevez vos gains chaque semaine.",
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

            {/* Support */}
            <BentoCard className="p-6 bg-emerald-50/60 border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
                <span>🎧</span> Besoin d'aide ?
              </h4>
              <p className="text-sm text-emerald-900/70 leading-relaxed">
                Nos conseillers sont disponibles pour vous accompagner dans
                votre inscription.
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
