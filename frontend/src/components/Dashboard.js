import React from 'react';

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical',
  'Civil', 'Information Technology', 'Electrical',
];

const CGPA_COLOR = (cgpa) => {
  if (cgpa >= 9) return '#16a34a';
  if (cgpa >= 7.5) return '#2563eb';
  if (cgpa >= 6) return '#d97706';
  return '#dc2626';
};

export default function Dashboard({
  students, loading, error,
  search, filterDept, filterYear,
  onSearchChange, onDeptChange, onYearChange,
  onAdd, onEdit, onDelete, onRetry,
}) {
  return (
    <div className="dashboard">
      {/* Controls bar */}
      <div className="controls">
        <div className="controls-left">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => onSearchChange('')}>✕</button>
            )}
          </div>
          <select
            className="filter-select"
            value={filterDept}
            onChange={e => onDeptChange(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            className="filter-select"
            value={filterYear}
            onChange={e => onYearChange(e.target.value)}
          >
            <option value="">All Years</option>
            {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          {(search || filterDept || filterYear) && (
            <button className="btn btn-ghost" onClick={() => { onSearchChange(''); onDeptChange(''); onYearChange(''); }}>
              Clear filters
            </button>
          )}
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Student
        </button>
      </div>

      {/* Table area */}
      {loading ? (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading students…</p>
        </div>
      ) : error ? (
        <div className="state-box state-error">
          <span className="state-icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={onRetry}>Retry</button>
        </div>
      ) : students.length === 0 ? (
        <div className="state-box">
          <span className="state-icon">📭</span>
          <p>{search || filterDept || filterYear ? 'No students match your filters.' : 'No students yet.'}</p>
          {!search && !filterDept && !filterYear && (
            <button className="btn btn-primary" onClick={onAdd}>Add your first student</button>
          )}
        </div>
      ) : (
        <>
          <div className="results-info">
            Showing <strong>{students.length}</strong> student{students.length !== 1 ? 's' : ''}
            {(search || filterDept || filterYear) && ' (filtered)'}
          </div>
          <div className="table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>CGPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.id} className="table-row">
                    <td className="td-num">{idx + 1}</td>
                    <td className="td-name">{s.name}</td>
                    <td className="td-email">{s.email}</td>
                    <td>{s.phone}</td>
                    <td>
                      <span className="dept-badge">{s.department}</span>
                    </td>
                    <td className="td-center">
                      <span className="year-badge">Year {s.year}</span>
                    </td>
                    <td className="td-center">
                      <span className="cgpa-badge" style={{ color: CGPA_COLOR(s.cgpa) }}>
                        {s.cgpa.toFixed(1)}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button className="btn btn-edit" onClick={() => onEdit(s)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => onDelete(s)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
