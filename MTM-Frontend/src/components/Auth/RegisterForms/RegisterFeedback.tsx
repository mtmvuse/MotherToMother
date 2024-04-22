export interface FeedbackType {
  name: string;
  email: string;
  password: string;
  userType: string;
  confirmPassword: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  affiliation: string;
}

export const feedback = {
  name: "Please enter your name in format: First Last",
  email: "Please enter email in format: yourname@example.com",
  password: "Please enter your password",
  userType: "Please select your account type",
  confirmPassword: "Please confirm your password",
  affiliation: "affiliation is required",
};

export interface PasswordRequirementsType {
  "(?=.*[A-Z])": string;
  "(?=.*[0-9])": string;
  "(?=.*[\\W_])": string;
  "(.{8,})": string;
}

export const passwordRequirements = {
  "(?=.*[A-Z])": "Must contain at least 1 uppercase letter",
  "(?=.*[0-9])": "Must contain at least 1 digit",
  "(?=.*[\\W_])": "Must contain at least 1 special character",
  "(.{8,})": "Must contain at least 8 characters",
};
