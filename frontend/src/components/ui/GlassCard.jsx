export default function GlassCard({ className = '', children }) {
  return <div className={`glass-panel ${className}`.trim()}>{children}</div>;
}

