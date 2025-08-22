// TYPES //
import type { ApiResponseData } from "../../types/app";
import type {
  AppointmentsResponseData,
  CatalogResponseData,
  CityCatalogData,
  CityDropdownData,
  LocationDropdownData,
} from "../../types/dropdown";

// CONSTANTS //
import { CONSTANTS } from "../../lib/constants";

/** Fetch all Cities  */
export async function getAllCitiesRequest(): Promise<
  ApiResponseData<CityDropdownData>
> {
  // API call to fetch all the cities
  const res = await fetch(`${CONSTANTS.API_URL}cities/`, {
    method: "GET",
    cache: "no-store",
  });

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<CityDropdownData>;
}

/** Fetch all Locatons based on city  */
export async function getAllLocationsRequest(
  cityId: string
): Promise<ApiResponseData<LocationDropdownData>> {
  // API call to fetch all the location
  const res = await fetch(`${CONSTANTS.API_URL}locations?city_id=${cityId}`, {
    method: "GET",
    cache: "no-store",
  });

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<LocationDropdownData>;
}

/** Fetch all slot dates based on location  */
export async function getAllSlotDateRequest(
  cityId: string,
  locationId: string
): Promise<ApiResponseData<AppointmentsResponseData>> {
  // API call to fetch all the slot date
  const res = await fetch(
    `${CONSTANTS.API_URL}appointments?cityId=${cityId}&locationId=${locationId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<AppointmentsResponseData>;
}

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

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<CatalogResponseData>;
};
