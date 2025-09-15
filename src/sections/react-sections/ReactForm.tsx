// REACT //
import React, { useEffect, useMemo, useState, useCallback } from "react";

// TYPES //
import type {
  CityCatalogData,
  LocationCatalogData,
  AppointmentSlotData,
  CatalogResponseData,
} from "../../types/dropdown";
import type { FormDetailsData } from "../../types/form";

// COMPONENTS //
import StyledSelect from "../../components/StyledSelect";
import { OtpPopup } from "../../components/react-components/OtpPopup";

// API SERVICES //
import { otpRequest } from "../../services/api/auth.api.service";
import { registerRequest } from "../../services/api/register.api.service";

// CONSTANTS //
import { INITIAL_FORM } from "../../constants/app.constant";

// UTILS //
import { calculateAge, isValidEmail } from "../../utils/validation.util";

// Props for this Component
type FormProps = {
  catalog: CatalogResponseData;
};

/** Export the Form Component */
export const ReactForm: React.FC<FormProps> = ({ catalog }) => {
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
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  // Busy states
  const [isLoading, setIsLoading] = useState<boolean>(false); // for OTP send/verify
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // for form submit

  // Form fields
  const [formDetails, setFormDetails] = useState<FormDetailsData>(INITIAL_FORM);

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

  // ---------- Helpers ---------- //
  /** Check if all required form fields are filled */
  const hasAllRequiredFields = useCallback((): boolean => {
    return !!(
      formDetails.fullName.trim() &&
      formDetails.dob &&
      formDetails.email.trim() &&
      formDetails.contactNumber.trim() &&
      formDetails.institution.trim() &&
      selectedCity &&
      selectedLocation &&
      selectedSlot
    );
  }, [formDetails, selectedCity, selectedLocation, selectedSlot]);

  /** Update the Form Inputs */
  const updateFormField = useCallback(
    (field: keyof FormDetailsData, value: string) =>
      setFormDetails((prev) => ({ ...prev, [field]: value })),
    [],
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
    [],
  );

  /** Reset the Form Inputs */
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
    setEmailVerified(false);
  }, []);

  /** Validate the Form Inputs */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formDetails.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!formDetails.dob) {
      newErrors.dob = "Please select your date of birth.";
    } else {
      const age = calculateAge(formDetails.dob);
      if (age < 13) {
        newErrors.dob = "You must be at least 13 years old.";
      }
    }

    if (!formDetails.contactNumber.trim()) {
      newErrors.contactNumber = "Please enter your mobile number.";
    }

    if (!formDetails.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!isValidEmail(formDetails.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formDetails.institution.trim()) {
      newErrors.institution = "Please enter your institution.";
    }

    if (!selectedCity) {
      newErrors.city = "Please select a city.";
    }

    if (!selectedLocation) {
      newErrors.location = "Please select a location/center.";
    }

    if (!selectedSlot) {
      newErrors.slot = "Please select a slot.";
    }

    // Update state once
    setErrors((prev) => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length > 0;
  }, [formDetails, selectedCity, selectedLocation, selectedSlot, setErrors]);

  // ---------- Effects ---------- //
  // Clear local storage on page load
  useEffect(() => {
    localStorage.setItem("authToken", "abc");
  }, []);

  // Load cities once from prop
  useEffect(() => {
    if (Array.isArray(catalog) && catalog.length > 0) {
      // Filter only Kolkata and Ahemdabad
      const filtered = catalog.filter(
        (city) =>
          city.name?.toLowerCase() === "kolkata" ||
          city.name?.toLowerCase() === "ahemdabad" ||
          city.name?.toLowerCase() === "pune" ||
          city.name?.toLowerCase() === "mumbai",
      );
      setCities(filtered);
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
    [cities],
  );
  const locationOptions = useMemo(
    () => locations.map((l) => ({ value: String(l.id), label: l.name })),
    [locations],
  );
  const slotOptions = useMemo(
    () => slots.map((s) => ({ value: String(s.id), label: s.name })),
    [slots],
  );

  // ---------- REQUEST OTP ---------- //
  const handleRequestOtp = useCallback(async () => {
    // Get Email
    const email = formDetails.email.trim();
    if (!email) {
      setError("email", "Please enter an email address");
      return;
    }
    if (!isValidEmail(email)) {
      setError("email", "Please enter a valid email address.");
      return;
    }

    clearError("email");
    try {
      setIsLoading(true);
      const response = await otpRequest(email);

      if (response.status) {
        setOtpSent(true);
        setShowPopup(true);
        setEmailVerified(false); // reset verified state when sending a new OTP
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

  // ---------- Submit ----------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateForm();
      if (validationError) return;

      // Check if email is verified
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(
          "general",
          "Please verify your email first before submitting.",
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
          window.location.href = `/success?registration_id=${response.data.registration_id}`;
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
    ],
  );

  // Close popup cleanup
  const closePopup = useCallback(() => {
    setShowPopup(false);
    setOtpSent(false);
    // keep otpSent state as-is so user can reopen and verify,
    // but clear typed OTP to avoid stale input
    setOtp("");
  }, []);

  return (
    <section id="registerForm" className="w-full min-h-full pt-16">
      {/* Wrapper with fixed heights + background image */}
      <div className="w-full bg-[url('/images/form-bg.png')] bg-no-repeat bg-top bg-[length:100%_80%]">
        {/* Centered overlay container */}
        <div className="container mx-auto flex justify-center py-22">
          {/* Card shell: neutral surface, rounded, shadow */}
          <div className="flex flex-col gap-10 w-11/12 bg-n-50 rounded-2xl shadow-xl px-10 py-12 md:px-14 md:w-5/6 lg:px-20">
            {/* Form: row on lg+, stacked below */}
            <h2 className="section-title">{"Register Now"}</h2>

            <div className="flex flex-col gap-12">
              {/* Form: stacked, but with grouped rows */}
              <form
                className="flex flex-col w-full gap-10 lg:gap-16"
                onSubmit={handleSubmit}
              >
                {/* Row 1: Full Name (60) + DOB (40) */}
                <div className="flex flex-col lg:flex-row gap-10 w-full lg:gap-32">
                  {/* Full Name Input */}
                  <div className="w-full relative lg:basis-[60%]">
                    <input
                      id="fullName"
                      type="text"
                      placeholder=" "
                      aria-label="Full Name"
                      value={formDetails.fullName}
                      onChange={(e) =>
                        updateFormField("fullName", e.target.value)
                      }
                      className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                    />

                    {/* Floating label that looks like a placeholder */}
                    {formDetails.fullName.length === 0 && (
                      <label
                        htmlFor="fullName"
                        className="
                        text-xl text-n-900
                        absolute left-0 top-[12px] text-n-950
                        pointer-events-none
                      "
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                    )}

                    {errors.fullName && (
                      <p className="mt-1 text-base font-medium text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* DOB Input */}
                  <div className="w-full lg:basis-[40%] relative">
                    <input
                      id="dob"
                      type={"date"}
                      placeholder=" "
                      aria-label="Date of Birth"
                      value={formDetails.dob}
                      onChange={(e) => {
                        updateFormField("dob", e.target.value);
                      }}
                      max={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 13),
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                    />

                    {/* Floating label that looks like a placeholder */}
                    {formDetails.dob.length === 0 &&
                      dobInputType === "text" && (
                        <label
                          htmlFor="dob"
                          className="
                        text-xl text-n-900
                        absolute left-0 top-[12px] text-n-950
                        pointer-events-none bg-n-50
                      "
                        >
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                      )}

                    {errors.dob && (
                      <p className="mt-1 text-base font-medium text-red-500">
                        {errors.dob}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email (60) + Mobile (40) */}
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                  {/* Email Input */}
                  <div className="w-full lg:basis-[60%] relative">
                    <input
                      id="email"
                      type="email"
                      placeholder=" "
                      aria-label="Email"
                      value={formDetails.email}
                      onChange={(e) => updateFormField("email", e.target.value)}
                      className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950 pr-28"
                      disabled={emailVerified}
                    />

                    {/* Absolute button inside input container */}
                    {/* {!emailVerified ? (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isLoading}
                        className="absolute right-0 top-3.5 text-base font-medium underline text-sky-500 hover:text-sky-600 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? "Sending..." : "Verify email"}
                      </button>
                    ) : (
                      <span className="absolute right-2 top-3.5 text-base font-semibold text-green-600">
                        Verified
                      </span>
                    )} */}

                    {!errors.email && !emailVerified && (
                      <p className="text-xs text-n-500 mt-1">
                        Enter a valid Email to get your Coupons and Drop Kit
                        details.
                      </p>
                    )}

                    {/* Floating label that looks like a placeholder */}
                    {formDetails.email.length === 0 && (
                      <label
                        htmlFor="email"
                        className="
                        text-xl text-n-900
                        absolute left-0 top-[12px] text-n-950
                        pointer-events-none
                      "
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                    )}

                    {errors.email && (
                      <p className="mt-1 text-base font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="w-full lg:basis-[40%] relative">
                    <input
                      id="contactNumber"
                      type="tel"
                      placeholder=" "
                      aria-label="Mobile Number"
                      value={formDetails.contactNumber}
                      onChange={(e) =>
                        updateFormField("contactNumber", e.target.value)
                      }
                      className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                    />

                    {/* Floating label that looks like a placeholder */}
                    {formDetails.contactNumber.length === 0 && (
                      <label
                        htmlFor="contactNumber"
                        className="
                        text-xl text-n-900
                        absolute left-0 top-[12px] text-n-950
                        pointer-events-none
                      "
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                    )}

                    {errors.contactNumber && (
                      <p className="mt-1 text-base font-medium text-red-500">
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Institution (60) + City (40) */}
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 w-full">
                  {/* Institution Name */}
                  <div className="w-full lg:basis-[60%] relative">
                    <input
                      id="institution"
                      type="text"
                      placeholder=" "
                      aria-label="Institution Name"
                      value={formDetails.institution}
                      onChange={(e) =>
                        updateFormField("institution", e.target.value)
                      }
                      className="w-full text-xl text-n-900 bg-transparent border-b border-n-950 focus:outline-none py-3 placeholder-n-950"
                    />

                    {/* Floating label that looks like a placeholder */}
                    {formDetails.institution.length === 0 && (
                      <label
                        htmlFor="institution"
                        className="
                        text-xl text-n-900
                        absolute left-0 top-[12px] text-n-950
                        pointer-events-none
                      "
                      >
                        Institution Name <span className="text-red-500">*</span>
                      </label>
                    )}

                    {errors.institution && (
                      <p className="mt-1 text-base font-medium text-red-500">
                        {errors.institution}
                      </p>
                    )}
                  </div>

                  {/* City Input */}
                  <div className="w-full lg:basis-[40%]">
                    <StyledSelect
                      id="city"
                      label="Select City"
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
                    <StyledSelect
                      id="location"
                      label="Location/Center"
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
                    <StyledSelect
                      id="slot"
                      label="Select Slot"
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
                    disabled={isSubmitting || !hasAllRequiredFields()}
                    onClick={handleSubmit}
                    className={`btn-cta px-10 w-full flex items-center justify-between overflow-hidden lg:w-3/5 xl:w-2/5 ${
                      !hasAllRequiredFields()
                        ? "opacity-50 cursor-not-allowed hover:rotate-none"
                        : ""
                    }`}
                  >
                    <span className="text-xl font-bold leading-none">
                      {isSubmitting ? "Submitting..." : "Confirm My Seat"}
                    </span>
                    <img
                      src="/images/right-arrow.svg"
                      alt="Arrow"
                      className={`w-8 h-auto ${isSubmitting ? "btn-arrow-slide-out" : ""}`}
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
      </div>

      {/* OTP Popup */}
      <OtpPopup
        showPopup={showPopup}
        closePopup={closePopup}
        email={formDetails.email}
        setError={setError}
        onVerified={() => setEmailVerified(true)}
      />
    </section>
  );
};
