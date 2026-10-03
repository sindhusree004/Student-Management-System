import React from 'react';

export default function DeleteModal({ student, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">Delete Student</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="delete-body">
          <div className="delete-icon">🗑️</div>
          <p>Are you sure you want to delete <strong>{student.name}</strong>?</p>
          <p className="delete-sub">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
