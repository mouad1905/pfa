import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaKey } from "react-icons/fa";


const SelectRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "etudiant",
      title: "Étudiant",
      icon: <FaUserGraduate />,
      desc: "Trouvez un logement ou un partenaire d’étude.",
      route: "/register/student",
    },
    {
      id: "professeur",
      title: "Professeur",
      icon: <FaChalkboardTeacher />,
      desc: "Partagez vos connaissances et ressources.",
      route: "/register/professor",
    },
    {
      id: "locateur",
      title: "Locateur",
      icon: <FaKey />,
      desc: "Proposez des chambres ou logements.",
      route: "/register/locateur",
    },
  ];

  return (
    <div className="min-h-screen flex mt-10 items-center justify-center bg-linear-to-br from-[#f8fafc] to-white px-4">
      <div className="w-full max-w-5xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            Choisissez votre profil
          </h1>
          <p className="text-slate-500">
            Pour commencer, sélectionnez le type de compte que vous souhaitez
            créer
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => navigate(role.route)}
              className="group cursor-pointer bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* ICON */}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 text-2xl mb-6 group-hover:scale-110 transition">
                {role.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {role.title}
              </h3>

              {/* DESC */}
              <p className="text-sm text-slate-500 leading-relaxed">
                {role.desc}
              </p>

              {/* HOVER LINE */}
              <div className="mt-6 w-0 h-1 bg-emerald-500 group-hover:w-10 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-400 mt-10">
          Vous avez déjà un compte ?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-500 font-semibold cursor-pointer hover:underline"
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
};

export default SelectRole;
