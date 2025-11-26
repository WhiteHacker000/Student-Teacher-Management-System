import React from 'react';

export function Card({ className = '', ...props }) {
  return <div className={`rounded-xl border border-gray-200 bg-white shadow ${className}`} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`p-4 border-b border-gray-100 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}


