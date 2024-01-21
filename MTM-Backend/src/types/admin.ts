export interface AdminInputNoID {
  name: string;
  email: string;
  role: string;
}

export interface AdminType extends AdminInputNoID {
  id: number;
}
