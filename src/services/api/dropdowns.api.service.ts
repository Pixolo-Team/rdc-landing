
// TYPES //
import type { ApiResponseData } from "../../types/app";
import type { DropdownOptionData } from "../../types/dropdown";

// CONSTANTS //
import { CONSTANTS } from "../../lib/constants";

/** Fetch all Cities  */
export async function getAllCitiesRequest(): Promise<
  ApiResponseData<DropdownOptionData[]>
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

  return (await res.json()) as ApiResponseData<DropdownOptionData[]>;
}

/** Fetch all Locatons based on city  */
export async function getAllLocationsRequest(cityId: string): Promise<
  ApiResponseData<DropdownOptionData[]>
> {
  // API call to fetch all the location
  const res = await fetch(
    `${CONSTANTS.API_URL}locations/locations?city_id=${cityId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<DropdownOptionData[]>;
}


/** Fetch all slot dates based on location  */
export async function getAllSlotDateRequest(cityId: string, locationId: string): Promise<
  ApiResponseData<DropdownOptionData[]>
> {
  // API call to fetch all the slot date
  const res = await fetch(
    `${CONSTANTS.API_URL}appointments/dates?cityId=${cityId}&locationId=${locationId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<DropdownOptionData[]>;
}

/** Fetch all slot time based on location  */
export async function getAllSlotTimeRequest(cityId: string, locationId: string, date: string): Promise<
  ApiResponseData<DropdownOptionData[]>
> {
  // API call to fetch all the slot time
  const res = await fetch(
    `${CONSTANTS.API_URL}appointments/available?city_id=${cityId}&location_id=${locationId}&date=22-08-2025`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  // if (!res.ok) {
  //   // Let the caller handle errors
  //   throw Error(`HTTP ${res.status} ${res.statusText}`);
  // }

  return (await res.json()) as ApiResponseData<DropdownOptionData[]>;
}