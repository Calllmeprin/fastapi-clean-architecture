export interface User {
  id: number;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}