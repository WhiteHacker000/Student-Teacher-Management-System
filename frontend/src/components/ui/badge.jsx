import React from 'react';

export function Badge({ className = '', variant = 'default', children }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700',
    secondary: 'bg-blue-100 text-blue-800',
  };
  const chosen = variants[variant] || variants.default;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${chosen} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;


