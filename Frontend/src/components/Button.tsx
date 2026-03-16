import { forwardRef } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    block = false,
    disabled = false,
    loading = false,
    className = '',
    children,
    onClick,
    ...props
  }, ref) => {
    const baseClasses = 'transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantClasses = {
      primary: `
        bg-primary-500 text-primary-50 hover:bg-primary-600 
        focus-visible:ring-primary-500 focus-visible:ring-offset-primary-50
        active:bg-primary-700
      `,
      secondary: `
        bg-accent-500 text-accent-50 hover:bg-accent-600 
        focus-visible:ring-accent-500 focus-visible:ring-offset-accent-50
        active:bg-accent-700
      `,
      outline: `
        border border-primary-500 text-primary-500 hover:bg-primary-50
        focus-visible:ring-primary-500 focus-visible:ring-offset-primary-50
        active:bg-primary-100
      `,
      ghost: `
        text-primary-500 hover:bg-primary-50 hover:text-primary-700
        focus-visible:ring-primary-500 focus-visible:ring-offset-primary-50
        active:bg-primary-100
      `,
    };

    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-5 text-lg',
    };

     return (
       <button
         ref={ref}
         className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${block ? 'w-full' : ''} ${className}`}
         disabled={disabled || loading}
         onClick={onClick}
         {...props}
       >
        {loading ? (
          <>
            <Spinner size={size === 'lg' ? 'md' : size} className={`mr-${size === 'lg' ? '2' : size === 'sm' ? '1' : '1.5'}`} />
            <span className="opacity-75">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';