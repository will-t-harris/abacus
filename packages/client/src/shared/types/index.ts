export interface User {
  email: string;
  id: number;
  accessToken?: string | null;
}

export interface RegisterFormValues {
  email: string;
  password: string;
}
