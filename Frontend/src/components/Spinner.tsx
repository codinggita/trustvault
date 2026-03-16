import { forwardRef } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };

    return (
      <div
        ref={ref}
        className={`animate-spin rounded-full border-2 border-sky-500 border-t-transparent ${sizeClasses[size]} ${className}`}
        role="status"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';
