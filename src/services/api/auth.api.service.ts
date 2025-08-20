// TYPES //
import type { ApiResponseData, AuthenticationResponseData } from "../../types/app";

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
    headers:{
        "Content-Type": "application/json",
    },
    body: JSON.stringify({email})
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
): Promise<ApiResponseData<AuthenticationResponseData>> {
  // API Call
  const res = await fetch(`${CONSTANTS.API_URL}students/verify-otp`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data =
    (await res.json()) as ApiResponseData<AuthenticationResponseData>;

  // If API call is successful, save token in localStorage
  if (res.ok && data.data?.token) {
    localStorage.setItem("authToken", data.data.token);
  }

  return data;
}