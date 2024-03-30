export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  userType: string;
};

export type EditUserType = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  city: string | undefined;
  zip: number | undefined;
};
