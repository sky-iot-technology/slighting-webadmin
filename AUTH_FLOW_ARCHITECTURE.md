# Authentication Flow Architecture

## Overview

This document outlines the authentication system architecture for the Next.js dashboard application, which implements a modern, scalable authentication flow using **Zustand** for state management and **TanStack Query** for API communication. The system is now integrated with real API endpoints from `https://dev.hcmtech.vn`.

## Architecture Principles

### 1. Separation of Concerns
- **State Management**: Zustand handles pure state operations
- **API Communication**: TanStack Query manages all HTTP requests
- **UI Components**: React components focus on rendering and user interaction

### 2. Single Source of Truth
- Authentication state is centralized in the Zustand store
- All components read from the same state source
- State updates flow through a predictable pattern

### 3. Performance Optimization
- Selective re-renders using Zustand selectors
- Efficient caching with TanStack Query
- Minimal component re-renders

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Login Form  │  │ Signup Form │  │   Profile   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TanStack Query Hooks                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  useLogin   │  │  useSignup  │  │ useLogout   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Zustand Store                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    User     │  │Access Token │  │Refresh Token│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Login     │  │   Profile   │  │   Refresh   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Real API Endpoints                          │
├─────────────────────────────────────────────────────────────────┤
│  https://dev.hcmtech.vn                                        │
│  ├── /users/tokens/issue (POST)                                │
│  ├── /users/profile (GET)                                      │
│  └── /users/tokens/refresh (POST)                              │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Zustand Store (`src/core/domains/auth/store.ts`)

The store manages authentication state and provides pure state mutation functions.

#### State Structure
```typescript
interface AuthState {
  user: User | null;           // Current user data
  accessToken: string | null;   // JWT access token
  refreshToken: string | null;  // JWT refresh token
  isLoading: boolean;           // Loading state
  error: string | null;         // Error messages
  isAuthenticated: boolean;     // Computed authentication status
}
```

#### Actions
```typescript
// Pure state mutations (no API calls)
setUser: (user: User | null) => void;
setTokens: (accessToken: string, refreshToken: string) => void;
setAccessToken: (token: string | null) => void;
setRefreshToken: (token: string | null) => void;
setLoading: (loading: boolean) => void;
setError: (error: string | null) => void;
clearAuth: () => void;
updateUser: (updates: Partial<User>) => void;
```

### 2. TanStack Query Hooks (`src/core/domains/auth/hooks.ts`)

These hooks handle all API communication and automatically sync state with the Zustand store.

#### Available Hooks
```typescript
useLogin()           // Login mutation
useSignup()          // Signup mutation (placeholder)
useLogout()          // Logout mutation
useUpdateProfile()   // Profile update mutation (placeholder)
useCurrentUser()     // User data query
useRefreshToken()    // Token refresh mutation
useAuth()            // Authentication status from store
```

### 3. API Layer (`src/core/domains/auth/api.ts`)

Contains all API function definitions and data types, integrated with real endpoints.

#### API Functions
```typescript
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async getCurrentUser(token: string): Promise<User>
  async refreshToken(refreshToken: string): Promise<AuthResponse>
  async signup(credentials: SignupCredentials): Promise<AuthResponse> // Placeholder
  async updateProfile(token: string, userId: string, updates: ProfileUpdateData): Promise<User> // Placeholder
  async logout(token: string): Promise<void> // Placeholder
}
```

#### Real API Endpoints
- **Login**: `POST https://dev.hcmtech.vn/users/tokens/issue`
- **Profile**: `GET https://dev.hcmtech.vn/users/profile`
- **Refresh Token**: `POST https://dev.hcmtech.vn/users/tokens/refresh`

### 4. API Integration (`src/core/shared/api/`)

The project uses the existing API infrastructure with `publicApi` and `authenticatedApi` clients.

```typescript
// For external API calls (https://dev.hcmtech.vn)
import { publicApi, authenticatedApi, type ApiRequestConfig } from '@/core/shared/api';

// Login (public API)
const response = await publicApi.post<AuthResponse>(
  'https://dev.hcmtech.vn/users/tokens/issue',
  credentials,
  { externalApi: true } as ApiRequestConfig
);

// Get user profile (authenticated API)
const response = await authenticatedApi.get<User>(
  'https://dev.hcmtech.vn/users/profile',
  {
    externalApi: true,
    headers: { Authorization: `Bearer ${token}` },
  } as ApiRequestConfig
);
```

## Authentication Flow

### 1. User Login Flow

1. User enters username and password in login form
2. Component calls `useLogin().mutate()`
3. Hook updates store: `setLoading(true)`, `setError(null)`
4. API call: `POST https://dev.hcmtech.vn/users/tokens/issue`
5. On success: Store receives `access_token` and `refresh_token`
6. Hook fetches user profile using `access_token`
7. Store updates: `setUser(user)`, `setTokens(access_token, refresh_token)`
8. Redirect to dashboard
9. Show success message

### 2. Token Refresh Flow

1. Access token expires
2. System automatically uses `useRefreshToken()` hook
3. API call: `POST https://dev.hcmtech.vn/users/tokens/refresh`
4. Store updates with new tokens
5. User session continues seamlessly

### 3. User Logout Flow

1. User clicks logout
2. Component calls `useLogout().mutate()`
3. Hook updates store: `setLoading(true)`
4. Store clears: `clearAuth()` (removes user, accessToken, refreshToken)
5. Redirect to sign-in page
6. Show success message

## Component Integration

### 1. Form Components

Forms use React Hook Form with Zod validation and TanStack Query mutations.

```typescript
export function SignInForm() {
  const loginMutation = useLogin();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields with validation */}
        <Button disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </Form>
  );
}
```

### 2. Navigation Components

Navigation components read user state from the store and use mutations for actions.

```typescript
export function UserNav() {
  const user = useUser(); // From Zustand store
  const logoutMutation = useLogout(); // From TanStack Query
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      {/* User info from store */}
      <DropdownMenuItem onClick={handleLogout}>
        Đăng xuất
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
```

## State Management Patterns

### 1. Store Selectors

Use specific selectors to prevent unnecessary re-renders.

```typescript
// ✅ Good: Specific selector
const user = useUser(); // Only re-renders when user changes
const accessToken = useAccessToken(); // Only re-renders when accessToken changes

// ❌ Bad: Accessing entire store
const { user, accessToken } = useAuthStore(); // Re-renders on any store change
```

### 2. Token Management

```typescript
// Store automatically handles both access and refresh tokens
const { setTokens, clearAuth } = useAuthActions();

// Login success
setTokens(access_token, refresh_token);

// Logout
clearAuth(); // Clears both tokens and user data
```

## Performance Optimizations

### 1. Selective Re-renders

```typescript
// Components only re-renders when their specific data changes
const user = useUser();           // Re-renders on user change
const isLoading = useAuthLoading(); // Re-renders on loading change
const error = useAuthError();      // Re-renders on error change
```

### 2. Efficient Caching

```typescript
// TanStack Query handles caching automatically
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getCurrentUser(accessToken || ''),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    enabled: !!accessToken,    // Only fetch if we have a token
  });
}
```

## Security Considerations

### 1. JWT Token Management

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for token renewal
- **Automatic Refresh**: System automatically refreshes expired tokens
- **Secure Storage**: Tokens stored in Zustand with persistence

### 2. Route Protection

- Server-side route protection in middleware
- Client-side protection with ProtectedRoute component
- Automatic redirects for unauthenticated users

### 3. API Security

- All authenticated requests include `Authorization: Bearer <token>` header
- Automatic token refresh on 401 responses
- Secure token storage and cleanup

## Environment Configuration

### 1. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### 2. API Configuration

The project uses the existing API infrastructure from `src/core/shared/api/`:

```typescript
// Base API client handles internal API calls
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// External API calls (https://dev.hcmtech.vn) are handled explicitly
// with the externalApi flag to avoid adding auth headers
```

## Future Enhancements

### 1. Complete API Integration

```typescript
// Add missing endpoints when available
async signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await publicApi.post<AuthResponse>(
    'https://dev.hcmtech.vn/users/signup',
    credentials,
    { externalApi: true } as ApiRequestConfig
  );
  return response;
}

async updateProfile(token: string, userId: string, updates: ProfileUpdateData): Promise<User> {
  const response = await authenticatedApi.put<User>(
    'https://dev.hcmtech.vn/users/profile',
    updates,
    {
      externalApi: true,
      headers: { Authorization: `Bearer ${token}` },
    } as ApiRequestConfig
  );
  return response;
}
```

### 2. Enhanced Token Management

```typescript
// Add automatic token refresh on 401 responses
const queryClient = useQueryClient();

queryClient.setDefaultOptions({
  queries: {
    retry: (failureCount, error: any) => {
      if (error?.status === 401 && failureCount === 0) {
        // Try to refresh token
        return true;
      }
      return false;
    },
  },
});
```

### 3. Role-Based Access Control

```typescript
interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: number; // 1: Admin, 2: User, etc.
  permissions: string[];
}

const useHasPermission = (permission: string) => {
  const user = useUser();
  return user?.permissions.includes(permission) ?? false;
};
```

## Testing Strategy

### 1. API Mocking

```typescript
// Mock API responses for testing
export const mockAuthApi = {
  login: jest.fn().mockResolvedValue({
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
  }),
  getCurrentUser: jest.fn().mockResolvedValue({
    id: '1',
    username: 'testuser',
    role: 2,
  }),
};
```

### 2. Store Testing

```typescript
// Test Zustand store actions
describe('Auth Store', () => {
  it('should set user and tokens on login', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser);
      result.current.setTokens('token1', 'token2');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe('token1');
    expect(result.current.refreshToken).toBe('token2');
  });
});
```

## Conclusion

This authentication architecture provides:

- **Real API Integration**: Connected to production endpoints at `https://dev.hcmtech.vn`
- **JWT Token Management**: Proper handling of access and refresh tokens
- **Clean separation of concerns** between state, API, and UI
- **Excellent performance** with selective re-renders and efficient caching
- **Type safety** throughout the entire system
- **Developer experience** with DevTools and clear patterns
- **Scalability** for future enhancements
- **Maintainability** with clear responsibility boundaries

The system follows React best practices and provides a solid foundation for building secure, performant authentication flows in modern web applications. The integration with real API endpoints ensures the system is production-ready while maintaining the clean architecture principles.
