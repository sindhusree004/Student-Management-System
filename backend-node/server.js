/**
 * Student Management System - Node.js Backend
 * Mirrors the Spring Boot REST API spec exactly.
 * Run: node server.js
 * (The Java/Spring Boot source is in ../backend/ for submission/viva)
 */

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { body, param, query, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'studentdb.sqlite');

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS || '*' }));
app.use(express.json());

// ─── Database Setup ───────────────────────────────────────────
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    phone     TEXT    NOT NULL,
    department TEXT   NOT NULL,
    year      INTEGER NOT NULL,
    cgpa      REAL    NOT NULL
  );
`);

// Load sample data if empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM students').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO students (name, email, phone, department, year, cgpa) VALUES (?,?,?,?,?,?)'
  );
  const samples = [
    ['Aarav Sharma',   'aarav.sharma@college.edu',   '9876543210', 'Computer Science',      3, 8.7],
    ['Priya Nair',     'priya.nair@college.edu',     '9123456789', 'Electronics',           2, 9.1],
    ['Rohit Menon',    'rohit.menon@college.edu',    '9000112233', 'Mechanical',            4, 7.5],
    ['Sneha Patel',    'sneha.patel@college.edu',    '9812345678', 'Computer Science',      1, 9.4],
    ['Arjun Reddy',    'arjun.reddy@college.edu',    '9988776655', 'Civil',                 3, 6.8],
    ['Meera Iyer',     'meera.iyer@college.edu',     '9700001234', 'Electronics',           4, 8.2],
    ['Vikram Singh',   'vikram.singh@college.edu',   '9600009876', 'Computer Science',      2, 7.9],
    ['Kavya Krishnan', 'kavya.krishnan@college.edu', '9400005678', 'Information Technology',1, 9.0],
    ['Aditya Kumar',   'aditya.kumar@college.edu',   '9300004321', 'Mechanical',            5, 7.2],
    ['Divya Pillai',   'divya.pillai@college.edu',   '9200008765', 'Civil',                 2, 8.5],
  ];
  const insertMany = db.transaction((rows) => rows.forEach(r => insert.run(...r)));
  insertMany(samples);
  console.log('✅ Sample data loaded: 10 students');
}

// ─── Helpers ──────────────────────────────────────────────────
const apiSuccess = (message, data) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

const apiError = (message, errors = undefined) => ({
  success: false,
  message,
  ...(errors ? { errors } : {}),
  timestamp: new Date().toISOString(),
});

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMap = {};
    errors.array().forEach(e => { errMap[e.path] = e.msg; });
    res.status(400).json(apiError('Validation failed', errMap));
    return false;
  }
  return true;
};

// ─── Validators ───────────────────────────────────────────────
const studentValidators = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone must be 7–15 digits'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').notEmpty().withMessage('Year is required')
    .isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5'),
  body('cgpa').notEmpty().withMessage('CGPA is required')
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0.0 and 10.0'),
];

// ─── Routes ───────────────────────────────────────────────────

// POST /api/students
app.post('/api/students', studentValidators, (req, res) => {
  if (!handleValidation(req, res)) return;
  const { name, email, phone, department, year, cgpa } = req.body;
  try {
    const exists = db.prepare('SELECT id FROM students WHERE email = ?').get(email);
    if (exists) return res.status(409).json(apiError(`A student with email '${email}' already exists`));
    const result = db.prepare(
      'INSERT INTO students (name, email, phone, department, year, cgpa) VALUES (?,?,?,?,?,?)'
    ).run(name.trim(), email.trim().toLowerCase(), phone.trim(), department.trim(), parseInt(year), parseFloat(cgpa));
    const created = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(apiSuccess('Student created successfully', created));
  } catch (err) {
    res.status(500).json(apiError('Failed to create student: ' + err.message));
  }
});

// GET /api/students
app.get('/api/students', (req, res) => {
  try {
    const { search, department, year } = req.query;
    let sql = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }
    if (department) { sql += ' AND department = ?'; params.push(department); }
    if (year)       { sql += ' AND year = ?';       params.push(parseInt(year)); }
    sql += ' ORDER BY id ASC';
    const students = db.prepare(sql).all(...params);
    res.json(apiSuccess('Students retrieved successfully', students));
  } catch (err) {
    res.status(500).json(apiError('Failed to retrieve students'));
  }
});

// GET /api/students/count
app.get('/api/students/count', (req, res) => {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM students').get();
  res.json(apiSuccess('Count retrieved', { count }));
});

// GET /api/students/:id
app.get('/api/students/:id', param('id').isInt({ min: 1 }).withMessage('Invalid student ID'), (req, res) => {
  if (!handleValidation(req, res)) return;
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(parseInt(req.params.id));
  if (!student) return res.status(404).json(apiError(`Student not found with ID: ${req.params.id}`));
  res.json(apiSuccess('Student retrieved successfully', student));
});

// PUT /api/students/:id
app.put('/api/students/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid student ID'),
  ...studentValidators,
], (req, res) => {
  if (!handleValidation(req, res)) return;
  const id = parseInt(req.params.id);
  const { name, email, phone, department, year, cgpa } = req.body;
  try {
    const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!existing) return res.status(404).json(apiError(`Student not found with ID: ${id}`));
    const emailConflict = db.prepare('SELECT id FROM students WHERE email = ? AND id != ?').get(email.trim().toLowerCase(), id);
    if (emailConflict) return res.status(409).json(apiError(`A student with email '${email}' already exists`));
    db.prepare(
      'UPDATE students SET name=?, email=?, phone=?, department=?, year=?, cgpa=? WHERE id=?'
    ).run(name.trim(), email.trim().toLowerCase(), phone.trim(), department.trim(), parseInt(year), parseFloat(cgpa), id);
    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json(apiSuccess('Student updated successfully', updated));
  } catch (err) {
    res.status(500).json(apiError('Failed to update student: ' + err.message));
  }
});

// DELETE /api/students/:id
app.delete('/api/students/:id', param('id').isInt({ min: 1 }).withMessage('Invalid student ID'), (req, res) => {
  if (!handleValidation(req, res)) return;
  const id = parseInt(req.params.id);
  const existing = db.prepare('SELECT id FROM students WHERE id = ?').get(id);
  if (!existing) return res.status(404).json(apiError(`Student not found with ID: ${id}`));
  db.prepare('DELETE FROM students WHERE id = ?').run(id);
  res.json(apiSuccess('Student deleted successfully', null));
});

// ─── 404 catch-all ────────────────────────────────────────────
app.use((req, res) => res.status(404).json(apiError(`Route ${req.method} ${req.path} not found`)));

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Student Management API running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET    /api/students`);
  console.log(`   GET    /api/students/count`);
  console.log(`   GET    /api/students/:id`);
  console.log(`   POST   /api/students`);
  console.log(`   PUT    /api/students/:id`);
  console.log(`   DELETE /api/students/:id`);
});

module.exports = app;
