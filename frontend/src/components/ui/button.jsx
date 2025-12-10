import React from 'react';

export function Button({ children, className = '', variant, size, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  const sizes = {
    default: 'px-6 py-2.5 text-sm',
    sm: 'px-4 py-2 text-xs',
    lg: 'px-8 py-3.5 text-base',
  };
  const variants = {
    default: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-neon hover:scale-[1.02] shadow-glow',
    outline: 'border border-purple-500/30 bg-white/5 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    ghost: 'hover:bg-purple-500/10 text-purple-200 hover:text-purple-100',
    destructive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-[1.02]',
  };
  const chosenVariant = variants[variant] || variants.default;
  const chosenSize = sizes[size] || sizes.default;
  return (
    <button className={`${base} ${chosenVariant} ${chosenSize} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
    </button>
  );
}

export default Button;


