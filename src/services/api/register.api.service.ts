// CONSTANTS //
import { CONSTANTS } from "../../constants/app.constant";
import { supabase } from "../../lib/supabase";

// TYPES //
import type { ApiResponseData } from "../../types/app.d";
import type {
  RegisterRequestPayload,
  SuccessRegistrationResponseData,
} from "../../types/form";

// CONSTANTS //

/** Register student with verified email */
export async function registerRequest(payload: {
  full_name: string;
  dob: string;
  email: string;
  contact_number: string;
  institution: string;
  city_id: string;
  location_id: string;
  appointment_id: string;
}): Promise<ApiResponseData<any>> {
  // Get token (the one we got after Verify OTP)
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error(
      "No verification token found. Please verify your email first.",
    );
  }

  // Make the API Call
  const res = await fetch(`${CONSTANTS.API_URL}registrations`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // Return Data
  return (await res.json()) as ApiResponseData<any>;
}

export async function submitRegistration(
  payload: RegisterRequestPayload,
): Promise<SuccessRegistrationResponseData> {
  const { data, error } = await supabase.rpc("register_student", {
    p_full_name: payload.fullName,
    p_dob: payload.dob,
    p_email: payload.email,
    p_phone: payload.phone,
    p_institution: payload.institution,
    p_city_id: payload.city_id,
    p_location_id: payload.location_id,
    p_appointment_id: payload.appointment_id,
  });

  if (error) {
    throw error;
  }

  return data as SuccessRegistrationResponseData;
}

/** Fetch registration success details by id (no auth required) */
export async function getRegistrationSuccessById(
  registrationId: string,
): Promise<ApiResponseData<SuccessRegistrationResponseData>> {
  const res = await fetch(
    `${CONSTANTS.API_URL}registrations/by-id-success?registration_id=${encodeURIComponent(
      registrationId,
    )}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return (await res.json()) as ApiResponseData<SuccessRegistrationResponseData>;
}
