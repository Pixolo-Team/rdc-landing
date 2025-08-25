// CONSTANTS //
import { CONSTANTS } from "../../constants/app.constant";

// TYPES //
import type { ApiResponseData } from "../../types/app";
import type { CatalogResponseData } from "../../types/dropdown";

/**
 * Get appointments catalog (cities, locations, slots)
 */
export const getAppointmentsCatalogRequest = async (): Promise<
  ApiResponseData<CatalogResponseData>
> => {
  // API call to fetch all the slot date
  const res = await fetch(`${CONSTANTS.API_URL}appointments/catalog`, {
    method: "GET",
    cache: "no-store",
  });

  //Return the Data
  return (await res.json()) as ApiResponseData<CatalogResponseData>;
};
