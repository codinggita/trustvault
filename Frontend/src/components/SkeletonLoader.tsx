import { forwardRef } from 'react';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave';
}

export const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ width = '100%', height = '1rem', className = '', animation = 'pulse', ...props }, ref) => {
    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-wave',
    };

    return (
      <div
        ref={ref}
        className={`bg-muted rounded ${animationClasses[animation]} ${className}`}
        style={{ width, height }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';

// Add keyframes for wave animation if needed
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wave {
      0% {
        background-position: -100% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    .animate-wave {
      background-size: 200% 100%;
      animation: wave 1.5s linear infinite;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  `;
  document.head.appendChild(style);
}