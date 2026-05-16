import React, { useEffect, useRef, useState } from "react";
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
import bg from "../assets/hero-bg.png";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
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

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(target);
        }
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
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 1. Hero Section */}
      <section
        className="relative min-h-screen overflow-hidden pt-32 pb-20 px-10 md:px-12 lg:px-18 bg-image-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-lg backdrop-blur-sm mt-15"
        >
          <svg
            className="w-4 h-4 text-[#10b981]"
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
          <span className="text-[13px] font-bold text-white uppercase tracking-wide flex items-center gap-2">
            100% Satisfaction Guarantee
            <span className="w-px h-4 bg-white ml-1"></span>
          </span>
        </motion.div>

        <motion.div
          className="w-xl mx-left ml-0 mt-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-serifHero font-bold text-white mb-6 leading-tight text-left"
          >
            Connect, Study, Live Better with{" "}
            <span className="text-emerald-400">UniConnect</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-slate-200 mb-12 text-left"
          >
            Your all-in-one platform for finding the perfect student housing and
            study groups. Join our community and elevate your university
            experience!
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/colocations"
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
            >
              Explore The Offers <FaArrowRight />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 cursor-pointer hover:-translate-y-1"
            >
              Create Account <FaUser />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden md:block absolute bottom-10 right-10 lg:bottom-30 lg:right-32 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="animate-[float_4s_ease-in-out_infinite] flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl w-fit">
            <div className="flex -space-x-3">
              {[
                "https://randomuser.me/api/portraits/men/1.jpg",
                "https://randomuser.me/api/portraits/men/2.jpg",
                "https://randomuser.me/api/portraits/men/3.jpg",
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Instructor"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white leading-none">
                130+
              </span>
              <span className="text-slate-300 text-sm font-medium">
                Expert Teacher
              </span>
            </div>
          </div>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
        </motion.div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-linear-to-r from-emerald-50 to-teal-50">
        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3">
              <Counter target={50} suffix="K+" />
            </div>
            <div className="text-xl font-semibold text-gray-700">
              Students Connected
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3">
              <Counter target={10} suffix="K+" />
            </div>
            <div className="text-xl font-semibold text-gray-700">
              Housing Listings
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3">
              <Counter target={5} suffix="K+" />
            </div>
            <div className="text-xl font-semibold text-gray-700">
              Study Groups
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3">
              <Counter target={99} suffix=".9%" />
            </div>
            <div className="text-xl font-semibold text-gray-700">
              Satisfaction Rate
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Everything you need to{" "}
              <span className="text-emerald-500 bg-emerald-100 px-4 py-2 rounded-2xl">
                thrive
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find housing, join study groups, and connect with students - all
              in one place.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="group bg-linear-to-br from-gray-50 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 cursor-pointer"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHome className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Student Housing
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Find verified student accommodations near your campus. Safe,
                affordable, and perfect for students.
              </p>
              <button className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 transition-colors">
                Find Housing{" "}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group bg-linear-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 cursor-pointer"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ">
                <FaUsers className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Study Groups
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Connect with students taking the same courses. Study smarter
                together.
              </p>
              <button className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 transition-colors">
                Join Groups{" "}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group bg-linear-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 cursor-pointer"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChartLine className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Campus Insights
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get real-time data on housing prices, popular courses, and
                campus events.
              </p>
              <button className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 transition-colors">
                View Insights{" "}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Comment ça marche Section */}
      <section className="py-20 px-8 bg-white">
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <div className="max-w-280 mx-auto text-center">
          <motion.h2
            className="text-4xl font-extrabold text-gray-900 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            Comment ça marche ?
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-16 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-emerald-100"></div>

            {/* Step 1 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32 }}
                >
                  person_search
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rechercher
              </h3>
              <p className="text-slate-500 text-base">
                Filtrez par sujet, lieu et niveau pour trouver le tuteur idéal.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32 }}
                >
                  list_alt
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choisir</h3>
              <p className="text-slate-500 text-base">
                Comparez les profils, les avis et les tarifs des instructeurs.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32 }}
                >
                  event_available
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Réserver</h3>
              <p className="text-slate-500 text-base">
                Planifiez votre séance en quelques clics et commencez à
                apprendre.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Categories Section */}
      <section className="py-xl px-8 bg-white pb-13">
        <div className="max-w-300 mx-auto">
          <motion.div
            className="flex justify-between items-end mb-10 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            <h2 className="font-bold text-on-surface text-xl ">
              Explorez par catégorie
            </h2>
            <a
              className="text-emerald-600 text-lg font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              href="/revisions"
            >
              Voir tout
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="h-full">
              <Link
                to="/revisions?search=mathématiques"
                className="group p-6 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] block h-full"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                  <span className="material-symbols-outlined">calculate</span>
                </div>
                <h3 className="font-semibold text-body-lg mb-1">
                  Mathématiques
                </h3>
                <p className="text-caption text-slate-500">
                  120+ Tuteurs disponibles
                </p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Link
                to="/revisions?search=programmation"
                className="group p-6 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] block h-full"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <h3 className="font-semibold text-body-lg mb-1">
                  Programmation
                </h3>
                <p className="text-caption text-slate-500">
                  85+ Tuteurs disponibles
                </p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Link
                to="/revisions?search=physique"
                className="group p-6 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] block h-full"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="font-semibold text-body-lg mb-1">Physique</h3>
                <p className="text-caption text-slate-500">
                  64+ Tuteurs disponibles
                </p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Link
                to="/revisions?search=Économie"
                className="group p-6 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200 cursor-pointer bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] block h-full"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h3 className="font-semibold text-body-lg mb-1">Économie</h3>
                <p className="text-caption text-slate-500">
                  42+ Tuteurs disponibles
                </p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* 6. About Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-10 items-center">
        <motion.div
          className="lg:w-1/2 grid grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInLeft}
        >
          <div className="space-y-2">
            <img
              src="/src/assets/students2.jpg"
              className="rounded-3xl w-full h-90 object-cover"
              alt="Student"
            />
            <div className="flex items-center gap-4 p-4">
              <span className="text-5xl font-bold text-emerald-500">New</span>
              <p className="text-gray-900 text-lg font-bold leading-tight">
                Platform
                <br />
                Launching
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-emerald-500 rounded-2xl p-6 text-white flex flex-row items-center justify-center gap-2 text-center">
              <div className="bg-white/20 p-5 rounded-full mb-2">
                <FaCheckCircle />
              </div>
              <p className="font-extrabold text-2xl">Live Better Together</p>
            </div>
            <img
              src="/src/assets/students1.jpg"
              className="rounded-3xl w-full h-80 object-cover"
              alt="Team"
            />
          </div>
        </motion.div>

        <motion.div
          className="lg:w-1/2 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInRight}
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase text-2xl">
            <h5 className="flex items-center gap-4">
              <FaBook /> About US
            </h5>
          </div>
          <h3 className="text-5xl font-serif text-slate-900">
            Connecting Students to Better Living
          </h3>
          <p className="text-gray-600 leading-relaxed">
            UniConnect helps students find the perfect place to live and the
            right people to live with. We simplify the search for colocation by
            bringing trusted listings, smart filters, and a student-first
            experience into one platform.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 font-semibold text-slate-800">
              <span className="text-emerald-500 text-xl">✓</span>
              Find verified student accommodations بسهولة
            </li>
            <li className="flex items-center gap-3 font-semibold text-slate-800">
              <span className="text-emerald-500 text-xl">✓</span>
              Connect with compatible roommates
            </li>
            <li className="flex items-center gap-3 font-semibold text-slate-800">
              <span className="text-emerald-500 text-xl">✓</span>
              Smart filters for budget, location & lifestyle
            </li>
          </ul>
          <div className="flex items-center gap-4 pt-4">
            <Link
              to="/profile"
              className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 cursor-pointer hover:gap-3 duration-200"
            >
              LEARN MORE{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gray-900 text-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to transform your{" "}
            <span className="text-emerald-400">uni life</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join 50,000+ students already using UniConnect to find housing and
            study partners.
          </p>
          <button
            className="bg-emerald-500 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:bg-emerald-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 cursor-pointer"
            onClick={() => (window.location.href = "/register")}
          >
            Join UniConnect Now
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
