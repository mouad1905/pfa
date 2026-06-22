import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import {
  FaPaperPlane,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const contactItems = [
    {
      icon: FaPhone,
      label: "+212 96 15 92 51",
      sublabel: "Appelez-nous",
      href: "tel:+21296159251",
    },
    {
      icon: FaEnvelope,
      label: "uniconnectSupport@gmail.com",
      sublabel: "Écrivez-nous",
      href: "mailto:uniconnectSupport@gmail.com",
    },
    {
      icon: FaMapMarkerAlt,
      label: "5 Rue Lalla Aicha, Fes 30050",
      sublabel: "Fès, Maroc",
      href: "https://maps.google.com/?q=EMSI+Fes",
    },
  ];

  useEffect(() => {
    const sections = gsap.utils.toArray("[data-anim]");
    sections.forEach((section) => {
      const anim = section.getAttribute("data-anim");
      const items = section.querySelectorAll("[data-item]");
      if (anim === "stagger-fade-up" && items.length) {
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1,
            scrollTrigger: { trigger: section, start: "top 82%" } }
        );
      }
      if (anim === "fade-up") {
        gsap.fromTo(section,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 82%" } }
        );
      }
    });
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-slate-50 font-poppins">
      <section data-anim="fade-up" className=" pt-24 sm:pt-36 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Infos contact */}
            <div className="w-full order-2 lg:order-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-emerald-500 text-xl sm:text-2xl">
                  <FaPaperPlane />
                </span>
                <span className="text-emerald-600 font-bold uppercase text-sm sm:text-lg tracking-widest">
                  Contactez-nous
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 sm:mb-4">
                Une équipe à votre écoute sur UniConnect
              </h1>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
                Colocation, cours de révision ou assistance technique — nous
                vous répondons rapidement pour simplifier votre vie étudiante.
              </p>

              <div data-anim="stagger-fade-up" className="bg-emerald-50 w-full rounded-2xl px-4 sm:px-6 py-2 divide-y divide-dashed divide-emerald-200/80 border border-emerald-100/60">
                {contactItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={i}
                      data-item
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 py-4 sm:py-5 first:pt-3 last:pb-3 hover:bg-emerald-100/40 rounded-xl transition-colors -mx-1 px-1"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500 shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs text-gray-400 mb-0.5">
                          {item.sublabel}
                        </p>
                        <p className="text-gray-800 font-semibold text-sm sm:text-base break-words">
                          {item.label}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Formulaire */}
            <div data-anim="fade-up" className="w-full order-1 lg:order-2 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
              <p className="text-emerald-500 text-xs sm:text-sm font-bold tracking-widest uppercase text-center mb-1">
                Formulaire
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-5 sm:mb-6">
                Envoyez-nous un message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Votre nom *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail *"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition sm:col-span-2"
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition bg-white sm:col-span-2"
                >
                  <option value="" disabled>
                    Choisir un sujet *
                  </option>
                  <option value="general">Question générale</option>
                  <option value="support">Support technique</option>
                  <option value="colocation">Colocation</option>
                  <option value="cours">Cours / Révisions</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <textarea
                name="message"
                placeholder="Votre message..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-y mb-5 min-h-[120px]"
              />

              <button
                type="button"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-md shadow-emerald-200/80"
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 max-w-6xl mx-auto w-full">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 px-1">
          Notre campus
        </h3>
        <div className="w-full h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
          <iframe
            title="Carte EMSI Fès"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.3794282691547!2d-5.010958325031051!3d34.0341369186873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8ba783182787%3A0xf081ce6917c14af9!2sEMSI%20F%C3%A8s%20(%20%C3%89cole%20Marocaine%20des%20Sciences%20de%20l%E2%80%99Ing%C3%A9nieur)!5e0!3m2!1sfr!2sma!4v1777160110348!5m2!1sfr!2sma"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
