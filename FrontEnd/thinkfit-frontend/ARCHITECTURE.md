# Frontend Architecture Documentation

## Current State Overview

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS (Dark theme)
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2

### Directory Structure
```
src/
├── api/              # HTTP client & API integrations
├── components/       # Reusable UI components
├── layouts/          # Page layout wrappers
├── pages/            # Feature pages (8 total)
├── types/            # TypeScript interfaces & types
├── App.tsx           # Route definitions
├── main.tsx          # Entry point
└── index.css         # Global styles
```

---

## Architecture Optimization Strategies

### 1. API Layer Enhancement
**Current**: Single `axiosClient.ts` with hardcoded baseURL

**Optimization Path**:
- Create separate API service folders: `api/services/` for domain-specific requests
  - `userService.ts` - User/auth endpoints
  - `bodyService.ts` - Body metrics endpoints
  - `nutritionService.ts` - Nutrition endpoints
  - `exerciseService.ts` - Exercise endpoints
- Implement error handling middleware
- Add request/response interceptors for logging & auth tokens
- Create API response types in `types/api/` folder

### 2. State Management
**Current**: Local component state (useState)

**Optimization Path** (without full refactor):
- Introduce Context API for shared data (user profile, theme, notifications)
- Create custom hooks for common state logic:
  - `useUserProfile()` - User body data
  - `useFetchData()` - Generic data fetching with loading/error states
  - `useLocalStorage()` - Persist user preferences
- Prepare structure for future Redux if needed

### 3. Component Organization
**Current**: Mixed component sizes in `pages/`

**Optimization Path**:
- Create `components/` subdirectories by feature:
  ```
  components/
  ├── Dashboard/          # Dashboard-specific components
  ├── BodyMetrics/        # Body metric-related components
  ├── Nutrition/          # Nutrition tracker components
  ├── Exercises/          # Exercise-related components
  ├── Common/             # Shared UI components (Button, Card, Modal, etc.)
  └── Charts/             # Chart wrapper components
  ```
- Extract reusable UI elements (Button, Card, Modal, Table, Form inputs)
- Document component APIs with TypeScript props interfaces

### 4. Type Safety Improvements
**Current**: Limited type definitions (`bodyMetric.ts` only)

**Optimization Path**:
- Create `types/` subdirectories:
  ```
  types/
  ├── api/               # API request/response types
  ├── models/            # Domain models (User, Exercise, Meal, etc.)
  ├── components/        # Component prop types
  └── index.ts           # Central type exports
  ```
- Generate types from backend OpenAPI/Swagger docs (if available)
- Use `Partial<T>` and `Required<T>` utility types for flexibility

### 5. Authentication & Authorization
**Current**: No visible auth implementation

**Optimization Path**:
- Create `contexts/AuthContext.tsx` for user auth state
- Implement JWT token management in axios interceptor
- Add route guards for protected pages
- Create `hooks/useAuth()` for easy auth access

### 6. Performance Optimization
**Current**: All pages load their own data independently

**Optimization Path**:
- Implement code splitting at route level:
  ```tsx
  const Dashboard = lazy(() => import('./pages/Dashboard'));
  const BodyMetric = lazy(() => import('./pages/BodyMetric'));
  ```
- Add Suspense boundaries for lazy-loaded components
- Memoize expensive components with `React.memo()`
- Use `useCallback()` to prevent unnecessary function recreations
- Implement virtual scrolling for long lists

### 7. Styling & Design System
**Current**: Tailwind CSS with inline classes

**Optimization Path**:
- Create utility config in `tailwind.config.js`:
  - Define color palette constants
  - Standardize spacing, sizing, shadows
- Extract reusable Tailwind class groups into constants:
  ```ts
  export const ButtonStyles = {
    primary: 'bg-[#e22718] hover:bg-[#c81c0e] text-white py-2 px-4 rounded-md',
    secondary: 'bg-[#252525] hover:bg-[#333] text-gray-400 py-2 px-4 rounded-md',
  };
  ```
- Consider CSS Modules or styled-components for complex components
- Create design tokens documentation

### 8. Testing Infrastructure
**Current**: No visible test setup

**Optimization Path**:
- Add testing framework (Vitest + React Testing Library)
- Create test files alongside components: `Component.test.tsx`
- Focus on:
  - Component snapshot tests
  - API integration tests
  - Route navigation tests
  - Critical business logic tests

---

## Data Flow Improvements

### Current Flow
```
Component → Axios call → Backend API
```

### Improved Flow
```
Component 
  ↓
Custom Hook (useUserMetrics, useFetchExercises, etc.)
  ↓
API Service (userService, exerciseService, etc.)
  ↓
Axios Client (with interceptors)
  ↓
Backend API
```

---

## Error Handling Strategy

Implement consistent error handling:
1. **Network errors** - Display user-friendly messages
2. **Auth errors** - Redirect to login
3. **Validation errors** - Show field-level feedback
4. **Server errors** - Log to monitoring service (Sentry, etc.)

Create `utils/errorHandler.ts`:
```ts
export const handleApiError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 404) {
    // Show not found message
  } else {
    // Generic error handling
  }
};
```

---

## Accessibility & SEO

- Add semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`)
- Implement ARIA labels for interactive elements
- Ensure keyboard navigation throughout app
- Add meta tags in `index.html` for SEO
- Consider dynamic page titles based on routes

---

## Next Steps (Non-Breaking)

1. ✅ Create API service layer structure
2. ✅ Establish type definitions organization
3. ✅ Add custom hooks for common patterns
4. ✅ Implement error handling middleware
5. ✅ Set up Context API for global state
6. ✅ Extract reusable components
7. ✅ Add explicit route lazy loading
8. ✅ Implement testing setup

These changes can be implemented incrementally without breaking existing functionality.
