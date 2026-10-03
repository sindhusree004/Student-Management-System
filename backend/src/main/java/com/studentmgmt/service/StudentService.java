package com.studentmgmt.service;

import com.studentmgmt.dto.StudentDTO;

import java.util.List;

public interface StudentService {
    StudentDTO createStudent(StudentDTO studentDTO);
    List<StudentDTO> getAllStudents();
    StudentDTO getStudentById(Long id);
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    void deleteStudent(Long id);
    List<StudentDTO> searchStudents(String search, String department, Integer year);
    long getStudentCount();
}
