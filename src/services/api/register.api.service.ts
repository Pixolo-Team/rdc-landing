// CONSTANTS //
import { CONSTANTS } from "../../constants/app.constant";

// TYPES //
import type { ApiResponseData } from "../../types/app.d";

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
