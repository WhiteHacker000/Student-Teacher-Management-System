import React from 'react';

export function Button({ children, className = '', variant, size, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors';
  const variants = {
    default: 'bg-black text-white hover:opacity-90',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  };
  const chosen = variants[variant] || variants.default;
  return (
    <button className={`${base} ${chosen} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;


