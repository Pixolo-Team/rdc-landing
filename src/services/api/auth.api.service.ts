// TYPES //
import { CONSTANTS } from "../../constants/app.constant";

// TYPES //
import type { ApiResponseData } from "../../types/app";

// CONSTANTS //

/** Request for an otp to validate the email */
export const otpRequest = async (
  email: string,
): Promise<ApiResponseData<boolean>> => {
  // API Call
  const res = await fetch(`${CONSTANTS.API_URL}students/request-otp`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  // Return the Data
  const data = (await res.json()) as ApiResponseData<boolean>;
  return data;
};

/** Request to verif OTP */
export const verifyOtpRequest = async (
  email: string,
  otp: string,
): Promise<ApiResponseData<string>> => {
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

  // Return the Data
  return data;
};
