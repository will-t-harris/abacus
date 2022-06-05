export interface User {
  email: string;
  id: number;
  accessToken?: string | null;
}

export interface PlaidItem {
  itemId: string;
  institutionName: string;
  updatedAt: Date;
}

export interface RegisterFormValues {
  email: string;
  password: string;
}
