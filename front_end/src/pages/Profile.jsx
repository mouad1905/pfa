import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URLS, fetchData } from "../api/api";
import {
  FaCheckCircle,
  FaUserCheck,
  FaCommentDots,
  FaExclamationCircle,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

function ReportModal({ onClose, user }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    "Fake profile",
    "Inappropriate content",
    "Spam or scam",
    "Incorrect info",
    "Harassment",
    "Other",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationCircle className="text-red-500" />
                </div>
                <h2 className="font-semibold text-gray-800">
                  Report a problem
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={`https://i.pravatar.cc/150?u=${user?.id_user}`}
                alt="user"
              />
              <div>
                <p className="text-sm font-semibold">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role} · {user?.niveau_etude}
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Reason
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelected(r)}
                  className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                    selected === r
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Additional details (optional)..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-red-400 mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSubmitted(true)}
                className="flex-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <FaPaperPlane size={12} /> Send report
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">Report submitted</p>
            <p className="text-sm text-gray-500 mb-4">
              Our team will review this profile shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const { id } = useParams();
  const [showReport, setShowReport] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // If an ID is provided, fetch that user. Otherwise fetch the current logged-in user.
        const url = id
          ? `http://127.0.0.1:8000/api/users/${id}`
          : API_URLS.USER;
        const data = await fetchData(url);
        setUser(data.data || data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Failed to load profile. Please login again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] mt-20 min-h-screen font-sans">
      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} user={user} />
      )}

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* PROFILE CARD */}
          <section className="md:col-span-4 rounded-2xl shadow p-4 flex flex-col items-center text-center bg-white">
            <div className="relative mb-6">
              <img
                className="w-40 h-40 rounded-full border-4 shadow object-cover"
                src={`https://i.pravatar.cc/150?u=${user.id_user}`}
                alt="user"
              />
              <span className="absolute bottom-2 right-2 text-green-500 text-xl bg-white rounded-full">
                <FaCheckCircle />
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              {user.prenom} {user.nom}
            </h1>
            <p className="text-gray-500 text-lg">{user.email}</p>
            <div className="flex gap-2 mt-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {user.role}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {user.niveau_etude}
              </span>
            </div>
          </section>

          {/* EDUCATION */}
          <section className="md:col-span-8 rounded-2xl shadow p-8 bg-white">
            <div className="flex items-center gap-60 mb-4">
              <h2 className="text-lg text-emerald-600 uppercase mb-2 font-bold">
                Profile Status
              </h2>
              <div className="flex items-center gap-3">
                <FaUserCheck className="text-xl text-emerald-600" />
                <span className="text-lg text-emerald-600 font-medium">
                  Verified {user.role}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6 capitalize">
              {user.prenom} {user.nom}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500">Email Address</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Degree Level</p>
                <p className="font-semibold">{user.niveau_etude}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold">
                  {user.telephone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Account Role</p>
                <p className="font-semibold capitalize">{user.role}</p>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="md:col-span-12 bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold">Manage Account</h2>
              <p className="text-gray-500">Update your profile or settings</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md font-medium">
                <FaCommentDots className="mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowReport(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:scale-105 shadow-md transition-all duration-200 font-medium"
              >
                <FaExclamationCircle />
                Report Issue
              </button>
            </div>
          </section>

          {/* INTERESTS */}
          <section className="md:col-span-6 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg text-emerald-600 uppercase mb-2">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded-lg">
                Machine Learning
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-lg">AI</span>
              <span className="bg-gray-100 px-3 py-1 rounded-lg">
                Cybersecurity
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-lg">UI/UX</span>
            </div>
          </section>

          {/* ABOUT */}
          <section className="md:col-span-6 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg text-emerald-600 uppercase mb-2">About</h2>
            <p className="text-gray-600">
              Passionate AI student who enjoys helping others understand complex
              concepts.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
