import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUsers,
  FaCheckCircle,
  FaUser,
  FaHome,
  FaBook,
  FaChartLine,
} from "react-icons/fa";
import bg from "../../assets/images/hero-bg.png";
import profile1 from "../../assets/images/profile1.jpg";
import profile2 from "../../assets/images/profile2.png";
import profile3 from "../../assets/images/profile3.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = easeOutCubic(progress);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(step);
        else setCount(target);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          animate();
          hasAnimated.current = true;
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const HomePage = () => {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const floatCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        )
        .fromTo(
          paragraphRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          buttonsRef.current?.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
          "-=0.3",
        );
      if (floatCardRef.current) {
        tl.fromTo(
          floatCardRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          "-=0.2",
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray("[data-anim]");
    sections.forEach((section) => {
      const anim = section.getAttribute("data-anim");
      const items = section.querySelectorAll("[data-item]");
      if (anim === "stagger-fade-up" && items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: section, start: "top 80%" },
          },
        );
      }
      if (anim === "fade-up") {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          },
        );
      }
    });

    const splitSections = gsap.utils.toArray("[data-anim-split]");
    splitSections.forEach((section) => {
      const left = section.querySelector("[data-side='left']");
      const right = section.querySelector("[data-side='right']");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      if (left)
        tl.fromTo(
          left,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
        );
      if (right)
        tl.fromTo(
          right,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4",
        );
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onLoad();
      return;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-emerald-900 md:bg-emerald-700 min-h-0 md:min-h-screen"
      >
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-28 pb-14 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 flex flex-col md:translate-y-14 md:-translate-x-20">
          <div
            ref={badgeRef}
            className="inline-flex w-fit items-center gap-2 sm:gap-3 bg-white/15 border border-white/25 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm mb-6 sm:mb-8"
          >
            <svg
              className="w-4 h-4 text-emerald-200 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-[11px] sm:text-[13px] font-bold text-white uppercase tracking-wide">
              100% Satisfaction Garantie
            </span>
          </div>

          <div className="w-full max-w-2xl">
            <h1
              ref={headingRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serifHero font-bold text-white mb-4 sm:mb-6 leading-tight text-left"
            >
              Connecte-toi, Étudie, Vis Mieux avec{" "}
              <span className="text-emerald-200 md:text-emerald-400">
                UniConnect
              </span>
            </h1>
            <p
              ref={paragraphRef}
              className="text-sm sm:text-base md:text-lg text-emerald-50 md:text-slate-200 mb-8 sm:mb-10 text-left max-w-xl"
            >
              Ta plateforme tout-en-un pour trouver le logement étudiant parfait
              et des groupes d'étude. Rejoins notre communauté et améliore ton
              expérience universitaire !
            </p>
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Link
                to="/colocations"
                className="w-full sm:w-auto justify-center bg-white text-emerald-700 md:bg-emerald-500 md:text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-emerald-50 md:hover:bg-emerald-600 transition-all duration-300 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Explorer les offres <FaArrowRight />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto justify-center border-2 border-white/60 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-white/15 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                Créer un compte <FaUser />
              </Link>
            </div>
          </div>

          <div
            ref={floatCardRef}
            className="hidden md:flex mt-auto justify-end -translate-y-14"
          >
            <div className="animate-[float_4s_ease-in-out_infinite] flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl w-fit">
              <div className="flex -space-x-3">
                {[profile1, profile2, profile3].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Professeur"
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-none">
                  130+
                </span>
                <span className="text-slate-300 text-sm font-medium">
                  Enseignants Experts
                </span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Stats */}
      <section
        data-anim="fade-up"
        className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-linear-to-r from-emerald-50 to-teal-50 w-full"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { target: 50, suffix: "K+", label: "Étudiants Connectés" },
            { target: 10, suffix: "K+", label: "Annonces de Logements" },
            { target: 5, suffix: "K+", label: "Groupes d'Étude" },
            { target: 99, suffix: ".9%", label: "Taux de Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-600 mb-2 sm:mb-3">
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-semibold text-gray-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        data-anim="stagger-fade-up"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white w-full"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Tout ce dont tu as besoin pour{" "}
              <span className="text-emerald-500 bg-emerald-100 px-2 sm:px-4 py-1 sm:py-2 rounded-2xl inline-block mt-1 sm:mt-0">
                réussir
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Trouve un logement, rejoins des groupes d'étude et connecte-toi
              avec d'autres étudiants — le tout au même endroit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: FaHome,
                title: "Logement Étudiant",
                desc: "Trouve des logements étudiants vérifiés près de ton campus. Sûrs, abordables et parfaits pour les étudiants.",
                cta: "Trouver un logement",
                to: "/colocations",
              },
              {
                icon: FaUsers,
                title: "Groupes d'Étude",
                desc: "Connecte-toi avec des étudiants qui suivent les mêmes cours. Étudiez plus intelligemment ensemble.",
                cta: "Rejoindre des groupes",
                to: "/revisions",
              },
              {
                icon: FaChartLine,
                title: "Support & Communauté",
                desc: "Obtenez de l'aide, signalez un problème et échangez avec la communauté UniConnect.",
                cta: "Obtenir de l'aide",
                to: "/support",
              },
            ].map(({ icon: Icon, title, desc, cta, to }) => (
              <Link
                key={title}
                to={to}
                data-item
                className="group bg-linear-to-br from-gray-50 to-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer h-full flex flex-col"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 flex-1 text-sm sm:text-base">
                  {desc}
                </p>
                <div className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 transition-colors text-sm sm:text-base">
                  {cta}{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section
        data-anim="fade-up"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white w-full"
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 sm:mb-16">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 md:gap-16 relative">
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-emerald-100" />

            {[
              {
                icon: "person_search",
                title: "Rechercher",
                desc: "Filtrez par sujet, lieu et niveau pour trouver le tuteur idéal.",
              },
              {
                icon: "list_alt",
                title: "Choisir",
                desc: "Comparez les profils, les avis et les tarifs des instructeurs.",
              },
              {
                icon: "event_available",
                title: "Réserver",
                desc: "Planifiez votre séance en quelques clics et commencez à apprendre.",
              },
            ].map((step) => (
              <div
                key={step.title}
                data-item
                className="relative z-10 flex flex-col items-center px-2"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg shadow-emerald-200">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 28 }}
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm sm:text-base max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        data-anim="stagger-fade-up"
        className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-white w-full pb-16 sm:pb-20"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8 sm:mb-10">
            <h2 className="font-bold text-gray-900 text-xl sm:text-2xl">
              Explorez par catégorie
            </h2>
            <Link
              to="/revisions"
              className="text-emerald-600 text-base sm:text-lg font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit"
            >
              Voir tout <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
            {[
              {
                to: "/revisions?search=mathématiques",
                icon: "calculate",
                title: "Mathématiques",
                count: "120+",
              },
              {
                to: "/revisions?search=programmation",
                icon: "code",
                title: "Programmation",
                count: "85+",
              },
              {
                to: "/revisions?search=physique",
                icon: "bolt",
                title: "Physique",
                count: "64+",
              },
              {
                to: "/revisions?search=Économie",
                icon: "trending_up",
                title: "Économie",
                count: "42+",
              },
            ].map((cat) => (
              <Link
                key={cat.title}
                to={cat.to}
                data-item
                className="group p-5 sm:p-6 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] block h-full"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {cat.count} Tuteurs disponibles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        data-anim-split
        className=" max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex flex-col lg:flex-row gap-8 lg:gap-10 items-center"
      >
        <div
          data-side="left"
          className="w-full  lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4"
        >
          <div className="space-y-2 sm:space-y-3">
            <img
              src="/src/assets/images/students2.jpg"
              className=" rounded-2xl sm:rounded-3xl w-full h-48 sm:h-64 md:h-97 object-cover"
              alt="Étudiant"
            />
            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-4">
              <span className="text-3xl sm:text-5xl font-bold text-emerald-500">
                New
              </span>
              <p className="text-gray-900 text-sm sm:text-lg font-bold leading-tight">
                Lancement <br /> de la
                <br />
                Plateforme
              </p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-emerald-500 rounded-2xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
              <div className="bg-white/20 p-4 sm:p-5 rounded-full">
                <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <p className="font-extrabold text-lg sm:text-2xl">
                Vivre Mieux Ensemble
              </p>
            </div>
            <img
              src="/src/assets/images/students1.jpg"
              className="rounded-2xl sm:rounded-3xl w-full h-40 sm:h-56 md:h-97 object-cover"
              alt="Équipe"
            />
          </div>
        </div>

        <div
          data-side="right"
          className="w-full lg:w-1/2 space-y-2 sm:space-y-4"
        >
          <h5 className="flex items-center gap-3 text-emerald-500 font-bold uppercase text-lg sm:text-2xl">
            <FaBook /> À PROPOS
          </h5>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900 leading-tight">
            Connecter les Étudiants à un Meilleur Cadre de Vie
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            UniConnect aide les étudiants à trouver l'endroit idéal pour vivre
            et les bonnes personnes avec qui vivre. Nous simplifions la
            recherche de colocation en rassemblant des annonces de confiance,
            des filtres intelligents et une expérience centrée sur l'étudiant en
            une seule plateforme.
          </p>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "Trouvez facilement des logements étudiants vérifiés",
              "Connectez-vous avec des colocataires compatibles",
              "Filtres intelligents pour le budget, l'emplacement et le mode de vie",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-semibold text-slate-800 text-sm sm:text-base"
              >
                <span className="text-emerald-500 text-lg shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2 sm:pt-4">
            <Link
              to="/profile"
              className="inline-flex bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-emerald-600 transition-all items-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              EN SAVOIR PLUS <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-anim="fade-up"
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-900 text-white w-full"
      >
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">
            Prêt à transformer ta{" "}
            <span className="text-emerald-400">vie universitaire</span> ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
            Rejoins plus de 50 000 étudiants qui utilisent déjà UniConnect pour
            trouver un logement et des partenaires d'étude.
          </p>
          <button
            type="button"
            className="w-full sm:w-auto bg-emerald-500 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl hover:bg-emerald-600 transition-all duration-300 shadow-2xl cursor-pointer"
            onClick={() => (window.location.href = "/register")}
          >
            Rejoins UniConnect Maintenant
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
