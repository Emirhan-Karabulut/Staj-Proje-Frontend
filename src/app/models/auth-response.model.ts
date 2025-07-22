export interface AuthResponse {
  message: string;
}

export interface AuthErrorResponse {
  message: string;
  errors?: string[];
}
