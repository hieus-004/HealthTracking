# Component Best Practices & Reusability Guide

## Component Structure Guidelines

### 1. Atomic Component Design Hierarchy

```
Atoms (Smallest, Reusable)
├── Button.tsx
├── Input.tsx
├── Label.tsx
└── Icon.tsx

Molecules (Atoms + Logic)
├── FormField.tsx (Input + Label)
├── SearchBar.tsx (Input + Icon)
└── UserCard.tsx (Multiple atoms)

Organisms (Complex Features)
├── Header.tsx
├── Sidebar.tsx
├── MetricsSection.tsx
└── NutritionForm.tsx

Pages (Full Screen)
├── Dashboard.tsx
├── BodyMetric.tsx
└── NutritionTracker.tsx

Templates (Layout Wrappers)
├── MainLayout.tsx
└── AuthLayout.tsx
```

---

## Creating Reusable Components

### Component Template with TypeScript

```tsx
// src/components/Common/Button.tsx
import React from 'react';

interface ButtonProps {
  /**
   * Button display text
   */
  label: string;
  
  /**
   * Button style variant
   */
  variant?: 'primary' | 'secondary' | 'danger';
  
  /**
   * Button click handler
   */
  onClick?: () => void;
  
  /**
   * Is button in loading state
   */
  isLoading?: boolean;
  
  /**
   * Is button disabled
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Icon to display (optional)
   */
  icon?: React.ReactNode;
  
  /**
   * Button HTML type
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  type = 'button',
  size = 'md',
}) => {
  const baseStyles = 'font-semibold rounded-md transition-all duration-200 flex items-center gap-2';
  
  const variantStyles = {
    primary: 'bg-[#e22718] hover:bg-[#c81c0e] text-white disabled:bg-gray-600',
    secondary: 'bg-[#252525] hover:bg-[#333] text-gray-400 disabled:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-600',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
};

export default Button;
```

---

## Common Reusable Components to Create

### 1. Card Component
```tsx
// src/components/Common/Card.tsx
interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  clickable = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#333] rounded-lg p-6 
                   ${clickable ? 'cursor-pointer hover:bg-[#252525] transition-colors' : ''} 
                   ${className}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
    >
      {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
      {description && <p className="text-gray-400 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
};
```

### 2. Modal Component
```tsx
// src/components/Common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-400 mb-6">{children}</div>
        <div className="flex gap-2 justify-end">
          <Button label={cancelText} variant="secondary" onClick={onClose} />
          <Button 
            label={confirmText} 
            variant="primary" 
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
```

### 3. Loading Spinner
```tsx
// src/components/Common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClass[size]} border-4 border-[#333] border-t-[#e22718] rounded-full animate-spin`}></div>
      {message && <p className="text-gray-400 mt-4">{message}</p>}
    </div>
  );
};
```

### 4. Alert/Toast Component
```tsx
// src/components/Common/Alert.tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);
  
  const colorMap = {
    success: 'bg-green-900 text-green-100 border-green-700',
    error: 'bg-red-900 text-red-100 border-red-700',
    warning: 'bg-yellow-900 text-yellow-100 border-yellow-700',
    info: 'bg-blue-900 text-blue-100 border-blue-700',
  };
  
  return (
    <div className={`border rounded-lg p-4 mb-4 ${colorMap[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-lg hover:opacity-70">×</button>
        )}
      </div>
    </div>
  );
};
```

### 5. Form Group Component
```tsx
// src/components/Common/FormGroup.tsx
interface FormGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  required = false,
  children,
  helperText,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
};
```

### 6. Table Component
```tsx
// src/components/Common/Table.tsx
interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const Table = <T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) => {
  if (isLoading) return <LoadingSpinner />;
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-8">{emptyMessage}</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[#333]">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-semibold text-gray-400 text-align-${col.align || 'left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className={`border-b border-[#333] hover:bg-[#252525] transition ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-300">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## Custom Hooks for Common Patterns

### 1. useFetch Hook
```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { AxiosError } from 'axios';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

const useFetch = <T,>(url: string) => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axiosClient.get<T>(url);
        if (isMounted) {
          setState({ data: response.data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error as AxiosError });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};

export default useFetch;
```

### 2. useLocalStorage Hook
```tsx
// src/hooks/useLocalStorage.ts
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
```

### 3. useAsync Hook
```tsx
// src/hooks/useAsync.ts
const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [res, setRes] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    try {
      const response = await asyncFunction();
      setRes(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, res, error };
};
```

---

## Component Testing Best Practices

```tsx
// src/components/Common/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const mockClick = vi.fn();
    render(<Button label="Click" onClick={mockClick} />);
    await userEvent.click(screen.getByText('Click'));
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" disabled={true} />);
    expect(screen.getByText('Click')).toBeDisabled();
  });

  it('should apply variant styles correctly', () => {
    render(<Button label="Click" variant="secondary" />);
    const button = screen.getByText('Click');
    expect(button).toHaveClass('bg-[#252525]');
  });
});
```

---

## Documentation & Storybook Integration

Create a `COMPONENTS.md` file documenting each component:

```markdown
# Button Component

## Usage
\`\`\`tsx
<Button 
  label="Submit" 
  variant="primary" 
  onClick={handleSubmit}
/>
\`\`\`

## Props
- `label` (string): Button text
- `variant` ('primary' | 'secondary' | 'danger'): Style variant
- `onClick` (function): Click handler
- `disabled` (boolean): Disabled state
- `isLoading` (boolean): Loading state
- `size` ('sm' | 'md' | 'lg'): Button size

## Examples
[See Storybook](https://storybook.example.com)
```

---

## Scalability Checklist

- ✅ Components accept `className` prop for customization
- ✅ Props are well-documented with TypeScript interfaces
- ✅ Components are tested with unit tests
- ✅ Reusable utilities extracted to separate files
- ✅ Style constants centralized (colors, sizes)
- ✅ Error states handled gracefully
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Loading states implemented
- ✅ No hardcoded values (all props/config)
- ✅ Components are pure (no side effects unless in hooks)

This structure allows adding new features without refactoring existing code.
