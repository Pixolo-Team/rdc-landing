// src/services/cityService.ts

// CONSTANTS //
import { CONSTANTS } from "../lib/constants";

// TODO: Remove later from here and add in types
export type DropdownOptionData = { id: number; name: string };
export type ApiResponseData<T> = { items: T };

/** API Call to fetch all cities */
export const getAllCitiesRequest = async (): Promise<
  ApiResponseData<DropdownOptionData[]>
> => {
  const res = await fetch(`${CONSTANTS.API_URL}/meta/cities`, {
    method: "GET",
    headers: {
      // TODO: Add token
      Authorization: "",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as ApiResponseData<DropdownOptionData[]>;
};
