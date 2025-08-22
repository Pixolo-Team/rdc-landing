// REACT //
import React, { useEffect, useMemo, useState, useCallback } from "react";

// TYPES //
import type {
  CityCatalogData,
  LocationCatalogData,
  AppointmentSlotData,
  CatalogResponseData,
} from "../types/dropdown";

// COMPONENTS //
import Popup from "../components/Popup";
import Select from "../components/Select";

// API SERVICES //
import {
  otpRequest,
  verifyOtpRequest,
  registerRequest,
} from "../services/api/auth.api.service";

type FormProps = {
  catalog: CatalogResponseData;
};

type FormDetails = {
  fullName: string;
  dob: string;
  email: string;
  contactNumber: string;
  institution: string;
};

const INITIAL_FORM: FormDetails = {
  fullName: "",
  dob: "",
  email: "",
  contactNumber: "",
  institution: "",
};

const Form: React.FC<FormProps> = ({ catalog }) => {
  // Catalog-derived lists
  const [cities, setCities] = useState<CityCatalogData[]>([]);
  const [locations, setLocations] = useState<LocationCatalogData[]>([]);
  const [slots, setSlots] = useState<AppointmentSlotData[]>([]);

  // Selections
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // UI + OTP
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  // Busy states
  const [isLoading, setIsLoading] = useState<boolean>(false); // for OTP send/verify
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // for form submit

  // Form fields
  const [formDetails, setFormDetails] = useState<FormDetails>(INITIAL_FORM);

  // For the DOB input: swap type to show native picker but keep custom placeholder
  type DobInputType = "text" | "date";
  const [dobInputType, setDobInputType] = useState<DobInputType>("text");

  // Error messages for each field
  const [errors, setErrors] = useState<{
    fullName: string;
    dob: string;
    email: string;
    contactNumber: string;
    institution: string;
    city: string;
    location: string;
    slot: string;
    otp: string;
    general: string;
  }>({
    fullName: "",
    dob: "",
    email: "",
    contactNumber: "",
    institution: "",
    city: "",
    location: "",
    slot: "",
    otp: "",
    general: "",
  });

  // ---------- Helpers ----------
  const updateFormField = useCallback(
    (field: keyof FormDetails, value: string) =>
      setFormDetails((prev) => ({ ...prev, [field]: value })),
    []
  );

  // Clear specific error
  const clearError = useCallback((field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  // Set specific error
  const setError = useCallback(
    (field: keyof typeof errors, message: string) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setFormDetails(INITIAL_FORM);
    setSelectedCity("");
    setSelectedLocation("");
    setSelectedSlot("");
    setLocations([]);
    setSlots([]);
    setOtp("");
    setOtpSent(false);
    setShowPopup(false);
    setErrors({
      fullName: "",
      dob: "",
      email: "",
      contactNumber: "",
      institution: "",
      city: "",
      location: "",
      slot: "",
      otp: "",
      general: "",
    });
    localStorage.removeItem("authToken");
    setDobInputType("text");
  }, []);

  const validateForm = useCallback((): string | null => {
    let hasErrors = false;

    // Clear previous errors
    setErrors((prev) => ({
      ...prev,
      fullName: "",
      dob: "",
      email: "",
      contactNumber: "",
      institution: "",
      city: "",
      location: "",
      slot: "",
    }));

    // Validate each field
    if (!formDetails.fullName.trim()) {
      setError("fullName", "Please enter your full name.");
      hasErrors = true;
    }
    if (!formDetails.dob) {
      setError("dob", "Please select your date of birth.");
      hasErrors = true;
    }
    if (!formDetails.contactNumber.trim()) {
      setError("contactNumber", "Please enter your mobile number.");
      hasErrors = true;
    }
    if (!formDetails.email.trim()) {
      setError("email", "Please enter your email.");
      hasErrors = true;
    }
    if (!formDetails.institution.trim()) {
      setError("institution", "Please enter your institution.");
      hasErrors = true;
    }
    if (!selectedCity) {
      setError("city", "Please select a city.");
      hasErrors = true;
    }
    if (!selectedLocation) {
      setError("location", "Please select a location/center.");
      hasErrors = true;
    }
    if (!selectedSlot) {
      setError("slot", "Please select a slot.");
      hasErrors = true;
    }

    return hasErrors ? "Please fix the errors above." : null;
  }, [formDetails, selectedCity, selectedLocation, selectedSlot, setError]);

  // ---------- Effects ----------
  // Load cities once from prop
  useEffect(() => {
    if (Array.isArray(catalog) && catalog.length > 0) {
      setCities(catalog);
    } else {
      setCities([]);
    }
  }, [catalog]);

  // When city changes → set locations & clear downstream selections
  useEffect(() => {
    if (!selectedCity) {
      setLocations([]);
      setSlots([]);
      setSelectedLocation("");
      setSelectedSlot("");
      return;
    }

    const city = cities.find((c) => String(c.id) === selectedCity);
    setLocations(city?.locations ?? []);
    setSelectedLocation("");
    setSlots([]);
    setSelectedSlot("");
  }, [selectedCity, cities]);

  // When location changes → set slots & clear slot selection
  useEffect(() => {
    if (!selectedLocation) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    const location = locations.find((l) => String(l.id) === selectedLocation);
    setSlots(location?.appointments ?? []);
    setSelectedSlot("");
  }, [selectedLocation, locations]);

  // Derived options for Select components
  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: String(c.id), label: c.name })),
    [cities]
  );
  const locationOptions = useMemo(
    () => locations.map((l) => ({ value: String(l.id), label: l.name })),
    [locations]
  );
  const slotOptions = useMemo(
    () => slots.map((s) => ({ value: String(s.id), label: s.name })),
    [slots]
  );

  // ---------- OTP ----------
  const handleRequestOtp = useCallback(async () => {
    const email = formDetails.email.trim();
    if (!email) {
      setError("email", "Please enter an email address");
      return;
    }

    clearError("email");
    try {
      setIsLoading(true);
      const response = await otpRequest(email);

      if (response.status) {
        setOtpSent(true);
        setShowPopup(true);
      } else {
        setError("email", response.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("email", "Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formDetails.email, setError, clearError]);

  const handleVerifyOtp = useCallback(async () => {
    const email = formDetails.email.trim();
    const code = otp.trim();

    if (!email || !code) {
      setError("otp", "Please enter both email and OTP");
      return;
    }

    clearError("otp");
    try {
      setIsLoading(true);
      const response = await verifyOtpRequest(email, code);

      if (response.status) {
        setError("general", "Email verified successfully!");
        setShowPopup(false);
        setOtp("");
        setOtpSent(false);
        // token saved to localStorage by your service
      } else {
        setError("otp", response.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("otp", "Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formDetails.email, otp, setError, clearError]);

  // ---------- Submit ----------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateForm();
      if (validationError) {
        setError("general", validationError);
        return;
      }

      // Check if email is verified
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(
          "general",
          "Please verify your email first before submitting."
        );
        return;
      }

      try {
        setIsSubmitting(true);

        const payload = {
          full_name: formDetails.fullName.trim(),
          dob: formDetails.dob,
          email: formDetails.email.trim(),
          contact_number: formDetails.contactNumber.trim(),
          institution: formDetails.institution.trim(),
          city_id: selectedCity,
          location_id: selectedLocation,
          appointment_id: selectedSlot,
        };

        const response = await registerRequest(payload);

        if (response.status) {
          setError("general", "Registration successful!");
          resetAll();
        } else {
          setError("general", response.message || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        setError("general", "Error during registration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formDetails,
      selectedCity,
      selectedLocation,
      selectedSlot,
      resetAll,
      validateForm,
      setError,
    ]
  );

  // Close popup cleanup
  const closePopup = useCallback(() => {
    setShowPopup(false);
    // keep otpSent state as-is so user can reopen and verify,
    // but clear typed OTP to avoid stale input
    setOtp("");
  }, []);

  return (
    <section className="w-full flex items-center py-12 min-h-full">
      {/* Wrapper with fixed heights + background image */}
      <div className="relative w-full h-full bg-[url('/images/form-bg.png')] bg-no-repeat bg-top bg-[length:100%_82%]">
        {/* Centered overlay container */}
        <div className="container mx-auto flex justify-center items-center w-full py-24 max-md:px-7">
          {/* Card shell: neutral surface, rounded, shadow */}
          <div className="w-11/12 max-w-5xl bg-n-50/95 rounded-2xl shadow-xl p-20 max-md:py-14 max-md:px-8 flex flex-col gap-24 max-md:gap-14">
            {/* Form: row on lg+, stacked below */}
            <h2 className="text-5xl max-sm:text-4xl font-semibold text-cyan-500 max-md:text text-center ">
              {"Register Now"}
            </h2>
            {/* Form: stacked, but with grouped rows */}
            <form
              className="flex flex-col w-full gap-10 lg:gap-16"
              onSubmit={handleSubmit}
            >
              {/* Row 1: Full Name (60) + DOB (40) */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                <div className="w-full lg:basis-[60%] relative">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    aria-label="Full Name"
                    value={formDetails.fullName}
                    onChange={(e) =>
                      updateFormField("fullName", e.target.value)
                    }
                    className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="w-full lg:basis-[40%] relative">
                  <input
                    type={dobInputType}
                    placeholder="DOB *"
                    aria-label="Date of Birth"
                    value={formDetails.dob}
                    onChange={(e) => updateFormField("dob", e.target.value)}
                    onFocus={() => setDobInputType("date")}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) setDobInputType("text");
                    }}
                    className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                  />
                  {errors.dob && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.dob}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email (60) + Mobile (40) */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                <div className="w-full lg:basis-[60%] relative">
                  <input
                    type="email"
                    placeholder="Email *"
                    aria-label="Email"
                    value={formDetails.email}
                    onChange={(e) => updateFormField("email", e.target.value)}
                    className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950 pr-28"
                  />

                  {/* Absolute button inside input container */}
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isLoading}
                    className="absolute right-0 top-3 text-base font-medium underline text-sky-500 hover:text-sky-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? "Sending..." : "Verify email"}
                  </button>

                  {errors.email && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="w-full lg:basis-[40%] relative">
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    aria-label="Mobile Number"
                    value={formDetails.contactNumber}
                    onChange={(e) =>
                      updateFormField("contactNumber", e.target.value)
                    }
                    className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Institution (60) + City (40) */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                <div className="w-full lg:basis-[60%] relative">
                  <input
                    type="text"
                    placeholder="Institution Name *"
                    aria-label="Institution Name"
                    value={formDetails.institution}
                    onChange={(e) =>
                      updateFormField("institution", e.target.value)
                    }
                    className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.institution}
                    </p>
                  )}
                </div>

                <div className="w-full lg:basis-[40%]">
                  <Select
                    id="city"
                    label="City *"
                    options={cityOptions}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  />
                  {errors.city && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Location (60) + Slot (40) */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                <div className="w-full lg:basis-[60%]">
                  <Select
                    id="location"
                    label="Location/Center *"
                    options={locationOptions}
                    disabled={!selectedCity}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                  {errors.location && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="w-full lg:basis-[40%]">
                  <Select
                    id="slot"
                    label="Select Slot *"
                    options={slotOptions}
                    disabled={!selectedLocation}
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  />
                  {errors.slot && (
                    <p className="mt-1 text-base font-medium text-red-500">
                      {errors.slot}
                    </p>
                  )}
                </div>
              </div>
            </form>

            {/* Submit row */}
            <div className="text-center">
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-2/4 cursor-pointer max-md:w-full bg-n-900 hover:bg-n-800 text-n-50 px-10 max-md:px-8 py-7 flex items-center justify-between gap-4 transition-colors disabled:opacity-50"
                >
                  <span className="text-xl font-bold leading-none">
                    {isSubmitting ? "Submitting..." : "Confirm My Seat"}
                  </span>
                  <img
                    src="/images/right-arrow.svg"
                    alt="Arrow"
                    className="w-8 h-auto"
                  />
                </button>
              </div>
              {errors.general && (
                <p className="mt-1 text-base font-medium text-red-500 mt-3">
                  {errors.general}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      <Popup isOpen={showPopup} onClose={closePopup}>
        <div className="px-10">
          {/* <!-- Content Column --> */}
          <div className="flex flex-col justify-start items-start w-full">
            {/* <!-- Email Verification Title --> */}
            <h1 className="text-[18px] sm:text-[24px] md:text-[36px] font-bold leading-[22px] sm:leading-[30px] md:leading-[44px] text-center text-[#1ba7e0] w-full mb-4">
              Email Verification
            </h1>

            {/* <!-- Description Text --> */}
            <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[18px] sm:leading-[19px] md:leading-[20px] text-center text-[#797777] w-full mb-6">
              We have sent an OTP to your Email ID.
              <br />
              Check your inbox or spam/junk.
            </p>

            {/* <!-- OTP Input with Line --> */}
            <div className="w-[90%] mt-[8px] sm:mt-[12px] md:mt-[16px] mx-auto ">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border-n-950 border-b bg-transparent outline-none text-[20px] font-medium pb-2 text-center placeholder-n-950"
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errors.otp && (
                <p className="mt-1 text-base font-medium text-red-500">
                  {errors.otp}
                </p>
              )}
            </div>
          </div>
          {/* <!-- Verify Button --> */}
          <div className="flex justify-center w-full">
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-n-900 mt-12 hover:bg-n-800 text-n-50 px-10 max-md:px-8 py-7 flex items-center justify-between gap-4 transition-colors cursor-pointer "
            >
              <span className="text-xl font-bold leading-none">
                Verify Email
              </span>
              <img
                src="/images/right-arrow.svg"
                alt="Arrow"
                className="w-8 h-auto"
              />
            </button>
          </div>
        </div>
      </Popup>
    </section>
  );
};

export default Form;
