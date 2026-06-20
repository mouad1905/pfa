import { FaHome, FaMapMarkerAlt, FaWallet } from "react-icons/fa";

export const filters = [
  { id: "all", label: "Toutes les zones", icon: FaHome },
  { id: "campus", label: "Près du campus", icon: FaMapMarkerAlt, disabled: true },
  { id: "budget", label: "Budget < 3k MAD", icon: FaWallet },
];
