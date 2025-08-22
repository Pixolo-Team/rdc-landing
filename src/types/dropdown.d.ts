// Data type for City
export type CityDropdownData = {
  items: DropdownOptionData[];
};

// Data type for location
export type LocationDropdownData = {
  city_id: string;
  items: DropdownOptionData[];
};

// Data type for appointment time
export type AppointmentSlotDropdownData = {
  seats_remaining: string;
  date: string; // ISO datetime
};

export interface AppointmentsResponseData {
  items: AppointmentSlotDropdownData[];
}

// Common type for similar dropdown array
export type DropdownOptionData = { id: number; name: string };

// src/types/dropdown.ts
export interface AppointmentSlotData {
  id: string;
  name: string;
}

export interface LocationCatalogData {
  id: string;
  name: string;
  appointments: AppointmentSlotData[];
}

export interface CityCatalogData {
  id: string;
  name: string;
  locations: LocationCatalogData[];
}

export interface CatalogResponseData {
  items: CityCatalogData[];
}
