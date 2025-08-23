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
