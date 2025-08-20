// Data type for City
export type CityDropdownData = {
  items: DropdownOptionData[];
};

// Data type for location
export type LocationDropdownData = {
  city_id: string;
  items: DropdownOptionData[];
};

// Data type for appointment date
export type AppointmentDateDropdownData = {
  items: {
    date: string;
    seats_remaining: number;
  };
};

// Data type for appointment time
export type AppointmentTimeDropdownData = {
  items: {
    id: string;
    date: string;
    starts_at: string;
    ends_at: string;
    capacity: number;
    seats_remaining: number;
  };
};

// Common type for similar dropdown array
export type DropdownOptionData = { id: number; name: string };
