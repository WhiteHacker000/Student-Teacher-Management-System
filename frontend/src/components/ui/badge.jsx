import React from 'react';

export function Badge({ className = '', variant = 'default', children }) {
  const variants = {
    default: 'bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    outline: 'border border-purple-400/40 text-purple-300 bg-purple-500/5',
    secondary: 'bg-blue-500/20 text-blue-200 border border-blue-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]',
    success: 'bg-green-500/20 text-green-200 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    destructive: 'bg-red-500/20 text-red-200 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  };
  const chosen = variants[variant] || variants.default;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-300 ${chosen} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;


