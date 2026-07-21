import React from 'react';
import ViewCardModal from './ViewCardModal';

export default function CardViewer({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:p-6 overflow-y-auto">
        <ViewCardModal item={item} onClose={onClose} />
      </div>
    </div>
  );
}