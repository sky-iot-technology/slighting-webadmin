export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface SignupCredentials {
    username: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }
  
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
  }
  
  export interface User {
    id: string;
    username: string;
    email?: string;
    name?: string;
    role: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ProfileUpdateData {
    name?: string;
    email?: string;
  }