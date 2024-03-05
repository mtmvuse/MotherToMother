export interface UserType {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  role: string;
  household: string;
  userType: string;
  organizationId: number | undefined;
}

export interface Organization {
  id: number;
  name: string;
  type: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;

  phone: string;
  address: string;
  zip: string;
  city: string;
  affiliation?: string;
}
