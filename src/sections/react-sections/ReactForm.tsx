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
      // Set cities state
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
        <div className="container mx-auto flex justify-center px-6 py-22">
          {/* Registrations are closed. */}
          <div className="w-full max-w-2xl bg-n-50 backdrop-blur-md p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Registration Closed
            </h2>
            <p className="text-center text-gray-700">
              We are no longer accepting registrations at this time. Thank you
              for your interest!
            </p>
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
