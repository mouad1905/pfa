const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold italic">
            U
          </div>
          <h1 className="text-3xl font-extrabold">
            Uni<span className="text-[#10b981]">Connect</span>
          </h1>
          <p className="text-gray-300 text-sm">
            Connectez, apprenez et partagez vos connaissances avec la
            communauté.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-[#10b981]">Découvrir</h3>
          <a href="/" className="text-gray-400 hover:text-teal-400 transition">
            Accueil
          </a>
          <a
            href="/colocations"
            className="text-gray-400 hover:text-teal-400 transition"
          >
            Colocations
          </a>
          <a
            href="/revisions"
            className="text-gray-400 hover:text-teal-400 transition"
          >
            Revisions
          </a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-[#10b981]">Support</h3>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition">
            FAQ
          </a>
          <a
            href="/support"
            className="text-gray-400 hover:text-teal-400 transition"
          >
            Contact
          </a>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition">
            Mentions légales
          </a>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition">
            Politique de confidentialité
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700  py-4 text-center text-gray-500 text-sm">
        &copy; 2025 UniConnect. Tous droits réservés.
      </div>
    </footer>
  );
};
export default Footer;
