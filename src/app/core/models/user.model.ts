export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional because we might not store it in session
}


