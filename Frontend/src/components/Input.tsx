import { forwardRef, useState } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
   ({
     type = 'text',
     placeholder = '',
     value = '',
     onChange,
     className = '',
     disabled = false,
     error = false,
     icon,
     ...props
   }, forwardedRef) => {
     const [isFocused, setIsFocused] = useState(false);

     const baseClasses = 'transition-all duration-200 ease-in-out w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

     const variantClasses = error
       ? 'border-red-500 text-red-500 focus:ring-red-500 focus:ring-offset-red-500'
       : isFocused
       ? 'border-primary-500 text-primary-600 focus:ring-primary-500 focus:ring-offset-primary-500'
       : 'border-gray-300 text-gray-700 focus:border-gray-400';

     return (
       <div className="flex items-center gap-2">
         {icon && <span className="text-gray-400">{icon}</span>}
         <input
           type={type}
           placeholder={placeholder}
           value={value}
           onChange={(e) => {
             setIsFocused(true);
             onChange?.(e.target.value);
           }}
           ref={forwardedRef}
           className={`${baseClasses} ${variantClasses} ${className}`}
           disabled={disabled}
           {...props}
         />
       </div>
     );
   }
 );
Input.displayName = 'Input';