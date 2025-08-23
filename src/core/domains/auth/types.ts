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
  
  export interface User{
    id: string;
    first_name: string;
    last_name: string;
    status: string;
    role: string;
    credentials: {
        username: string
    },
    email: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
}
  
  export interface ProfileUpdateData {
    name?: string;
    email?: string;
  }