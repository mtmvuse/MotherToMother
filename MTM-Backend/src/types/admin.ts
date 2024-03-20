export interface AdminInputNoID {
  name: string;
  email: string;
  role: string;
}

export interface AdminType extends AdminInputNoID {
  id: number;
}
export interface Admin {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
