# Performance Optimization Guide

## Current Performance Baseline

### Bundle Analysis
- React 19: ~42KB (gzip)
- React Router: ~16KB (gzip)
- Tailwind CSS: ~15-30KB (varies by utility usage)
- Axios: ~14KB (gzip)
- Chart.js: ~90KB (gzip)

**Total estimated bundle**: ~180-200KB (gzip)

---

## Quick Wins (Easy to Implement)

### 1. Code Splitting by Routes
**Impact**: Reduce initial bundle load by 40-50%

```tsx
// Current: All pages loaded upfront
import Dashboard from './pages/Dashboard';
import BodyMetric from './pages/BodyMetric';

// Optimized: Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const BodyMetric = lazy(() => import('./pages/BodyMetric'));
const BodyEvolution = lazy(() => import('./pages/BodyEvolution'));
const MuscleTargeting = lazy(() => import('./pages/MuscleTargeting'));
const NutritionTracker = lazy(() => import('./pages/NutritionTracker'));
const ExerciseBrowser = lazy(() => import('./pages/ExerciseBrowser'));

// In App.tsx routes:
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/" element={<Dashboard />} />
  <Route path="/metrics" element={<BodyMetric />} />
  // ... other routes
</Suspense>
```

### 2. Component Memoization
**Impact**: Prevent unnecessary re-renders (5-20% performance gain)

```tsx
import { memo } from 'react';

// Memoize expensive components
const Sidebar = memo(() => {
  // Component code
});

const BodyCard = memo(({ userData }) => {
  // Component code
}, (prevProps, nextProps) => {
  return prevProps.userData.id === nextProps.userData.id;
});

export default Sidebar;
```

### 3. Axios Request Caching
**Impact**: Reduce API calls by 30-40% for repeated requests

```ts
// src/api/axiosClient.ts
import axios, { AxiosRequestConfig } from 'axios';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add caching interceptor
axiosClient.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  const cacheKey = `${method}:${config.url}`;
  
  if (method === 'GET' && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return Promise.reject(new axios.Cancel('Cached'));
    }
  }
  return config;
});

axiosClient.interceptors.response.use((response) => {
  const method = response.config.method?.toUpperCase();
  const cacheKey = `${method}:${response.config.url}`;
  
  if (method === 'GET') {
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
  }
  return response;
});

export default axiosClient;
```

### 4. Image Optimization
**Impact**: Reduce image load time by 50-70%

```tsx
// Use WebP with fallback
<picture>
  <source srcSet="/images/hero.webp" type="image/webp" />
  <source srcSet="/images/hero.jpg" type="image/jpeg" />
  <img src="/images/hero.jpg" alt="Hero image" loading="lazy" />
</picture>

// Or with next-gen approach
<img 
  src="/images/hero.jpg" 
  alt="Hero"
  loading="lazy"
  decoding="async"
/>
```

### 5. Tailwind CSS Optimization
**Impact**: Reduce CSS bundle by 20-40%

Add to `tailwind.config.js`:
```js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e22718',
        dark: {
          bg: '#121212',
          border: '#333',
        },
      },
    },
  },
  // Remove unused utilities
  safelist: [],
  corePlugins: {
    // Disable unused utilities
    animation: false, // Only if not needed
  },
};
```

---

## Medium Effort (1-2 hours)

### 6. Virtual Scrolling for Lists
**Impact**: Handle large lists without performance degradation

```tsx
import { FixedSizeList as List } from 'react-window';

const ExerciseList = ({ exercises }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="flex items-center p-2">
      {exercises[index].name}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={exercises.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 7. Implement useCallback for Event Handlers
**Impact**: Prevent child re-renders from parent updates

```tsx
import { useCallback, useState } from 'react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  const handleAddMetric = useCallback((newMetric) => {
    setMetrics(prev => [...prev, newMetric]);
  }, []);

  return <MetricsChart onAdd={handleAddMetric} />;
};
```

### 8. Chart.js Configuration Optimization
**Impact**: Reduce chart rendering time by 30%

```tsx
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

const BodyEvolutionChart = ({ data }) => {
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      animation: { duration: 0 }, // Disable animations for speed
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  return <Line data={data} options={chartOptions} />;
};
```

---

## Advanced Optimizations (4+ hours)

### 9. Service Worker & Offline Support
**Impact**: Enable offline functionality, cache assets

```ts
// src/serviceWorker.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.log('SW registration failed'));
}
```

### 10. Web Workers for Heavy Computation
**Impact**: Offload calculation to background thread

```tsx
// src/workers/dataProcessor.worker.ts
self.onmessage = (event) => {
  const { userData } = event.data;
  const processed = expensiveCalculation(userData);
  self.postMessage(processed);
};

// Usage in component
const worker = new Worker(new URL('./dataProcessor.worker.ts', import.meta.url));
worker.postMessage({ userData });
worker.onmessage = (e) => setProcessedData(e.data);
```

### 11. State Management Optimization with Zustand (Lightweight Alternative)
**Impact**: Fine-grained reactivity, smaller bundle than Redux

```tsx
// src/store/userStore.ts
import create from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateMetrics: (metrics) => set(state => ({
    user: { ...state.user, metrics }
  })),
}));

// In component
const user = useUserStore((state) => state.user);
```

### 12. Implement Edge Caching (Server-Side)
**Impact**: Reduce latency for global users

- Deploy to CDN (Vercel, Netlify, Cloudflare)
- Use edge functions for dynamic content
- Implement cache headers in backend

---

## Monitoring & Metrics

### Add Performance Monitoring
```tsx
// src/utils/performanceMonitor.ts
export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domInteractive - perfData.domLoading;
    
    console.log('Page Load Time:', pageLoadTime);
    console.log('Connect Time:', connectTime);
    console.log('Render Time:', renderTime);
  }
};
```

### Tools to Use
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **Bundle Analyzer**: `npm install --save-dev vite-plugin-visualizer`

---

## Performance Goals

| Metric | Current Goal | Target |
|--------|---------|--------|
| First Contentful Paint (FCP) | ~2.0s | <1.5s |
| Largest Contentful Paint (LCP) | ~3.0s | <2.5s |
| Cumulative Layout Shift (CLS) | <0.1 | <0.05 |
| Time to Interactive (TTI) | ~4.0s | <3.0s |
| Bundle Size (gzip) | ~200KB | <150KB |

---

## Implementation Priority

1. **Phase 1 (Week 1)**: Route code splitting + memoization
2. **Phase 2 (Week 2)**: Axios caching + Tailwind optimization
3. **Phase 3 (Week 3)**: Virtual scrolling + useCallback optimization
4. **Phase 4 (Month 2)**: Service Worker + Web Workers
5. **Phase 5 (Ongoing)**: Monitoring & continuous optimization

Each phase requires minimal refactoring and can be implemented independently.
