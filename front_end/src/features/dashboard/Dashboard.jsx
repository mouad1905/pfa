import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import LocateurDashboard from "./LocateurDashboard";
import ProfessorDashboard from "./ProfessorDashboard";
import { AuthContext } from "../../context/AuthContext";

export default function Dashboard() {
  const { user: loggedInUser } = useContext(AuthContext);

  if (!loggedInUser) return <Navigate to="/login" replace />;

  const isProf = loggedInUser.role === "professeur";
  const isLoc =
    loggedInUser.role === "locateur" || loggedInUser.role === "proprietaire";

  if (!isProf && !isLoc) {
    return (
      <div className="bg-[#f8f9ff] pt-24 pb-12 min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-400 font-semibold text-center">
          Seuls les professeurs ou locateurs peuvent accéder au tableau de bord.
        </p>
      </div>
    );
  }

  if (isLoc) {
    return <LocateurDashboard user={loggedInUser} />;
  }

  return <ProfessorDashboard user={loggedInUser} />;
}
