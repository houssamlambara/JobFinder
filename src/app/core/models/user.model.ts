export interface User {
  id: number;
  email: string;
  password?: string; // Optional because we might not store it in session
  firstName: string;
  lastName: string;
}
