import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaUser,
} from "react-icons/fa";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1ab69d] focus:ring-2 focus:ring-[#1ab69d]/20 transition bg-white w-full"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1ab69d] focus:ring-2 focus:ring-[#1ab69d]/20 transition bg-white appearance-none w-full"
  >
    {children}
  </select>
);

/* ── STEP 1 ── */
const StepCreateAccount = ({ data, setData }) => {
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="First Name">
        <Input
          placeholder="John"
          value={data.firstName}
          onChange={set("firstName")}
        />
      </Field>
      <Field label="Last Name">
        <Input
          placeholder="Doe"
          value={data.lastName}
          onChange={set("lastName")}
        />
      </Field>
      <Field label="Email Address">
        <Input
          type="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={set("email")}
        />
      </Field>
      <Field label="Phone Number">
        <Input
          type="tel"
          placeholder="+212 6XX XXX XXX"
          value={data.phone}
          onChange={set("phone")}
        />
      </Field>
      <Field label="Date of Birth">
        <Input type="date" value={data.dob} onChange={set("dob")} />
      </Field>
      <div />
      <Field label="Password">
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={data.password}
            onChange={set("password")}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1ab69d] transition"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </Field>
      <Field label="Confirm Password">
        <div className="relative">
          <Input
            type={showC ? "text" : "password"}
            placeholder="Repeat password"
            value={data.confirm}
            onChange={set("confirm")}
          />
          <button
            type="button"
            onClick={() => setShowC(!showC)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1ab69d] transition"
          >
            {showC ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </Field>
      <div className="sm:col-span-2 flex items-start gap-2.5 mt-1">
        <input
          type="checkbox"
          id="terms"
          checked={data.terms}
          onChange={(e) => setData({ ...data, terms: e.target.checked })}
          className="mt-0.5 accent-[#1ab69d] w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="terms"
          className="text-xs text-gray-500 cursor-pointer leading-relaxed"
        >
          I agree to the{" "}
          <span className="text-[#1ab69d] underline font-medium">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#1ab69d] underline font-medium">
            Privacy Policy
          </span>
          .
        </label>
      </div>
    </div>
  );
};

/* ── STEP 2 ── */
const StepAcademicProfile = ({ data, setData }) => {
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });
  const setFile = (k) => (e) => {
    const f = e.target.files[0];
    if (f) setData({ ...data, [k]: f.name });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="University / Institution">
        <Input
          placeholder="e.g. Université Mohammed V"
          value={data.university}
          onChange={set("university")}
        />
      </Field>
      <Field label="Gmail Académique">
        <Input
          placeholder="e.g. name@example.com"
          value={data.gmailAcademique}
          onChange={set("gmailAcademique")}
        />
      </Field>
      <Field label="Field of Study">
        <Input
          placeholder="e.g. Computer Science"
          value={data.field}
          onChange={set("field")}
        />
      </Field>
      <Field label="Degree Level">
        <Select value={data.degree} onChange={set("degree")}>
          <option value="">Select degree</option>
          <option>Bachelor's (L1 – L3)</option>
          <option>Master's (M1 – M2)</option>
          <option>Doctorate (PhD)</option>
          <option>Engineering</option>
          <option>Other</option>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Upload Student Card">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#1ab69d] rounded-xl py-5 px-4 cursor-pointer transition group bg-gray-50 hover:bg-[#f3faf9]">
            <FaUpload className="text-gray-300 group-hover:text-[#1ab69d] text-xl mb-1.5 transition" />
            {data.studentCard ? (
              <span className="text-xs font-medium text-[#1ab69d]">
                {data.studentCard}
              </span>
            ) : (
              <>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#1ab69d] transition">
                  Click to upload
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  JPG, PNG or PDF — max 5 MB
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={setFile("studentCard")}
            />
          </label>
        </Field>
      </div>
    </div>
  );
};

/* ── STEP 3 ── */
const StepIdentityVerification = ({ data, setData }) => {
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });
  const setFile = (k) => (e) => {
    const f = e.target.files[0];
    if (f) setData({ ...data, [k]: f.name });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="ID Type">
        <Select value={data.idType} onChange={set("idType")}>
          <option value="">Select ID type</option>
          <option>National ID Card</option>
          <option>Passport</option>
          <option>Residence Permit</option>
          <option>Driver's License</option>
        </Select>
      </Field>
      <Field label="ID Number">
        <Input
          placeholder="e.g. AB123456"
          value={data.idNumber}
          onChange={set("idNumber")}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Profile Photo">
          <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 hover:border-[#1ab69d] rounded-xl px-4 py-3 cursor-pointer transition group bg-gray-50 hover:bg-[#f3faf9]">
            <div className="w-11 h-11 rounded-full bg-gray-100 group-hover:bg-[#1ab69d]/10 flex items-center justify-center transition shrink-0">
              <FaUser className="text-gray-300 group-hover:text-[#1ab69d] text-lg transition" />
            </div>
            <div>
              {data.photo ? (
                <span className="text-xs font-medium text-[#1ab69d]">
                  {data.photo}
                </span>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-[#1ab69d] transition">
                    Upload a clear photo of your face
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    JPG or PNG — max 3 MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={setFile("photo")}
            />
          </label>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Upload ID Document">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#1ab69d] rounded-xl py-5 px-4 cursor-pointer transition group bg-gray-50 hover:bg-[#f3faf9]">
            <FaUpload className="text-gray-300 group-hover:text-[#1ab69d] text-xl mb-1.5 transition" />
            {data.idFile ? (
              <span className="text-xs font-medium text-[#1ab69d]">
                {data.idFile}
              </span>
            ) : (
              <>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#1ab69d] transition">
                  Click to upload
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  JPG, PNG or PDF — max 5 MB
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={setFile("idFile")}
            />
          </label>
        </Field>
      </div>
    </div>
  );
};

/* ── MAIN ── */
import { API_URLS } from "../../api/api";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [step1, setStep1] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [step2, setStep2] = useState({
    university: "",
    gmailAcademique: "",
    field: "",
    degree: "",
    studentCard: "",
  });
  const [step3, setStep3] = useState({
    idType: "",
    idNumber: "",
    photo: "",
    idFile: "",
  });

  const stepTitles = [
    "Create Account",
    "Academic Profile",
    "Identity Verification",
  ];
  const formContent = [
    <StepCreateAccount data={step1} setData={setStep1} />,
    <StepAcademicProfile data={step2} setData={setStep2} />,
    <StepIdentityVerification data={step3} setData={setStep3} />,
  ];

  const handleRegister = async () => {
    if (step1.password !== step1.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!step1.terms) {
      setError("You must agree to the terms");
      return;
    }

    try {
      const response = await fetch(API_URLS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          nom: step1.lastName,
          prenom: step1.firstName,
          email: step1.email,
          password: step1.password,
          role: "etudiant",
          niveau_etude: step2.degree,
          cin: step3.idNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page on success
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen mt-13 bg-[#e3f2f1] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-full md:w-1/3 bg-[#f3faf9] p-7 flex flex-col border-r border-gray-100">
          <div className="mb-6 text-[#1ab69d] font-bold text-xl tracking-tighter">
            UniConnect
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-7">
            Create account <span className="text-[#1ab69d]">Student</span>
          </h2>
          <div className="flex flex-col grow">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div
                  key={stepNum}
                  className="relative flex items-start gap-3 pb-7"
                >
                  {index !== stepTitles.length - 1 && (
                    <div
                      className={`absolute left-4.25 top-9 w-0.5 h-[calc(100%-20px)] transition-colors duration-500 ${isCompleted ? "bg-[#1ab69d]" : "bg-gray-200"}`}
                    />
                  )}
                  <div
                    className={`z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted ? "bg-[#1ab69d] text-white shadow-lg shadow-[#1ab69d]/30" : isActive ? "bg-white border-2 border-[#1ab69d] text-[#1ab69d]" : "bg-gray-200 text-gray-500"}`}
                  >
                    {isCompleted ? <FaCheck className="text-xs" /> : stepNum}
                  </div>
                  <span
                    className={`text-sm font-semibold mt-1 transition-colors ${currentStep >= stepNum ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>

          <a
            href="/register"
            className="mt-auto text-md text-[#1ab69d] font-medium hover:underline transition self-start"
          >
            Choose Another Role
          </a>
        </div>

        {/* CONTENT */}
        <div className="w-full md:w-2/3 p-8 flex flex-col">
          <div className="grow overflow-y-auto pr-1">
            <header className="mb-6 flex flex-col gap-1">
              <span className="text-sm font-bold text-[#1ab69d] tracking-widest uppercase">
                Step {currentStep} of {stepTitles.length}
              </span>
              <h3 className="text-base font-bold">
                Step {currentStep} — {stepTitles[currentStep - 1]}
              </h3>
            </header>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded text-sm mb-4">
                {error}
              </div>
            )}
            <div
              key={currentStep}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {formContent[currentStep - 1]}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-[#1ab69d] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#169a85] transition-all shadow-lg shadow-[#1ab69d]/20 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-0"
            >
              <FaChevronLeft /> Back
            </button>
            <button
              onClick={() => {
                if (currentStep < stepTitles.length) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleRegister();
                }
              }}
              className="bg-[#1ab69d] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#169a85] transition-all shadow-lg shadow-[#1ab69d]/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {currentStep === stepTitles.length ? "Finish" : "Next"}
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
