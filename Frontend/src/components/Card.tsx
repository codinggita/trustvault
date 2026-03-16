import type { PropsWithChildren } from 'react';
import { SkeletonLoader } from './SkeletonLoader';

interface CardProps extends PropsWithChildren {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  skeletonConfig?: {
    header?: boolean;
    body?: boolean;
    bodyRows?: number;
    footer?: boolean;
  };
}

export const Card = ({ 
  children, 
  className = '', 
  header, 
  footer, 
  loading = false,
  skeletonConfig = {}
}: CardProps) => {
  if (loading) {
    return (
      <div className={`bg-background-800/50 backdrop-blur-glass border border-border/20 rounded-glass p-6 ${className}`}>
        {skeletonConfig.header !== false && header ? (
          <SkeletonLoader 
            className="mb-4" 
            width="60%" 
            height="1.5rem"
          />
        ) : null}
        <div className="space-y-4">
         {Array.isArray(children) && skeletonConfig.body ? (
             children.map((_, index) => (
               <SkeletonLoader 
                 key={index} 
                 className="mb-2" 
                 width="100%" 
                 height="1rem"
               />
             ))
           ) : (
            skeletonConfig.body && !Array.isArray(children) ? (
              <SkeletonLoader 
                className="mb-2" 
                width="100%" 
                height="1rem"
              />
            ) : (
              children
            )
          )}
          {(Array.isArray(children) && children.length > 1) || !Array.isArray(children) ? (
            skeletonConfig.body && (
              <SkeletonLoader 
                className="mb-2" 
                width="80%" 
                height="1rem"
              />
            )
          ) : null}
          {skeletonConfig.body && skeletonConfig.bodyRows ? (
            Array.from({ length: skeletonConfig.bodyRows }).map((_, index) => (
              <SkeletonLoader 
                key={index} 
                className="mb-2" 
                width="70%" 
                height="1rem"
              />
            ))
          ) : null}
          {skeletonConfig.footer !== false && footer ? (
            <SkeletonLoader 
              className="mt-4" 
              width="50%" 
              height="1rem"
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background-800/50 backdrop-blur-glass border border-border/20 rounded-glass p-6 ${className}`}>
      {header && <div className="mb-4">{header}</div>}
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

Card.displayName = 'Card';