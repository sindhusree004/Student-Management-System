import React, { useState, useEffect, useCallback } from 'react';
import { studentApi } from './api/studentApi';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, count] = await Promise.all([
        studentApi.getAll({ search: search || undefined, department: filterDept || undefined, year: filterYear || undefined }),
        studentApi.getCount(),
      ]);
      setStudents(data);
      setTotalCount(count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterDept, filterYear]);

  useEffect(() => {
    const timer = setTimeout(() => loadStudents(), search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [loadStudents, search]);

  const handleSave = async (formData, id) => {
    if (id) {
      await studentApi.update(id, formData);
      showToast(`${formData.name} updated successfully`);
    } else {
      await studentApi.create(formData);
      showToast(`${formData.name} added successfully`);
    }
    setShowForm(false);
    setEditingStudent(null);
    loadStudents();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await studentApi.delete(deleteTarget.id);
      showToast(`${deleteTarget.name} deleted`, 'info');
      setDeleteTarget(null);
      loadStudents();
    } catch (err) {
      showToast(err.message, 'error');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-icon">🎓</span>
            <div>
              <h1 className="header-title">Student Management System</h1>
              <p className="header-sub">VSB Engineering College, Karur</p>
            </div>
          </div>
          <div className="header-stat">
            <span className="stat-num">{totalCount}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Dashboard
          students={students}
          loading={loading}
          error={error}
          search={search}
          filterDept={filterDept}
          filterYear={filterYear}
          onSearchChange={setSearch}
          onDeptChange={setFilterDept}
          onYearChange={setFilterYear}
          onAdd={() => { setEditingStudent(null); setShowForm(true); }}
          onEdit={(s) => { setEditingStudent(s); setShowForm(true); }}
          onDelete={setDeleteTarget}
          onRetry={loadStudents}
        />
      </main>
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingStudent(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
