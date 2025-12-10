import React from 'react';

export function Label({ className = '', ...props }) {
  return <label className={`text-sm font-medium text-purple-200 ${className}`} {...props} />;
}

export default Label;


