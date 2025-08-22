// server/api/api.service.ts

// TYPES //
import type { ApiResponseData } from "../../types/app.d";
import type { RegisterRequestPayload } from "../../types/form";

// CONSTANTS //
import { CONSTANTS } from "../../lib/constants";

/** Register API Request Sends form data to the backend to create a new registration */
// export async function registerRequest(
//   payload: RegisterRequestPayload
// ): Promise<ApiResponseData<any>> {
//   // Read token from localstorage
//   const token = localStorage.getItem("authToken");

//   const res = await fetch(`${CONSTANTS.API_URL}registrations`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   // Parse JSON response
//   return (await res.json()) as ApiResponseData<any>;
// }
