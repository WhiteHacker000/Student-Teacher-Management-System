import React from 'react';

export function Input({ className = '', ...props }) {
  const base = 'block w-full rounded-xl border border-purple-500/30 bg-slate-900/40 backdrop-blur-sm px-4 py-2.5 text-sm text-purple-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-400/50';
  return <input className={`${base} ${className}`} {...props} />;
}

export default Input;


