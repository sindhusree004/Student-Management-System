-- ============================================================
-- Student Management System - MySQL Database Schema
-- Run this script after creating the database
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS studentdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studentdb;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(255)  NOT NULL UNIQUE,
    phone      VARCHAR(15)   NOT NULL,
    department VARCHAR(100)  NOT NULL,
    year       INT           NOT NULL CHECK (year BETWEEN 1 AND 5),
    cgpa       DOUBLE        NOT NULL CHECK (cgpa BETWEEN 0.0 AND 10.0),
    CONSTRAINT chk_cgpa CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    CONSTRAINT chk_year CHECK (year >= 1 AND year <= 5)
);

-- Create index on email for fast lookup
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);

-- ============================================================
-- Sample Data (10 fictional students)
-- ============================================================
INSERT INTO students (name, email, phone, department, year, cgpa) VALUES
  ('Aarav Sharma',   'aarav.sharma@college.edu',   '9876543210', 'Computer Science',      3, 8.7),
  ('Priya Nair',     'priya.nair@college.edu',     '9123456789', 'Electronics',           2, 9.1),
  ('Rohit Menon',    'rohit.menon@college.edu',    '9000112233', 'Mechanical',            4, 7.5),
  ('Sneha Patel',    'sneha.patel@college.edu',    '9812345678', 'Computer Science',      1, 9.4),
  ('Arjun Reddy',    'arjun.reddy@college.edu',    '9988776655', 'Civil',                 3, 6.8),
  ('Meera Iyer',     'meera.iyer@college.edu',     '9700001234', 'Electronics',           4, 8.2),
  ('Vikram Singh',   'vikram.singh@college.edu',   '9600009876', 'Computer Science',      2, 7.9),
  ('Kavya Krishnan', 'kavya.krishnan@college.edu', '9400005678', 'Information Technology',1, 9.0),
  ('Aditya Kumar',   'aditya.kumar@college.edu',   '9300004321', 'Mechanical',            5, 7.2),
  ('Divya Pillai',   'divya.pillai@college.edu',   '9200008765', 'Civil',                 2, 8.5);

-- Verify
SELECT COUNT(*) AS total_students FROM students;
