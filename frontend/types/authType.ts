export interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "staff";
  password: string;
  created_at: string;
  updated_at: string;
}
