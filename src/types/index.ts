
export interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    name?: string;
  };
}
