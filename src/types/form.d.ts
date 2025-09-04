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

export type SuccessRegistrationResponseData = {
  registration_id: string;
  full_name: string;
  email: string;
  appointment_time: string;
  city: string;
  location: string;
  confirmation_number: string;
  start_time: string;
  end_time: string;
  discount_coupon: string;
  referral_coupon: string;
};

// Data Type of the Form
export type FormDetailsData = {
  fullName: string;
  dob: string;
  email: string;
  contactNumber: string;
  institution: string;
};
