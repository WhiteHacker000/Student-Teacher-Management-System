import React from 'react';

export function Progress({ value = 0, className = '' }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded bg-gray-200 ${className}`}>
      <div className="h-2 rounded bg-blue-500" style={{ width: `${width}%` }} />
    </div>
  );
}

export default Progress;


