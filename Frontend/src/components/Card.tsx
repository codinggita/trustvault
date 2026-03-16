import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = ({ children, className = '', header, footer }: CardProps) => {
  return (
    <div className={`bg-background-800/50 backdrop-blur-glass border border-border/20 rounded-glass p-6 ${className}`}>
      {header && <div className="mb-4">{header}</div>}
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};
Card.displayName = 'Card';