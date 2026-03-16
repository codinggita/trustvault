import { forwardRef } from 'react';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave';
}

export const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  (
    { width = '100%', height = '1rem', className = '', animation = 'pulse', ...props },
    ref,
  ) => {
    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-pulse',
    };

    return (
      <div
        ref={ref}
        className={`rounded bg-slate-800 ${animationClasses[animation]} ${className}`}
        style={{ width, height }}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

SkeletonLoader.displayName = 'SkeletonLoader';
