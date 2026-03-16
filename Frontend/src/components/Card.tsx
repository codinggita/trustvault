import type { PropsWithChildren, ReactNode } from 'react';
import { SkeletonLoader } from './SkeletonLoader';

interface CardProps extends PropsWithChildren {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  skeletonRows?: number;
}

export const Card = ({
  children,
  className = '',
  header,
  footer,
  loading = false,
  skeletonRows = 3,
}: CardProps) => {
  return (
    <section
      className={`rounded-3xl border border-slate-800 bg-slate-900/85 p-6 shadow-xl shadow-slate-950/30 backdrop-blur ${className}`}
    >
      {header ? <div className="mb-4">{header}</div> : null}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <SkeletonLoader
              key={index}
              className="rounded-xl"
              height="1rem"
              width={index === skeletonRows - 1 ? '75%' : '100%'}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
};

Card.displayName = 'Card';
