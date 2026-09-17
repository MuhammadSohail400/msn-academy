import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Apple } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function MsnLogo() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[22px] w-[30px] items-center justify-center border border-white">
        <span className="text-[9px] font-semibold leading-none text-white">
          MSN
        </span>

        <span className="absolute -bottom-[5px] left-0 h-[2px] w-[34px] rotate-[-10deg] bg-[#ED1C24]" />
      </div>

      <span className="mt-1 text-[11px] leading-none text-white">
        Academy
      </span>
    </div>
  );
}

function SocialButton({ type, children }) {
  return (
    <button
      type="button"
      className={`flex h-[46px] w-full items-center justify-center gap-3 rounded-[12px] text-[14px] font-semibold transition ${
        type === "google"
          ? "border border-[#DCE2EA] bg-white text-[#3F4A5D] hover:bg-[#F8FAFC]"
          : "bg-black text-white hover:bg-[#171717]"
      }`}
    >
      {type === "google" ? (
        <span className="text-[21px] font-bold leading-none">
          <span className="text-[#4285F4]">
            <FcGoogle />
          </span>
        </span>
      ) : (
        <FaApple  size={21} strokeWidth={1.5} fill="white" />
      )}

      {children}
    </button>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  children,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-[8px] block text-[14px] font-medium text-[#4B5563] md:text-[14px]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {children}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`h-[46px] w-full rounded-[8px] border border-[#D9E0E8] bg-transparent px-4 text-[14px] text-[#344054] outline-none transition placeholder:text-[#969BA3] focus:border-[#AAB7CA] focus:ring-1 focus:ring-[#DCE3ED] ${
            isPassword ? "pr-11" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C3CCD8]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={17} strokeWidth={1.8} />
            ) : (
              <Eye size={17} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    courseUpdates: true,
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  function handleGenderChange(gender) {
    setFormData((previous) => ({
      ...previous,
      gender,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      agreeTerms,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    console.log("Register data:", formData);
  }

  return (
    <main className="min-h-screen bg-[#F6F8FA] text-[#15264E] md:flex md:flex-col md:items-center md:justify-center md:px-4 md:py-6">
      {/* ================= MOBILE HEADER ================= */}
      <section className="relative flex h-49 flex-col bg-[#10214B] px-5 pb-8 pt-12 md:hidden">
        <div className="absolute left-10.5 top-12">
          <MsnLogo />
        </div>

        <div className="mt-auto text-center">
          <h1 className="font-display text-[21px] font-bold leading-6.5 text-white">
            Join MSN Academy
          </h1>

          <p className="mt-1.25 text-[14px] text-[#9DA8BE]">
            Start your tech career today
          </p>
        </div>
      </section>

      {/* ================= DESKTOP LOGO ================= */}
      <div className="mb-8 hidden h-20 w-30 items-center justify-center rounded-[17px] bg-[#10214B] md:flex">
        <MsnLogo />
      </div>

      {/* ================= REGISTER CARD ================= */}
      <section className="w-full bg-[#F6F8FA] px-5 pb-8 pt-6 md:max-w-112.5 md:rounded-[17px] md:border md:border-[#E0E5EA] md:bg-white md:px-8.5 md:pb-9 md:pt-8.5 md:shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
        {/* Desktop heading */}
        <div className="hidden md:block">
          <h2 className="font-display text-[25px] font-bold leading-8 text-[#10214B]">
            Create Account
          </h2>

          <p className="mt-1 text-[14px] leading-5 text-[#AAB4C2]">
            Join MSN Academy and start learning today.
          </p>
        </div>

        {/* Social buttons */}
        <div className="mt-0 space-y-3 md:mt-8">
          <SocialButton type="google">Continue with Google</SocialButton>
          <SocialButton type="apple">Continue with Apple</SocialButton>
        </div>

        {/* Divider */}
        <div className="my-6.25 flex items-center gap-3 md:hidden">
          <div className="h-px flex-1 bg-[#E2E6EC]" />
          <span className="whitespace-nowrap text-[12px] text-[#9DA6B5]">
            or sign up with email
          </span>
          <div className="h-px flex-1 bg-[#E2E6EC]" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* ================= MOBILE PERSONAL DETAILS ================= */}
          <div className="md:hidden">
            <h3 className="mb-3.25 text-[13px] font-extrabold uppercase tracking-[0.2px] text-[#10214B]">
              Personal Details
            </h3>
          </div>

          {/* First and Last Name */}
          <div className="grid mt-5 grid-cols-2 gap-3">
            <FormInput
              label="First Name"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of birth - mobile only */}
          <div className="mt-3.25 md:hidden">
            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              placeholder=""
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Gender - mobile only */}
          <div className="mt-3.25 md:hidden">
            <label className="mb-2 block text-[12px] font-semibold text-[#697386]">
              Gender
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleGenderChange(gender)}
                  className={`h-9.5 rounded-[13px] border text-[12px] font-semibold transition ${
                    formData.gender === gender
                      ? "border-[#ED1C24] bg-[#FFF2F3] text-[#ED1C24]"
                      : "border-[#DCE3ED] bg-white text-[#697386]"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* ================= CONTACT INFORMATION ================= */}
          <div className="mt-6.25 md:mt-4.25">
            <h3 className="mb-3.25 text-[13px] font-extrabold uppercase tracking-[0.2px] text-[#10214B] md:hidden">
              Contact Information
            </h3>

            {/* Email */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <div className="mt-3.25">
              <label
                htmlFor="phone"
                className="mb-2 block text-[12px] font-semibold text-[#697386] md:text-[14px] md:font-medium md:text-[#4B5563]"
              >
                Phone Number
              </label>

              <div className="flex gap-2">
                <div className="flex h-11.5 w-18 shrink-0 items-center justify-center gap-1 rounded-lg border border-[#D9E0E8] text-[14px] text-[#536074] md:hidden">
                  <span className="text-[14px]">🇵🇰</span>
                  <span>+92</span>
                </div>

                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 text-[14px] text-[#969BA3] md:block">
                    +92
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="3XX XXX XXXX"
                    required
                    className="h-11.5 w-full rounded-lg border border-[#D9E0E8] bg-transparent px-4 text-[14px] text-[#344054] outline-none transition placeholder:text-[#969BA3] focus:border-[#AAB7CA] focus:ring-1 focus:ring-[#DCE3ED] md:pl-12"
                  />
                </div>
              </div>
            </div>

            {/* City - mobile only */}
            <div className="mt-3.25 md:hidden">
              <FormInput
                label="City / Location"
                name="city"
                placeholder="e.g. Karachi, Lahore, Islamabad"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ================= ACCOUNT SECURITY ================= */}
          <div className="mt-6.25 md:mt-4.25">
            <h3 className="mb-3.25 text-[13px] font-extrabold uppercase tracking-[0.2px] text-[#10214B] md:hidden">
              Account Security
            </h3>

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Mobile password strength indicator */}
            <div className="mt-2 flex items-center gap-1.25 md:hidden">
              <div className="h-1 flex-1 rounded-full bg-[#FF5962]" />
              <div className="h-1 flex-1 rounded-full bg-[#DFE3E8]" />
              <div className="h-1 flex-1 rounded-full bg-[#DFE3E8]" />
              <div className="h-1 flex-1 rounded-full bg-[#DFE3E8]" />
              <span className="ml-0.75 text-[10px] text-[#A3ACB9]">Weak</span>
            </div>

            <div className="mt-3.25">
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ================= TERMS DESKTOP ================= */}
          <div className="mt-4.25 hidden items-center gap-2 md:flex">
            <input
              id="agreeTermsDesktop"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-3.25 w-3.25 accent-[#ED1C24]"
            />

            <label
              htmlFor="agreeTermsDesktop"
              className="text-[14px] text-[#697386]"
            >
              I agree to the{" "}
              <span className="text-[#ED1C24]">Terms of Use</span> and{" "}
              <span className="text-[#ED1C24]">Privacy Policy</span>
            </label>
          </div>

          {/* ================= TERMS + UPDATES MOBILE ================= */}
          <div className="mt-4.25 rounded-[15px] border border-[#DCE3ED] bg-white px-4 py-4 md:hidden">
            <div className="flex items-start gap-3">
              <input
                id="agreeTermsMobile"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#ED1C24]"
              />

              <label
                htmlFor="agreeTermsMobile"
                className="text-[12px] leading-4.75 text-[#697386]"
              >
                I agree to MSN Academy's{" "}
                <span className="font-medium text-[#ED1C24]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-medium text-[#ED1C24]">
                  Privacy Policy
                </span>
              </label>
            </div>

            <div className="my-3.25 h-px bg-[#E1E5EB]" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-[#243557]">
                  Course updates & tips
                </p>

                <p className="mt-0.5 text-[10px] text-[#A3ADBC]">
                  Receive helpful emails about your progress
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    courseUpdates: !previous.courseUpdates,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  formData.courseUpdates ? "bg-[#ED1C24]" : "bg-[#CBD2DC]"
                }`}
                aria-label="Toggle course updates"
              >
                <span
                  className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white transition ${
                    formData.courseUpdates ? "right-0.75" : "left-0.75"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 rounded-[7px] bg-[#FFF0F1] px-3 py-2 text-[12px] text-[#D71920]">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-5 flex h-13 w-full items-center justify-center rounded-lg bg-[#ED1C24] text-[16px] font-bold text-white transition hover:bg-[#D71920] md:h-11 cursor-pointer"
          >
            <span className="md:hidden">Create My Account</span>
            <span className="hidden md:inline">Create Account</span>
          </button>
        </form>

        {/* Sign in */}
        <p className="mt-4.5 text-center text-[12px] text-[#A7B0BF] md:mt-8.75 md:text-[14px]">
          Already have an account?{" "}
          <Link 
            to="/login"
            className="font-bold text-[#ED1C24] hover:text-[#D71920]"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}