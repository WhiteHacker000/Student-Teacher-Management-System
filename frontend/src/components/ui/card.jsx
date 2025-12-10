import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div 
      className={`rounded-2xl border border-purple-500/20 bg-slate-900/40 backdrop-blur-xl shadow-glow hover:border-purple-400/40 hover:shadow-neon transition-all duration-300 ${className}`} 
      {...props} 
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`p-6 border-b border-purple-500/10 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`text-xl font-bold tracking-tight text-purple-100 ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-slate-400 mt-1 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}


