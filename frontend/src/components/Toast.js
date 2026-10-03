import React from 'react';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export default function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast toast-${type}`}>
      <span>{ICONS[type] || '✅'}</span>
      <span>{message}</span>
    </div>
  );
}
