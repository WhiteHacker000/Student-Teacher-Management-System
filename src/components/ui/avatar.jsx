import React from 'react';

export function Avatar({ className = '', children }) {
  return <div className={`inline-flex h-10 w-10 overflow-hidden rounded-full bg-gray-200 ${className}`}>{children}</div>;
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}

export function AvatarFallback({ className = '', children }) {
  return <div className={`flex h-full w-full items-center justify-center text-sm ${className}`}>{children}</div>;
}

export default Avatar;


