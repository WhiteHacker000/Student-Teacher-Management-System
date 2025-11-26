import React from 'react';

export function Input({ className = '', ...props }) {
  const base = 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  return <input className={`${base} ${className}`} {...props} />;
}

export default Input;


