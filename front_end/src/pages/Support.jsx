import { useState } from "react";
import {
  FaPaperPlane,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function ContactSection() {
  const [saveEmail, setSaveEmail] = useState(false);
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
      icon: <FaPhone />,
      label: "+212 96 15 92 51",
      sublabel: "Call us Anytime",
    },
    {
      icon: <FaEnvelope />,
      label: "uniconnectSupport@gmail.com",
      sublabel: "Email us Anytime",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "5 Rue Lalla Aicha, Fes 30050",
      sublabel: "Fes, MOROCCO",
      isLocation: true,
    },
  ];

  return (
    <section>
      <section className="min-h-screen bg-white flex items-center mt-20 justify-center px-15 py-20 font-sans">
        <div className="px-15 w-auto grid grid-cols-1 lg:grid-cols-2 items-start ">
          {/* Left Column */}
          <motion.div 
            className=" w-130 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInLeft}
          >
            {/* Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-500 font-extrabold text-3xl">
                <FaPaperPlane />
              </span>
              <span className="text-emerald-500 font-bold uppercase text-3xl tracking-widest ">
                Get In Touch
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              Trusted By the Genious
              <br />
              People with UniConnect
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              We connect students with housing, study resources, and support
              services through a simple and modern platform designed to improve
              everyday student life.
            </p>

            {/* Contact Info Card */}
            <div className="bg-emerald-50 w-110 rounded-2xl px-7 py-3 space-y-0 divide-y divide-dashed divide-emerald-200">
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 py-5 first:pt-0 last:pb-0"
                >
                  <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    {item.isLocation ? (
                      <>
                        <p className="text-xs text-gray-400 mb-0.5">
                          {item.sublabel}
                        </p>
                        <p className="text-gray-800 font-semibold text-sm">
                          {item.label}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-gray-400 mb-0.5">
                          {item.sublabel}
                        </p>
                        <p className="text-gray-800 font-semibold text-sm">
                          {item.label}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div 
            className="w-150 rounded-2xl shadow-lg border border-gray-100 px-8 py-8 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInRight}
          >
            {/* Tag */}
            <div className=" flex justify-center items-center gap-2 mb-3">
              <h5 className="text-emerald-500 text-3xl font-bold tracking-widest uppercase text-center">
                Contact Us
              </h5>
            </div>

            <h3 className="text-3xl font-bold text-center text-gray-900 mb-5">
              Feel Free To Contact Us
            </h3>

            {/* Grid inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 transition"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone No"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter E-Mail *"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 transition"
              />
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 transition bg-white appearance-none"
              >
                <option value="" disabled>
                  Select Subjects *
                </option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Textarea */}
            <textarea
              name="message"
              placeholder="Write Message :"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 transition resize-y mb-5"
            />

            {/* Submit Button */}
            <button
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-md shadow-emerald-200"
            >
              Send Message
            </button>
          </motion.div>
        </div>
      </section>
      <div className="w-auto h-100 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.3794282691547!2d-5.010958325031051!3d34.0341369186873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8ba783182787%3A0xf081ce6917c14af9!2sEMSI%20F%C3%A8s%20(%20%C3%89cole%20Marocaine%20des%20Sciences%20de%20l%E2%80%99Ing%C3%A9nieur)!5e0!3m2!1sfr!2sma!4v1777160110348!5m2!1sfr!2sma"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
