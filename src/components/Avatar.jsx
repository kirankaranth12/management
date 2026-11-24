import React from 'react';
import { User } from 'lucide-react';

export default function Avatar({ src, name = 'User', className = 'w-10 h-10', textClassName = 'text-xs' }) {
  // Check if valid user-uploaded photo (data URL, blob, or non-AI clean URL)
  const isAiOrStock = typeof src === 'string' && (src.includes('dicebear') || src.includes('images.unsplash.com'));
  const hasValidPhoto = src && typeof src === 'string' && src.trim().length > 0 && !isAiOrStock;

  if (hasValidPhoto) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} rounded-xl object-cover ring-2 ring-slate-200/80 shadow-xs`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Fallback: Clean initials on professional solid slate background
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div
      className={`${className} rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center select-none shadow-xs shrink-0`}
      title={name}
    >
      {initials ? (
        <span className={textClassName}>{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-slate-300" />
      )}
    </div>
  );
}
