// TYPES //
import type {
  ApiResponseData,
  AuthenticationResponseData,
} from "../../types/app";

// CONSTANTS //
import { CONSTANTS } from "../../lib/constants";

/** Request for an otp to validate the email */
export async function otpRequest(
  email: string
): Promise<ApiResponseData<boolean>> {
  // API Call
  const res = await fetch(`${CONSTANTS.API_URL}students/request-otp`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<boolean>;
}

/** Request to verif otp */
export async function verifyOtpRequest(
  email: string,
  otp: string
): Promise<ApiResponseData<string>> {
  // API Call
  const res = await fetch(`${CONSTANTS.API_URL}students/verify-otp`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = (await res.json()) as ApiResponseData<string>;

  // If API call is successful, save token in localStorage
  if (res.ok && data.data) {
    localStorage.setItem("authToken", data.data);
  }

  return data;
}

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
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error(
      "No verification token found. Please verify your email first."
    );
  }

  const res = await fetch(`${CONSTANTS.API_URL}registrations`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return (await res.json()) as ApiResponseData<any>;
}
