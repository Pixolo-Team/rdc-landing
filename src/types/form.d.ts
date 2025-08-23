export type RegisterRequestPayload = {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  institution: string;
  city_id: number;
  location_id: number;
  appointment_id: number;
};

export type SuccessRegistrationResponseData = {};

// Data Type of the Form
export type FormDetailsData = {
  fullName: string;
  dob: string;
  email: string;
  contactNumber: string;
  institution: string;
};
