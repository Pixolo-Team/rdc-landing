// src/scripts/form.ts
// API SERVICES //
import {
  getAllLocationsRequest,
  getAllSlotDateRequest,
  getAllSlotTimeRequest,
} from "../services/api/dropdowns.api.service";
import { registerRequest } from "../services/api/register.api.service";

// OTHERS //
import { formatIsoToDDMMYYYY } from "../lib/utils";

type Option = { id: string | number; name: string };

/** All DOM elements required for registration form */
type FormElements = {
  citySelect: HTMLSelectElement;
  locationSelect: HTMLSelectElement;
  slotDateSelect: HTMLSelectElement;
  slotTimeSelect: HTMLSelectElement;
  registerForm: HTMLFormElement;
};

/** Populate a select element with options */
function setSelectOptions(
  select: HTMLSelectElement,
  options: Option[],
  placeholder = "Select an option"
) {
  // Reset all current options and add a placeholder as the first option
  select.innerHTML = `<option value="">${placeholder}</option>`;

  // Loop through provided options and create <option> elements
  for (const option of options) {
    const opt = document.createElement("option");

    // Use "id" for the value (ensure it’s always a string)
    opt.value = String(option.id);
    
    // Use "name" for the display text
    opt.textContent = option.name;
    
    // Append the new option to the select
    select.appendChild(opt);
  }
}

/** Disable multiple <select> elements */
function disableSelects(...selects: HTMLSelectElement[]) {
  selects.forEach((s) => (s.disabled = true));
}

/** Enable multiple <select> elements */
function enableSelects(...selects: HTMLSelectElement[]) {
  selects.forEach((s) => (s.disabled = false));
}

/** Reset dependent selects after city change */
function resetAfterCity(elements: FormElements) {
  setSelectOptions(elements.locationSelect, [], "Select location");
  setSelectOptions(elements.locationSelect, [], "Select Slot Date");
  setSelectOptions(elements.locationSelect, [], "Select Slot Time");
  disableSelects(
    elements.locationSelect,
    elements.slotDateSelect,
    elements.slotTimeSelect
  );
}

/** Reset dependent selects after location change */
function resetAfterLocation(elements: FormElements) {
  setSelectOptions(elements.locationSelect, [], "Select Slot Date");
  setSelectOptions(elements.locationSelect, [], "Select Slot Time");
  disableSelects(elements.slotDateSelect, elements.slotTimeSelect);
}

/** Reset dependent selects after date change */
function resetAfterDate(elements: FormElements) {
  setSelectOptions(elements.slotTimeSelect, [], "Select Slot Time");
  disableSelects(elements.slotTimeSelect);
}

/** Initialize cascading selects + submit handler. */
export function getFormElements(): FormElements | null {
  // Query all the required form elements by ID
  const citySelect = document.getElementById(
    "city"
  ) as HTMLSelectElement | null;
  const locationSelect = document.getElementById(
    "location"
  ) as HTMLSelectElement | null;
  const slotDateSelect = document.getElementById(
    "slotDate"
  ) as HTMLSelectElement | null;
  const slotTimeSelect = document.getElementById(
    "slotTime"
  ) as HTMLSelectElement | null; // same here
  const registerForm = document.getElementById(
    "registerForm"
  ) as HTMLFormElement | null;

  // Collect missing elements for error logging
  const missing = [
    ["city", citySelect],
    ["location", locationSelect],
    ["slotDate", slotDateSelect],
    ["slotTime", slotTimeSelect],
    ["registerForm", registerForm],
  ]
    // Keep only the ones that are null
    .filter(([name, element]) => !element)
    // Extract their names
    .map(([name]) => name);

  // If anything is missing, log an error and abort
  if (missing.length) {
    console.error(`[form] Missing elements: ${missing.join(", ")}`);
    return null;
  }

  // Otherwise, return all the elements as a typed object
  return {
    citySelect: citySelect!,
    locationSelect: locationSelect!,
    slotDateSelect: slotDateSelect!,
    slotTimeSelect: slotTimeSelect!,
    registerForm: registerForm!,
  };
}

/** Load and Populate location options for the selected city */
async function loadLocationOptions(elements: FormElements) {
  // Get selected city id from the City select
  const cityId = elements.citySelect.value;
  // Reset dependent selects (location/date/time) to a clean state
  resetAfterCity(elements);

  // If no city selected, stop here
  if (!cityId) return;

  // Show loading state in Location select
  setSelectOptions(elements.locationSelect, [], "Loading locations...");
  try {
    // Make API Call for the selected city
    const res = await getAllLocationsRequest(cityId);
    // Extract items safely (default to empty array if missing)
    const items = res?.data?.items ?? [];

    // Populate Location select with the fetched options
    setSelectOptions(elements.locationSelect, items, "Select Location/Center");
  } catch (err) {
    // Log error and show failure message in Location select
    console.error("[locations] fetch failed:", err);
    setSelectOptions(elements.locationSelect, [], "Failed to load locations");
  } finally {
    // Ensure Location select is always enabled
    enableSelects(elements.locationSelect);
  }
}

/** Load and populate slot date options for the selected location. */
async function loadSlotDateOptions(elements: FormElements) {
  // Get selected city and loaction ids
  const cityId = elements.citySelect.value;
  const locationId = elements.locationSelect.value;

  // Reset dependent selects (slot date and time)
  resetAfterLocation(elements);

  // Exit if either city or location is missing
  if (!cityId || !locationId) return;

  // Show loading state in Slot Date select
  setSelectOptions(elements.slotDateSelect, [], "Loading slot dates...");
  try {
    // Make API Call for slot dates
    const res = await getAllSlotDateRequest(cityId, locationId);
    // Extract dates safely (default to empty array if missing)
    const dates = res?.data?.items ?? [];

    // Populate Slot Date select with options
    setSelectOptions(elements.slotDateSelect, dates, "Select Slot Date");
  } catch (err) {
    // Log error and show failure message
    console.error("[slot-dates] fetch failed:", err);
    setSelectOptions(elements.slotDateSelect, [], "Failed to load slot dates");
  } finally {
    // Ensure Slot Date select is always enabled
    enableSelects(elements.slotDateSelect);
  }
}

/** Load and populate slot time options for the selected date. */
async function loadSlotTimeOptions(elements: FormElements) {
  // Get selected city, location, and date values
  const cityId = elements.citySelect.value;
  const locationId = elements.locationSelect.value;
  const isoDate = elements.slotDateSelect.value;

  // Reset Slot Time select (clears old options + disables)
  resetAfterDate(elements);

  // Exit if any required input is missing
  if (!cityId || !locationId || !isoDate) return;

  // Show loading state in Slot Time select
  setSelectOptions(elements.slotTimeSelect, [], "Loading slot times...");
  try {
    // Make an API Call for slot time
    const res = await getAllSlotTimeRequest(cityId, locationId, isoDate);

    // Extract items safely (default to empty array if missing)
    const times = res?.data?.items ?? [];

    // Populate Slot Time select
    setSelectOptions(elements.slotTimeSelect, times, "Select Slot Time");
  } catch (err) {
    // Log error
    console.error("[slot-times] fetch failed:", err);
    setSelectOptions(elements.slotTimeSelect, [], "Failed to load slot times");
  } finally {
    // Ensure slot time is enabled
    enableSelects(elements.slotTimeSelect);
  }
}

// ---------------------- SUBMIT ----------------------

/** Build the registration payload object from form data. */
function buildRegistrationPayload(form: HTMLFormElement) {
  // Create a FormData instance from the given form
  const formData = new FormData(form);

  // Return a normalized object ready for API submission
  return {
    fullName: (formData.get("fullName") as string) ?? "",
    dob: (formData.get("dob") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
    institution: (formData.get("institution") as string) ?? "",
    city_id: Number(formData.get("city")) || 0,
    location_id: Number(formData.get("location")) || 0,
    appointment_id: Number(formData.get("slotTime")) || 0,
  };
}

/** Validate the registration payload before submitting. */
function validateRegistrationPayload(
  payload: ReturnType<typeof buildRegistrationPayload>
): string | null {
  // Check for all the fields are filled or empty
  if (!payload.fullName) return "Full name is required.";
  if (!payload.email) return "Email is required.";
  if (!payload.city_id) return "City is required.";
  if (!payload.location_id) return "Location is required.";
  if (!payload.appointment_id) return "Slot time is required.";
  return null;
}

/** Submit the registration form payload to the backend. */
async function submitRegistration(elements: FormElements) {
  // Step 1: Extract form values into a payload object
  const payload = buildRegistrationPayload(elements.registerForm);

  // Step 2: Validate the payload before sending
  const error = validateRegistrationPayload(payload);
  if (error) {
    alert(error);
    return;
  }
  try {
    // Make API Call to submit the payload
    const res = await registerRequest(payload);

    // Log error
    console.log("[register] response:", res);
    alert("Registration successful!");
  } catch (err) {

    // Log error
    console.error("[register] submit failed:", err);
    alert("Something went wrong. Please try again.");
  }
}

/** Attach all event listeners for cascading selects and form submit. */
function attachEventHandlers(elements: FormElements) {
  // Initially disable dependent selects
  disableSelects(
    elements.locationSelect,
    elements.slotDateSelect,
    elements.slotTimeSelect
  );

  // City - Load Locations
  elements.citySelect.addEventListener("change", () =>
    loadLocationOptions(elements)
  );

  // Locations - Load Slot Dates
  elements.locationSelect.addEventListener("change", () =>
    loadSlotDateOptions(elements)
  );

  // Slot Dates - Load Slot Time
  elements.slotDateSelect.addEventListener("change", () =>
    loadSlotTimeOptions(elements)
  );

  // Form Submit 
  elements.registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitRegistration(elements);
  });
}

// ---------------------- ENTRY ----------------------

/** Initialize the registration form with cascading selects and submit handler. */
export function initRegistrationForm() {
  const elements = getFormElements();

  // If any element is missing, exit early
  if (!elements) return;

  // Attach event listeners
  attachEventHandlers(elements);
}

// Auto-init on DOM ready
document.addEventListener("DOMContentLoaded", initRegistrationForm);
