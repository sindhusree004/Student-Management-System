import React, { useState, useEffect } from 'react';

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical',
  'Civil', 'Information Technology', 'Electrical',
];

const EMPTY = { name: '', email: '', phone: '', department: '', year: '', cgpa: '' };

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';

  if (!form.phone.trim()) errs.phone = 'Phone is required';
  else if (!/^\+?[0-9]{7,15}$/.test(form.phone.trim())) errs.phone = 'Phone must be 7–15 digits';

  if (!form.department) errs.department = 'Department is required';

  const y = parseInt(form.year);
  if (!form.year) errs.year = 'Year is required';
  else if (isNaN(y) || y < 1 || y > 5) errs.year = 'Year must be between 1 and 5';

  const c = parseFloat(form.cgpa);
  if (form.cgpa === '') errs.cgpa = 'CGPA is required';
  else if (isNaN(c) || c < 0 || c > 10) errs.cgpa = 'CGPA must be between 0.0 and 10.0';

  return errs;
}

export default function StudentForm({ student, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        department: student.department || '',
        year: String(student.year || ''),
        cgpa: String(student.cgpa || ''),
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setServerError('');
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => { const n = { ...e }; delete n[name]; return n; });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        department: form.department,
        year: parseInt(form.year),
        cgpa: parseFloat(form.cgpa),
      };
      await onSave(payload, student?.id);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setServerError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = Boolean(student);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {serverError && (
          <div className="form-server-error">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="req">*</span></label>
              <input
                id="name" name="name" type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Aarav Sharma"
                value={form.name} onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span className="req">*</span></label>
              <input
                id="email" name="email" type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. aarav@college.edu"
                value={form.email} onChange={handleChange}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="req">*</span></label>
              <input
                id="phone" name="phone" type="text"
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder="e.g. 9876543210"
                value={form.phone} onChange={handleChange}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department <span className="req">*</span></label>
              <select
                id="department" name="department"
                className={`form-input ${errors.department ? 'input-error' : ''}`}
                value={form.department} onChange={handleChange}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="year">Academic Year <span className="req">*</span></label>
              <select
                id="year" name="year"
                className={`form-input ${errors.year ? 'input-error' : ''}`}
                value={form.year} onChange={handleChange}
              >
                <option value="">Select year…</option>
                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cgpa">CGPA <span className="req">*</span></label>
              <input
                id="cgpa" name="cgpa" type="number"
                step="0.01" min="0" max="10"
                className={`form-input ${errors.cgpa ? 'input-error' : ''}`}
                placeholder="e.g. 8.75"
                value={form.cgpa} onChange={handleChange}
              />
              {errors.cgpa && <span className="field-error">{errors.cgpa}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
