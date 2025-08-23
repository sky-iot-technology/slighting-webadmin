# Project Structure Documentation

This document outlines the current project structure following the **Domain-Driven Design (DDD)** architecture pattern.

## 🏗️ **Current Architecture Overview**

The project now follows a **layered architecture** with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages
├── ui/                     # Reusable UI components
│   ├── components/         # Shared components (layout, navigation, etc.)
│   │   ├── ui/            # Shadcn-ui components (buttons, inputs, tables, etc.)
│   │   ├── layout/        # Layout components (sidebar, header, etc.)
│   │   ├── providers/     # Context providers (theme, auth, etc.)
│   │   ├── kbar/          # Command+k interface components
│   │   ├── modal/         # Modal and dialog components
│   │   └── ...            # Other shared components
│   └── business/          # Business-specific UI components
├── core/                   # Core business logic and shared utilities
│   ├── domains/           # Business domains
│   │   ├── products/      # ✅ Complete products domain
│   │   ├── auth/          # 🔄 Placeholder (to be implemented)
│   │   ├── users/         # 🔄 Placeholder (to be implemented)
│   │   ├── sales/         # 🔄 Placeholder (to be implemented)
│   │   └── overview/      # 🔄 Placeholder (to be implemented)
│   └── shared/            # Shared utilities and services
│       ├── api/           # ✅ API client infrastructure
│       ├── query/         # ✅ TanStack Query configuration
│       ├── types/         # ✅ Shared TypeScript types
│       └── utils/         # 🔄 Placeholder (to be implemented)
├── features/               # Feature-specific components
│   ├── products/          # ✅ Product management features
│   ├── auth/              # ✅ Authentication features
│   ├── overview/          # ✅ Dashboard overview features
│   ├── kanban/            # ✅ Kanban board features
│   ├── profile/           # ✅ User profile features
│   └── styleguide/        # ✅ Component showcase
├── lib/                    # Utility libraries
└── types/                  # Global type definitions
```

## 🔧 **Core Structure Details**

### **`src/ui/` - UI Components**

The UI directory contains all reusable UI components:

- **`src/ui/components/`** - Shared components used across the application
  - **`ui/`** - Shadcn-ui components (buttons, inputs, tables, etc.)
  - **`layout/`** - Layout-related components (sidebar, header, navigation)
  - **`providers/`** - Context providers for state management
  - **`kbar/`** - Command+k interface components
  - **`modal/`** - Modal and dialog components
  - **`icons.tsx`** - Icon components
  - **`theme-selector.tsx`** - Theme switching component
  - **`search-input.tsx`** - Search input component

- **`src/ui/business/`** - Business-specific UI components (to be implemented)

### **`src/core/` - Core Business Logic**

The core directory contains all business logic, domain models, and shared utilities.

#### **`src/core/domains/` - Business Domains**

Each domain represents a business capability and contains:

- **`types.ts`** - Domain-specific TypeScript interfaces and types
- **`api.ts`** - API service layer for the domain
- **`hooks.ts`** - TanStack Query hooks for the domain
- **`index.ts`** - Public exports from the domain

**Current Domains:**

1. **Products Domain** ✅
   - Complete implementation with types, API, and hooks
   - Mock data integration with fallback to real API
   - Full CRUD operations support

2. **Auth Domain** 🔄 (Placeholder)
3. **Users Domain** 🔄 (Placeholder)
4. **Sales Domain** 🔄 (Placeholder)
5. **Overview Domain** 🔄 (Placeholder)

#### **`src/core/shared/` - Shared Utilities**

- **`src/core/shared/api/`** - API client infrastructure
  - **`base.ts`** - Base API client with interceptors and error handling
  - **`authenticated.ts`** - Authenticated API client with token management
  - **`public.ts`** - Public API client for unauthenticated endpoints
  - **`index.ts`** - API exports

- **`src/core/shared/query/`** - TanStack Query configuration
  - **`queryClient.ts`** - Query client configuration with optimized settings
  - **`utils.ts`** - Query utility functions and query keys
  - **`index.ts`** - Query exports

- **`src/core/shared/types/`** - Shared TypeScript types
  - Common interfaces used across domains
  - Base entity types
  - API response types
  - Pagination and filtering types

### **`src/features/` - Feature Components**

Feature-specific components that use the core domains:

- **`src/features/products/`** - Product management features
  - Product listing, forms, and tables
  - Uses `useGetProducts` hook from core domain

- **`src/features/auth/`** - Authentication features
  - Sign-in, sign-up, and profile management

- **`src/features/overview/`** - Dashboard overview features
  - Analytics charts and statistics

- **`src/features/kanban/`** - Kanban board features
  - Task management with drag-and-drop

- **`src/features/profile/`** - User profile features
  - Profile editing and management

- **`src/features/styleguide/`** - Component showcase
  - Interactive documentation of all UI components

## 🚀 **Key Benefits of Current Structure**

### 1. **Clear Separation of Concerns**
- UI components are separated from business logic
- API calls are centralized in domain services
- Types are clearly defined and reusable

### 2. **Domain-Driven Design**
- Each business domain is self-contained
- Easy to understand business capabilities
- Scalable for large applications

### 3. **Type Safety**
- Strong TypeScript support throughout
- Shared types prevent duplication
- Better IntelliSense and error catching

### 4. **Maintainability**
- Clear file organization
- Easy to locate specific functionality
- Consistent patterns across domains

### 5. **Developer Experience**
- Intuitive component organization
- Easy to add new features
- Clear import paths and exports

## 📱 **Usage Examples**

### **Using Domain Hooks**

```typescript
import { useGetProducts, useCreateProduct } from '@/core/domains/products';

function ProductManagement() {
  const { data: products, isLoading, error } = useGetProducts({ limit: 10 });
  const createProduct = useCreateProduct();
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <ProductList products={products?.products || []} />
      <CreateProductForm onSubmit={createProduct.mutate} />
    </div>
  );
}
```

### **API Service Usage**

```typescript
import { productsApi } from '@/core/domains/products';

// In a component or service
const products = await productsApi.getAll({ category: 'electronics' });
const product = await productsApi.getById(123);
```

### **UI Component Usage**

```typescript
import { Button } from '@/ui/components/ui/button';
import { Card } from '@/ui/components/ui/card';
import { Skeleton } from '@/ui/components/ui/skeleton';

function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
      <Skeleton className="h-4 w-32" />
    </Card>
  );
}
```

## 🛠️ **Development Workflow**

### **Adding New Features:**

1. **Define types** in the appropriate domain (`src/core/domains/`)
2. **Implement API service** methods
3. **Create TanStack Query hooks** (when TanStack Query is installed)
4. **Build UI components** in features directory (`src/features/`)
5. **Use hooks and services** in your components

### **Adding New Domains:**

1. Create domain directory: `src/core/domains/new-domain/`
2. Define types in `types.ts`
3. Implement API service in `api.ts`
4. Create hooks in `hooks.ts`
5. Export from `index.ts`
6. Add to `src/core/domains/index.ts`

### **Adding New UI Components:**

1. **Shared components**: Add to `src/ui/components/`
2. **Business components**: Add to `src/ui/business/`
3. **Feature components**: Add to appropriate `src/features/` directory

## 📚 **Best Practices**

### **1. Component Organization**
- Keep UI components in `src/ui/components/`
- Keep business logic in `src/core/domains/`
- Keep feature components in `src/features/`

### **2. Import Paths**
- Use absolute imports with `@/` prefix
- Import from domain index files: `@/core/domains/products`
- Import UI components: `@/ui/components/ui/button`

### **3. Type Definitions**
- Define interfaces for all data structures
- Use shared types from `@/core/shared/types`
- Extend base types for domain-specific needs

### **4. API Services**
- Implement fallback to mock data during development
- Handle errors gracefully
- Use proper HTTP status codes

## 🔍 **File Naming Conventions**

- **Domain files**: `types.ts`, `api.ts`, `hooks.ts`, `index.ts`
- **API files**: `base.ts`, `authenticated.ts`, `public.ts`
- **Query files**: `queryClient.ts`, `utils.ts`
- **Components**: PascalCase (e.g., `ProductList.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGetProducts`)

## 🚦 **Next Steps**

1. **Install TanStack Query**: `pnpm add @tanstack/react-query @tanstack/react-query-devtools`
2. **Implement remaining domains**: Add auth, users, sales, overview domains
3. **Add more TanStack Query hooks**: For different data operations
4. **Create comprehensive test suite**: For domain logic
5. **Add error boundaries**: And better error handling
6. **Implement real API endpoints**: To replace mock data
7. **Add authentication middleware**: To API clients
8. **Create loading and error states**: For all components

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Import errors**: Check that components are in the correct directories
2. **Type errors**: Ensure proper TypeScript interfaces are defined
3. **Hydration errors**: Check for server/client mismatches in API calls
4. **Path resolution**: Verify `@/` alias is properly configured

### **Getting Help:**

- Check the component showcase at `/styleguide`
- Review domain implementations in `src/core/domains/`
- Check shared types in `src/core/shared/types/`

This structure provides a solid foundation for building scalable, maintainable applications with clear separation of concerns and strong type safety.
